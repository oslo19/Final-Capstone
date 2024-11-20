import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import useUsers from "../../hooks/useUser";
import MenuModal from "../../components/MenuModal";
import useMenu from "../../hooks/useMenu";
import useVenue from "../../hooks/useVenue";
import useRental from "../../hooks/useRental";
import useBookingCart from "../../hooks/useBookingCart";
import AmenitiesModal from "../../components/AmenitiesModal";
import useBookingRentalCart from "../../hooks/useBookingRentalCart";
import { Link, useNavigate } from "react-router-dom";
import VenueModal from "../../components/VenueModal";
import useBookingVenueCart from "../../hooks/useBookingVenueCart";

const OnlineBooking = () => {
  const navigate = useNavigate();
  const { users, refetch } = useUsers();
  const axiosSecure = useAxiosSecure();
  const { user, sendOtp } = useContext(AuthContext);
  useState(false);
  const MINIMUM_PAX = 30;
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [menu, loading] = useMenu();
  const [rental] = useRental();
  const [venue] = useVenue();
  const currentUser = users.find((u) => u.email === user.email);
  const [selectedMenuType, setSelectedMenuType] = useState("");
  const [bookingCart, refetchBookingCart] = useBookingCart();
  const [bookingRentalCart, refetchbookingRentalCart] = useBookingRentalCart();
  const [bookingVenueCart, refetchbookingVenueCart] = useBookingVenueCart();
  const [typeOfEvent, setTypeOfEvent] = useState("");
  const [numberOfPax, setNumberOfPax] = useState(MINIMUM_PAX);

  console.log(venue);

  const handleTypeOfEventChange = (event) => {
    setTypeOfEvent(event.target.value);
  };

  const handleNumberOfPaxChange = (event) => {
    const value = event.target.value;
    // Allow user to type freely but keep the raw input
    setNumberOfPax(value);
  };

  const handleNumberOfPaxBlur = () => {
    // Validate when the input loses focus
    const parsedPax = parseInt(numberOfPax, 10);
    if (isNaN(parsedPax) || parsedPax < MINIMUM_PAX) {
      Swal.fire(
        "Invalid Pax",
        `The minimum number of pax is ${MINIMUM_PAX}. It has been automatically adjusted.`,
        "warning"
      );
      setNumberOfPax(MINIMUM_PAX); // Reset to minimum if invalid
    } else {
      setNumberOfPax(parsedPax); // Apply valid input
    }
  };

  const handleMenuToggleModal = () => {
    setShowMenuModal((prev) => !prev);
  };

  const handleVenueToggleModal = () => {
    setShowVenueModal((prev) => !prev);
  };

  const handleAmenitiesToggleModal = () => {
    setShowAmenitiesModal((prev) => !prev);
  };

  const handleMenuTypeChange = (event) => {
    setSelectedMenuType(event.target.value);
  };
  const totalMenuPrice = bookingCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalRentalPrice = bookingRentalCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalVenuePrice = bookingVenueCart.reduce(
    (total, item) => total + item.rentalPrice, // Assuming venues don't have quantity
    0
  );

  const totalPrice = totalMenuPrice + totalRentalPrice + totalVenuePrice;

  const handleProceedToCheckout = () => {
    // Validation for required fields
    if (!typeOfEvent) {
      Swal.fire("Error", "Please select a type of event.", "error");
      return;
    }

    if (!numberOfPax || isNaN(numberOfPax) || numberOfPax < MINIMUM_PAX) {
      Swal.fire(
        "Error",
        `Please enter a valid number of pax (minimum ${MINIMUM_PAX}).`,
        "error"
      );
      return;
    }

    if (!selectedMenuType) {
      Swal.fire("Error", "Please select a type of menu.", "error");
      return;
    }

    // Proceed to checkout if all validations pass
    navigate("/process-checkout", {
      state: {
        menuItems: bookingCart,
        rentalItems: bookingRentalCart,
        venueItems: bookingVenueCart,
        orderTotal: totalPrice,
        source: "booking",
        typeOfEvent,
        numberOfPax,
        typeOfMenu: selectedMenuType,
      },
    });
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="py-10 flex flex-col items-center justify-center"></div>
      <div className="w-full py-48 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8">
        <h1 className="font-bold text-2xl text-black flex-1 text-center">
          Catering Order Form
        </h1>
        <div className="relative mx-auto mt-4">
          <select
            id="countries"
            className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
            value={typeOfEvent}
            onChange={handleTypeOfEventChange}
          >
            <option value="" disabled>
              Select Type of Event
            </option>
            <option value="corporate">Corporate Event</option>
            <option value="wedding">Wedding</option>
            <option value="birth">Birthday Party</option>
            <option value="social">Social Gathering</option>
            <option value="other">Other</option>
          </select>

          <label
            htmlFor="countries"
            className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            Type of Event
          </label>
        </div>

        <div className="relative mt-4">
          <input
            type="number"
            id="numberOfPax"
            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
            value={numberOfPax}
            onChange={handleNumberOfPaxChange}
            onBlur={handleNumberOfPaxBlur} // Validate on blur
          />
          <label
            htmlFor="numberOfPax"
            className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 start-2 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            Number of Pax (Minimum {MINIMUM_PAX})
          </label>
        </div>

        <div className="relative mx-auto mt-4">
          <select
            id="countries"
            onChange={handleMenuTypeChange}
            className="block w-full px-2.5 pb-2.5 pt-4 text-sm text-black bg-transparent rounded-lg border-1 border-gray-300 focus:outline-none focus:ring-0 focus:border-black peer"
            defaultValue="" // Sets default selected option
          >
            <option value="" disabled>
              Select Type of Menu
            </option>
            <option value="Buffet Type">Buffet Type</option>
            <option value="Packed Meals">Packed Meals</option>
          </select>

          <label
            htmlFor="countries"
            className="absolute text-xs text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 bg-white px-2 peer-placeholder-shown:scale-110 peer-placeholder-shown:-translate-y-1/3 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            Type of Menu
          </label>
        </div>
        <button
          onClick={handleMenuToggleModal}
          className="block text-white bg-prime hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-gray-300 my-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          SHOW MENU
        </button>

        <MenuModal
          showMenuModal={showMenuModal}
          handleMenuToggleModal={handleMenuToggleModal}
          menuItems={menu}
          selectedMenuType={selectedMenuType}
        />

        {/* Display current booking cart items */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Current Booking Menu</h2>
          {bookingCart.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {bookingCart.map((item, index) => (
                <div key={index} className="w-full max-w-xs mx-auto">
                  <div className="rounded-xl  bg-gray-100 border border-gray-200 flex flex-col items-center gap-3 transition-all duration-500 hover:border-gray-400">
                    <div className="img-box w-24 h-24">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h2 className="font-medium text-md text-black mb-1">
                        {item.name}
                      </h2>
                      <h6 className="font-semibold text-lg text-gray-600">
                        ₱{item.price}
                      </h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No items in your booking cart.</p>
          )}
        </div>
        <div className="divider"></div>
        <button
          onClick={handleAmenitiesToggleModal}
          className="block text-white bg-prime hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-gray-300 my-6 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          SHOW AMENITIES
        </button>

        <AmenitiesModal
          showAmenitiesModal={showAmenitiesModal}
          handleAmenitiesToggleModal={handleAmenitiesToggleModal}
          rentalItems={rental}
          pax={numberOfPax}
        />

        {/* Display current booking amenities cart items */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">
            Current Booking Amenities
          </h2>
          {bookingRentalCart.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {bookingRentalCart.map((item, index) => (
                <div key={index} className="w-full max-w-xs mx-auto">
                  <div className="rounded-xl  bg-gray-100 border border-gray-200 flex flex-col items-center gap-3 transition-all duration-500 hover:border-gray-400">
                    <div className="img-box w-24 h-24">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h2 className="font-medium text-md text-black mb-1">
                        {item.name}
                      </h2>
                      <h6 className="font-semibold text-lg text-gray-600">
                        ₱{item.price}
                      </h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No items in your booking cart.</p>
          )}
        </div>
        <div className="divider"></div>
        <button
          onClick={handleVenueToggleModal}
          className="block text-white bg-prime hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-gray-300 my-6 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          SHOW VENUE
        </button>
        <VenueModal
          showVenueModal={showVenueModal}
          handleVenueToggleModal={handleVenueToggleModal}
          venueItems={venue}
        />

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Current Booking Venue</h2>
          {bookingVenueCart.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {bookingVenueCart.map((item, index) => (
                <div key={index} className="w-full max-w-xs mx-auto">
                  <div className="rounded-xl  bg-gray-100 border border-gray-200 flex flex-col items-center gap-3 transition-all duration-500 hover:border-gray-400">
                    <div className="img-box w-24 h-24">
                      <img
                        src={item.images}
                        alt={item.venueName}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h2 className="font-medium text-md text-black mb-1">
                        {item.venueName}
                      </h2>
                      <h6 className="font-semibold text-lg text-gray-600">
                        ₱{item.rentalPrice}
                      </h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No items in your booking cart.</p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-prime text-white rounded-lg px-6 py-2 mt-4 w-full"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineBooking;
