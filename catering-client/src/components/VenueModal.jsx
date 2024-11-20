import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import VenueCartPopover from "./VenueCartPopOver";
import useBookingVenueCart from "../hooks/useBookingVenueCart";
import { IoPeopleSharp } from "react-icons/io5";
import { FaChair } from "react-icons/fa";

const VenueModal = ({ handleVenueToggleModal, showVenueModal, venueItems }) => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [isBookingVenueCartPopoverVisible, setBookingVenueCartPopoverVisible] =
    useState(false);
  const [bookingVenueCart, refetch] = useBookingVenueCart();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState(venueItems);

  useEffect(() => {
    if (showVenueModal) {
      document.body.classList.add("overflow-hidden");
      setFilteredItems(venueItems);
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showVenueModal, venueItems]);

  const filterItems = (category) => {
    const filtered =
      category === "all"
        ? venueItems
        : venueItems.filter(
            (item) => item.category?.toLowerCase() === category.toLowerCase()
          );
    setFilteredItems(filtered);
  };

  useEffect(() => {
    filterItems(selectedCategory);
  }, [selectedCategory, venueItems]);

  if (!showVenueModal) return null;

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddToCart = (item) => {
    if (user && user.email) {
      // Prepare venue item data according to the bookingVenueCart schema
      const venueItem = {
        email: user.email,
        venueId: item._id,
        venueName: item.venueName,
        description: item.description,
        address: item.address,
        images: item.images, // Ensure this is an array
        rentalPrice: item.rentalPrice,
        capacity: item.capacity,
        bookingDate: new Date().toISOString(), // Example booking date (modify as needed)
      };

      axios
        .post("http://localhost:6001/booking-venue-cart", venueItem)
        .then((response) => {
          if (response) {
            refetch(); // Refetch the cart data
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Venue added to the cart.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: error.response?.data?.message || "An error occurred",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        title: "Please login to book this venue",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login now!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };

  // Calculate total price (sum of rentalPrice for all venues in the cart)
  const orderTotal = bookingVenueCart.reduce(
    (total, item) => total + item.rentalPrice,
    0
  );

  const toggleCartPopover = () => {
    setBookingVenueCartPopoverVisible((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[90%] h-[90%] m-4 overflow-hidden z-50 mt-9">
        <h3 className="text-2xl leading-6 font-medium text-gray-900 text-center">
          Venue Items
        </h3>

        {/* Filter Section */}
        <div className="flex items-end mr-40">
          <select
            className="select w-full max-w-xs"
            onChange={handleCategoryChange}
          >
            <option value="all">All</option>
            <option value="conference">Conference</option>
            <option value="banquet">Banquet</option>
            {/* Add other venue categories here */}
          </select>
        </div>

        {/* Venue Items */}
        <div
          className="prose p-6 overflow-y-auto"
          style={{ maxHeight: "50vh" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="relative m-4 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border bg-white shadow-md"
              >
                <a
                  className="relative mx-3 mt-3 h-60 overflow-hidden rounded-xl flex justify-center"
                  href="#"
                >
                  <img
                    className="object-cover"
                    src={item.images?.[0]} // Display the first image
                    alt="Venue"
                  />
                </a>
                <div className="mt-4 px-5 pb-5">
                  <h5 className="text-xl text-slate-900">{item.venueName}</h5>
                  <p className="text-sm font-bold text-gray-500 my-2">
                    {item.address}
                  </p>

                  {/* Flex container for price and icons */}
                  <div className="flex items-center justify-between mt-2">
                    {/* Left: Rental Price */}
                    <p className="text-3xl font-bold text-slate-900">
                      ₱{item.rentalPrice}
                    </p>

                    {/* Right: Chair and People icons */}
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center">
                        <FaChair />
                        <span className="ml-1">{item.capacity}</span>
                      </div>
                      <div className="flex items-center">
                        <IoPeopleSharp />
                        <span className="ml-1">{item.capacity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 mt-4"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between fixed bottom-0 left-0 w-full lg:w-full mx-auto border-t border-gray-200">
          <label
            tabIndex={0}
            onClick={toggleCartPopover}
            className="btn btn-ghost btn-circle lg:flex items-center justify-center mr-3"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge badge-sm indicator-item">
                {bookingVenueCart.length || 0}
              </span>
            </div>
          </label>

          <dl className="flex items-center justify-between gap-4 pt-2">
            <dt className="text-xl font-bold text-gray-900 dark:text-white">
              Total ({bookingVenueCart.length} item
              {bookingVenueCart.length > 1 ? "s" : ""})
            </dt>
            <dd className="text-2xl font-bold text-gray-900 dark:text-white">
              ₱{orderTotal.toFixed(2)}
            </dd>
          </dl>

          <VenueCartPopover isVisible={isBookingVenueCartPopoverVisible} />

          <button
            onClick={handleVenueToggleModal}
            type="button"
            className="inline-flex justify-center rounded-md border shadow-sm px-4 py-3 bg-black text-white font-medium text-sm"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueModal;
