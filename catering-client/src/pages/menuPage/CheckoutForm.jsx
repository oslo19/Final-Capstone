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
const CheckoutForm = () => {
  const { users, refetch } = useUsers();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const { user, sendOtp } = useContext(AuthContext); // Get user from context
  const [coordinates, setCoordinates] = useState(null);
  const [address, setAddress] = useState(""); // Store full address as a string
  const [modal, setModal] = useState(null); // State to store modal reference
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const [scheduledText, setScheduledText] = useState("Select a date and time");
  const [isEditing, setIsEditing] = useState(false); // New state to control edit mode
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [cart] = useCart();
  const [isMobileNumberModalVisible, setIsMobileNumberModalVisible] =
    useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [isMobileEditing, setIsMobileEditing] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const { orderTotal } = location.state || { orderTotal: 0 };
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  {
    /*ORDER SUMMARY */
  }
  const deliveryFee = 100;
  const finalTotal = orderTotal + deliveryFee;
  const currentUser = users.find((u) => u.email === user.email);
  {
    /*User logic */
  }
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

  {
    /*User END */
  }

  {
    /*For Address Logic */
  }

  useEffect(() => {
    if (currentUser) {
      const userCoordinates = currentUser.coordinates;
      const userAddress = currentUser.address;

      if (Array.isArray(userCoordinates) && userCoordinates.length === 2) {
        setCoordinates(userCoordinates);
      } else {
        setCoordinates(defaultCoordinates); // Use fallback if coordinates are missing
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
        {
          address: address,
          coordinates: coordinates,
        }
      );

      if (response.status === 200) {
        refetch();
        Swal.fire("Success", "Address updated successfully", "success");

        if (modal) {
          modal.close();
        }
      } else {
        throw new Error("Failed to update address");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleShowModal = () => {
    const modal = document.getElementById("my_modal_address");
    if (modal) {
      modal.showModal(); // Show the modal using getElementById
    }
  };



  {
    /*Address Logic END*/
  }

  {
    /*Delivery Option Logic */
  }
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);
  const handleConfirm = () => {
    const formattedDate = selectedDateTime.format("MMMM D, YYYY h:mm A");
    setScheduledText(formattedDate);
    setIsEditing(false);
    closeModal();
  };
  {
    /*Delivery END LOGIC */
  }

  {
    /* Mobile Logic or Personal Details */
  }
  const isValidMobileNumber = (value) => {
    const numberWithoutCountryCode = value.replace(/^\+63/, ""); // Remove +63 prefix if present
    return /^\d{9,12}$/.test(numberWithoutCountryCode); // Validate the remaining digits (9 to 12)
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    setMobileNumber(value);

    // Enable the Save button if the input matches the valid pattern
    setIsSaveEnabled(isValidMobileNumber(value));
  };
  const handleSubmitMobileNumber = async (e) => {
    e.preventDefault();
    const formattedNumber = `+63${
      mobileNumber.startsWith("0") ? mobileNumber.slice(1) : mobileNumber
    }`;

    try {
      console.log("Saving phone number:", formattedNumber); // Debugging log

      // Save mobile number to the current user's profile
      const response = await axiosSecure.patch(
        `/users/${currentUser._id}/mobile`,
        {
          phone_number: formattedNumber,
        }
      );

      if (response.status === 200) {
        await refetch();

        const updatedUser = users.find((u) => u.email === user.email);
        if (updatedUser && updatedUser.mobileNumber) {
          setMobileNumber(updatedUser.mobileNumber); // Display the formatted number
        }

        setIsMobileNumberModalVisible(true); // Show the OTP modal
      } else {
        throw new Error(
          response.data.message || "Failed to save mobile number"
        );
      }
    } catch (error) {
      console.error("Error saving mobile number:", error); // Log the error
      Swal.fire("Error", error.message, "error");
    }
  };
  const handleCloseMobileModal = () => {
    setIsMobileNumberModalVisible(false);
  };
  const handlePaymentChange = (method) => {
    setSelectedPaymentMethod(method);
  };
  const hasMobileNumber = currentUser && currentUser.mobileNumber;
  const handleEditClick = () => setIsMobileEditing(!isMobileEditing);
  {
    /* Mobile Logic or Personal Details LOGIC END*/
  }

  return (
    <>
      <div className="max-w-screen-2xl container px-4 mt-36">
        <div className="flex flex-col md:flex-row-reverse items-start justify-between">
          {/* Order Summary */}
          <div className="md:w-1/3 mr-28">
            <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
              <h1 className="font-bold text-2xl">Order Summary</h1>
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between mb-2 mt-5 font-medium text-sm text-gray-500"
                >
                  <p>
                    {item.quantity} x {item.name}
                  </p>
                  <p className="font-normal text-black">
                    ₱ {item.price * item.quantity}
                  </p>
                </div>
              ))}

              <div className="divider my-4"></div>

              {/* Subtotal */}
              <div className="flex justify-between font-medium text-gray-500 text-md">
                <p>Subtotal</p>
                <p className="font-bold text-black">
                  ₱ {orderTotal.toFixed(2)}
                </p>
              </div>

              {/* Delivery Fee */}
              <div className="flex justify-between font-medium text-gray-500 text-md mt-3">
                <p>Scheduled delivery</p>
                <p className="font-bold text-black">
                  ₱ {deliveryFee.toFixed(2)}
                </p>
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold text-xl mt-6">
                <p>Total</p>
                <p>₱ {finalTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="text-white w-full md:w-1/2 ml-12">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
              <form className="space-y-6" onSubmit={handleSubmitAddress}>
                <div className="flex items-start">
                  <label className="ms-2 text-2xl font-bold text-gray-900">
                    Delivery address
                  </label>
                  {currentUser?.address && (
                    <button
                      type="button"
                      className="ms-auto text-sm text-gray-900 hover:bg-gray-200 px-4"
                      onClick={handleShowModal}
                    >
                      Change
                    </button>
                  )}
                </div>

                {/* Display the current address */}
                {currentUser?.address ? (
                  <>
                    <div className="flex font-bold gap-1">
                      <SlLocationPin className="text-black h-5 w-auto" />
                      <p className="text-sm text-gray-500">
                        {currentUser.address}
                      </p>
                    </div>
                    <div className="relative bg-inherit mt-4">
                      <textarea
                        id="deliveryNote"
                        rows="4"
                        className="peer text-xs bg-transparent h-32 w-full rounded-lg text-black placeholder:text-xs placeholder-transparent ring-2 px-2 ring-gray-400 focus:ring-black focus:outline-none focus:border-black"
                        placeholder="Write something..."
                      ></textarea>
                      <label
                        htmlFor="deliveryNote"
                        className="absolute start-2 text-xs cursor-text left-1 -top-2.5 text-gray-400 bg-gray-50 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-black peer-focus:text-xs transition-all "
                      >
                        Note to delivery - e.g. building, landmark
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">
                      No address available
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        modal.showModal();
                      }}
                      className="btn"
                    >
                      Add address
                    </button>
                  </>
                )}
              </form>

              {/* Modal for address input */}
              <dialog id="my_modal_address" className="modal modal-middle">
                <div className="modal-box max-w-2xl w-full">
                  <h3 className="font-bold text-lg text-black flex gap-2">
                    What&#39;s your exact location?
                  </h3>
                  <p className="text-sm text-black">
                    Providing your location enables more accurate search and
                    delivery ETA, seamless order tracking, and personalized
                    recommendations.
                  </p>

                  {/* Location input */}
                  <div>
                    <MapSearchBox
                      onAddressSelect={handleAddressSelect}
                      currentAddress={currentUser?.address || ""}
                    />
                  </div>
                  <div className="my-5">
                    <Map center={coordinates} />
                  </div>

                  {/* Submit button for modal */}
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      className="btn bg-black text-white"
                      onClick={handleSubmitAddress}
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("my_modal_address").close()
                    }
                  >
                    Close
                  </button>
                </form>
              </dialog>
            </div>

            {/*Delivery Option */}
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
              <h1 className="font-bold text-2xl text-black">
                Delivery options
              </h1>

              {/* Standard Delivery Option */}
              <div className="flex items-center ps-4 border-2 border-gray-200 rounded-lg mt-5 focus-within:ring-black focus-within:border-black">
                <label
                  htmlFor="bordered-radio-1"
                  className="flex items-center w-full cursor-pointer"
                >
                  <input
                    id="bordered-radio-1"
                    type="radio"
                    value=""
                    name="bordered-radio"
                    className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black"
                  />
                  <span className="w-full py-4 ms-2 text-lg font-bold text-gray-900">
                    Standard
                    <span className="text-gray-600 text-md mx-3 font-normal">
                      5 - 20 mins
                    </span>
                  </span>
                </label>
              </div>

              {/* Scheduled Delivery Option */}
              <div className="flex items-center ps-4 border-2 border-gray-200 rounded-lg mt-2 focus-within:ring-black focus-within:border-black">
                <label
                  htmlFor="bordered-radio-2"
                  className="flex items-center w-full cursor-pointer"
                >
                  <input
                    id="bordered-radio-2"
                    type="radio"
                    name="bordered-radio"
                    className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black"
                    onClick={openModal}
                  />
                  <span className="w-full py-4 ms-2 text-lg font-bold text-gray-900">
                    Scheduled
                    <span className="text-gray-600 text-sm mx-3 font-normal">
                      {scheduledText}
                    </span>
                  </span>
                </label>
                {scheduledText !== "Select a date and time" && (
                  <button
                    type="button"
                    className="btn border-0 bg-transparent text-sm text-black ms-auto"
                    onClick={() => {
                      setIsEditing(true);
                      openModal(); // Open modal for editing
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>

              {/* Time Picker Modal */}
              {isModalVisible && (
                <div
                  id="timepicker-modal"
                  tabIndex="-1"
                  aria-hidden="true"
                  className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
                >
                  <div className="relative p-4 w-full max-w-[50rem] max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                      {/* Modal Header */}
                      <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {isEditing
                            ? "Edit your schedule"
                            : "Schedule an appointment"}
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          data-modal-toggle="timepicker-modal"
                          onClick={closeModal}
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>

                      {/* Date & Time Picker */}
                      <div className="p-4 pt-0">
                        <div className="mx-auto sm:mx-0 flex justify-center my-5">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <StaticDateTimePicker
                              orientation="landscape"
                              value={selectedDateTime}
                              onChange={(newValue) =>
                                setSelectedDateTime(newValue)
                              }
                              minDate={dayjs()} // Prevent selecting past dates
                            />
                          </LocalizationProvider>
                        </div>

                        {/* Confirm Button */}
                        <button
                          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                          onClick={handleConfirm}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/*PERSONAL DETAILS */}
            {hasMobileNumber && isMobileEditing ? (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
                <h1 className="font-bold text-2xl text-black flex items-center">
                  Personal Details
                  {hasMobileNumber && (
                    <span
                      onClick={handleEditClick}
                      className="btn btn-ghost ml-auto w-2 cursor-pointer"
                    >
                      {isMobileEditing ? "Cancel" : "Edit"}
                    </span>
                  )}
                </h1>
                <p className="text-black font-semibold mt-6 text-sm">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-black font-normal mt-1 text-sm">
                  {currentUser.email}
                </p>
                <p className="text-black font-normal mt-1 text-sm">
                  {currentUser.mobileNumber}
                </p>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
                <h1 className="font-bold text-2xl text-black flex items-center">
                  Personal Details
                  {hasMobileNumber && (
                    <span
                      onClick={handleEditClick}
                      className="btn btn-ghost ml-auto w-[50px] cursor-pointer"
                    >
                      {isMobileEditing ? "Cancel" : "Edit"}
                    </span>
                  )}
                </h1>

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
                  {/* First Name */}
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      className="block px-2.5  pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder=" "
                    />
                    <label
                      htmlFor="firstName"
                      className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 start-2 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                    >
                      First Name
                    </label>
                  </div>

                  {/* Last Name */}
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
                    className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
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

                {/* Save Button */}
                <div className="flex justify-start mt-6">
                  <button
                    onClick={handleSubmitMobileNumber}
                    type="submit"
                    className={`w-full py-3 text-white rounded-lg ${
                      isSaveEnabled
                        ? "bg-prime hover:bg-orange-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!isSaveEnabled}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* PASS TO MOBILENUMBEROMDAL */}
            {isMobileNumberModalVisible && (
              <MobileNumberModal
                mobileNumber={mobileNumber}
                currentUserId={currentUser._id}
                onClose={handleCloseMobileModal}
              />
            )}

            {/*PAYMENT DETAILS */}
            {hasMobileNumber && (
              <div className="mt-4  bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-6">
                <h1 className="font-bold text-[24px] text-black">Payment</h1>
                {/* GCash Option */}
                <div
                  className={`border-2 rounded-lg p-4 focus-within:ring-2 mb-3 ${
                    selectedPaymentMethod === "GCash"
                      ? "text-black border-black ring-black"
                      : "border-gray-200 text-black"
                  }`}
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="GCash"
                      className="mr-3 text-black focus:ring-black h-[20px] w-[20px]"
                      onChange={() => handlePaymentChange("GCash")}
                    />
                    <img
                      className="w-[45px] h-[35px] mr-3"
                      src="https://images.deliveryhero.io/image/foodpanda/payment_icons/payment_method/ic-payments-antfinancial_gcash-xs.png"
                      alt="GCash"
                    />
                    <span className="font-medium text-lg">
                      GCash (Alipay+ Partner)
                    </span>
                  </label>

                  {/* Conditionally render paragraph for GCash */}
                  {selectedPaymentMethod === "GCash" && (
                    <p className="mt-3 text-sm font-normal text-black font-sans">
                      You will be redirected to GCash after checkout. After
                      you&apos;ve performed the payment, you will be redirected
                      back to Foodpanda.
                    </p>
                  )}
                </div>

                {/*Credit Card */}
                <div
                  className={`border-2 rounded-lg p-4 focus-within:ring-2 ${
                    selectedPaymentMethod === "CreditCard"
                      ? "text-black border-black ring-black"
                      : "border-gray-200 text-black "
                  }`}
                >
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="CreditCard"
                      className="mr-3 text-black focus:ring-black h-[20px] w-[20px]"
                      onChange={() => handlePaymentChange("CreditCard")}
                    />
                    <div className="flex gap-1">
                      <img
                        className="w-[45px] h-[35px] mr-2"
                        src="https://images.deliveryhero.io/image/foodpanda/payment_icons/payment_method/ic-payments-credit_card-xs.png"
                        alt="CreditCard"
                      />
                      <span className="font-medium text-lg">
                        Credit / Debit Card
                      </span>
                      <img
                        className="w-[32px] h-[24px] mr-3"
                        src="https://images.deliveryhero.io/image/foodpanda/payment_icons/payment_schema/ic-payments-Mastercard-xs.png"
                        alt=""
                      />
                      <img
                        className="w-[32px] h-[24px] mr-3"
                        src="https://images.deliveryhero.io/image/foodpanda/payment_icons/payment_schema/ic-payments-Visa-xs.png"
                        alt=""
                      />
                      <img
                        className="w-[32px] h-[24px] mr-3"
                        src="https://images.deliveryhero.io/image/foodpanda/payment_icons/payment_schema/ic-payments-Maestro-xs.png"
                        alt=""
                      />
                      <img
                        className="w-[32px] h-[24px] mr-3"
                        src="https://images.deliveryhero.io/image/foodpanda/payment_icons/payment_schema/ic-payments-JCB-xs.png"
                        alt=""
                      />
                      <img
                        className="w-[32px] h-[24px] mr-3"
                        src="https://images.deliveryhero.io/image/foodpanda/payment_icons/payment_schema/ic-payments-AmericanExpress-xs.png"
                        alt=""
                      />
                    </div>
                  </label>

                  {/* Conditionally render paragraph for GCash */}
                  {selectedPaymentMethod === "CreditCard" && (
                    <p className="mt-3 text-sm font-normal text-black font-sans">
                      You will be redirected to GCash after checkout. After
                      you&apos;ve performed the payment, you will be redirected
                      back to Foodpanda.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/*AGREEMENT  */}
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
              <div className="flex items-start text-black">
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox mt-1 mr-4"
                />
                <label className="text-left cursor-pointer font-medium text-gray-800">
                  I hereby give La Estellita the permission to share my customer
                  data with the Restaurant, and as applicable, their respective
                  affiliates and subsidiaries, for service improvement and/or
                  other related marketing purposes. I can find detailed
                  information about the customer data sharing{" "}
                  <a href="#" className="text-blue-500 underline">
                    <span className="link link-underline link-underline-black text-black">
                      here
                    </span>
                  </a>
                  .
                </label>
              </div>
            </div>

            {/*PLAC ORDER BUTTON */}
            <div className="mt-9">
              <button
                type="submit"
                className="w-full justify-center py-3 border border-transparent shadow-sm text-md font-medium rounded-lg text-white bg-prime hover:bg-orange-700"
              >
                Place order
              </button>
            </div>
            {/*CONDITION */}
            <p className="text-white mt-4 text-xs">
              By making this purchase you agree to our terms and conditions.
            </p>
            <p className="text-white mt-4 text-xs">
              I agree that placing the order places me under an obligation to
              make a payment in accordance with the General Terms and
              Conditions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
