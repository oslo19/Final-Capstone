import React, { useContext, useState, useEffect } from "react";
import Map from "../../components/Map";
import MapSearchBox from "../../components/MapSearchBox";
import { AuthContext } from "../../contexts/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { SlLocationPin } from "react-icons/sl";
import "react-datepicker/dist/react-datepicker.css";
import useCart from "../../hooks/useCart";
import { useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import dayjs from "dayjs";
import MobileNumberModal from "../../components/MobileNumberModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import useUsers from "../../hooks/useUser";

const defaultCoordinates = [10.239613, 123.780381];
const OnlineBooking = () => {
  const { users, refetch } = useUsers();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const { user, sendOtp } = useContext(AuthContext);
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const [scheduledText, setScheduledText] = useState("Select a date and time");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [cart] = useCart();
  const [isMobileNumberModalVisible, setIsMobileNumberModalVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const { orderTotal } = location.state || { orderTotal: 0 };
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const deliveryFee = 100;
  const finalTotal = orderTotal + deliveryFee;
  const currentUser = users.find((u) => u.email === user.email);

  useEffect(() => {
    if (user) {
      if (user.displayName) {
        const names = user.displayName.split(" ");
        const first = names.slice(0, 2).join(" ");
        const last = names[names.length - 1];
        setFirstName(first || "");
        setLastName(last || "");
      }

      if (currentUser && currentUser.mobileNumber) {
        setMobileNumber(currentUser.mobileNumber);
      }
    }
  }, [user, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const userCoordinates = currentUser.coordinates;
      const userAddress = currentUser.address;

      if (Array.isArray(userCoordinates) && userCoordinates.length === 2) {
        setCoordinates(userCoordinates);
      } else {
        setCoordinates(defaultCoordinates);
      }

      setAddress(userAddress || "No address available");
    }
  }, [currentUser]);

  const handleAddressSelect = (suggestion) => {
    const { lat, lon, display_name } = suggestion;

    if (lat && lon) {
      setAddress(display_name);
      setCoordinates([parseFloat(lat), parseFloat(lon)]);
    } else {
      Swal.fire("Error", "Invalid coordinates selected.", "error");
    }
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosSecure.patch(
        `/users/${currentUser._id}/address`,
        { address: address, coordinates: coordinates }
      );
      if (response.status === 200) {
        refetch();
        Swal.fire("Success", "Address updated successfully", "success");
      } else {
        throw new Error("Failed to update address");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const isValidMobileNumber = (value) => {
    const numberWithoutCountryCode = value.replace(/^\+63/, "");
    return /^\d{9,12}$/.test(numberWithoutCountryCode);
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    setMobileNumber(value);
    setIsSaveEnabled(isValidMobileNumber(value));
  };

  const handleSubmitMobileNumber = async (e) => {
    e.preventDefault();
    const formattedNumber = `+63${mobileNumber.startsWith("0") ? mobileNumber.slice(1) : mobileNumber}`;

    try {
      const response = await axiosSecure.patch(
        `/users/${currentUser._id}/mobile`,
        { phone_number: formattedNumber }
      );

      if (response.status === 200) {
        await refetch();
        const updatedUser = users.find((u) => u.email === user.email);
        if (updatedUser && updatedUser.mobileNumber) {
          setMobileNumber(updatedUser.mobileNumber);
        }
        setIsMobileNumberModalVisible(true);
      } else {
        throw new Error(response.data.message || "Failed to save mobile number");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleCloseModal = () => {
    setIsMobileNumberModalVisible(false);
  };

  const handlePaymentChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="py-24 flex flex-col items-center justify-center"></div>
      <div className="w-full py-48 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
        <h1 className="font-bold text-2xl text-black flex-1 text-center">Catering Order Form</h1>

        {/* Email Field */}
        <div className="relative mt-6">
          <input
            value={user.email}
            type="email"
            id="email"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            placeholder=" "
            disabled
          />
          <label
            htmlFor="email"
            className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 start-2 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            Email
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="relative">
            <input
              type="text"
              id="firstName"
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder=" "
            />
            <label
              htmlFor="firstName"
              className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-3 peer-placeholder-shown:scale-110 start-2 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              First Name
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="lastName"
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder=" "
            />
            <label
              htmlFor="lastName"
              className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 start-2 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Last Name
            </label>
          </div>
        </div>

        {/* Mobile Number */}
        <div className="relative mt-4">
          <input
            type="text"
            id="mobileNumber"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            placeholder=" "
          />
          <label
            htmlFor="mobileNumber"
            className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 start-2 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            Mobile Number
          </label>
        </div>

     

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-prime text-white rounded-lg px-6 py-2 mt-4 w-full"
            disabled={!isSaveEnabled}
            onClick={handleSubmitMobileNumber}
          >
            Submit Order
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default OnlineBooking;
