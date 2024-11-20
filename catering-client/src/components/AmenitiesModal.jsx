import React, { useContext, useEffect, useState } from "react";
import CartPopover from "./CartPopover";
import { AuthContext } from "../contexts/AuthProvider";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import RentalCartPopover from "./RentalCartPopover";
import useBookingRentalCart from "../hooks/useBookingRentalCart";

const AmenitiesModal = ({
  selectedMenuType,
  handleAmenitiesToggleModal,
  showAmenitiesModal,
  rentalItems,
  pax,
}) => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [isBookingRentalCartPopoverVisible, setBookingRentalCartPopoverVisible] = useState(false);
  const [bookingRentalCart, refetch] = useBookingRentalCart(); 
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState(rentalItems);
  const [hasAddedToCart, setHasAddedToCart] = useState(false);

  
  useEffect(() => {
    if (showAmenitiesModal && !hasAddedToCart && rentalItems.length > 0) {
      rentalItems.forEach((item) => {
        const quantity = calculateQuantity(item, pax);

        // Check if item already exists in the cart
        const isInCart = bookingRentalCart.some(
          (cartItem) => cartItem.rentalItemId === item._id
        );

        if (!isInCart && quantity > 0) {
          axios
            .post("http://localhost:6001/booking-rental-cart", {
              email: user.email,
              rentalItemId: item._id,
              name: item.name,
              price: item.price,
              quantity: quantity,
              image: item.image,
            })
            .then(() => refetch())
            .catch((error) => console.error(error));
        }
      });

      // Mark items as added
      setHasAddedToCart(true);
    }
  }, [showAmenitiesModal, rentalItems, pax, bookingRentalCart, hasAddedToCart, refetch]);

  
  useEffect(() => {
    if (showAmenitiesModal) {
      document.body.classList.add("overflow-hidden");
      setFilteredItems(rentalItems);
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showAmenitiesModal, rentalItems]);

  const filterItems = (category) => {
    const filtered =
      category === "all"
        ? rentalItems
        : rentalItems.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    setFilteredItems(filtered);
  };

  useEffect(() => {
    filterItems(selectedCategory);
  }, [selectedCategory, rentalItems]);

  if (!showAmenitiesModal) return null;

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddToCart = (item) => {
    const quantity = calculateQuantity(item, pax); // Calculate quantity based on pax
    const totalPrice = item.price * quantity;
  
    if (user && user.email) {
      const rentalItem = {
        email: user.email,
        rentalItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: quantity,
        totalPrice: totalPrice,
        image: item.image,
      };
  
      axios
        .post("http://localhost:6001/booking-rental-cart", rentalItem)
        .then((response) => {
          if (response) {
            refetch();
            Swal.fire({
              position: "center",
              icon: "success",
              title: `${item.name} added to the cart with quantity: ${quantity}`,
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
        title: "Please login to rent this item",
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

  const cartSubtotal = bookingRentalCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const orderTotal = cartSubtotal;

  const toggleCartPopover = () => {
    setBookingRentalCartPopoverVisible((prev) => !prev);
  };

  const handleConfirm = () => {
    onConfirm(bookingRentalCart);
    handleAmenitiesToggleModal();
  };


  const calculateQuantity = (item, pax) => {
    switch (item.name) {
      case "CHAIR":
        return pax; // 1 chair per person
      case "Tables":
        return Math.ceil(pax / 10); // 1 table per 10 pax
      case "Tent (10x10 ft)":
        return Math.ceil(pax / 20); // 1 tent per 20 pax
      case "Buffet Setup":
        return 1; // Fixed quantity
      case "Plate/Utensils":
        return pax; // 1 plate and utensil per person
      case "Glasses":
        return pax; // 1 glass per person
      case "Linens (Tables)":
        return Math.ceil(pax / 10); // 1 linen per table
      case "Centerpieces":
        return Math.ceil(pax / 10); // 1 centerpiece per table
      default:
        console.warn(`Unmatched item name: ${item.name}`);
        return 0; // Default quantity is 0 for unmatched items
    }
  };
  

  
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[90%] h-[90%] m-4 overflow-hidden z-50 mt-9">
        <h3 className="text-2xl leading-6 font-medium text-gray-900 text-center">
          Rental Items
        </h3>
        
        {/* Filter Section */}
        <div className="flex items-end mr-40">
          <select className="select w-full max-w-xs" onChange={handleCategoryChange}>
            <option value="all">All</option>
            <option value="tent">Tent</option>
            <option value="tables">Tables</option>
            <option value="seating">Seating</option>
            <option value="linean">Linean & Napkins</option>
            {/* Add other rental categories here */}
          </select>
        </div>

        {/* Rental Items */}
        <div className="prose p-6 overflow-y-auto" style={{ maxHeight: "50vh" }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filteredItems.map((item, index) => (
              <div key={index} className="relative m-4 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border bg-white shadow-md">
                <a className="relative mx-3 mt-3 h-60 overflow-hidden rounded-xl flex justify-center" href="#">
                  <img className="object-cover" src={item.image} alt="product" />
                </a>
                <div className="mt-4 px-5 pb-5">
                  <h5 className="text-xl text-slate-900">{item.name}</h5>
                  <p className="text-3xl font-bold text-slate-900">₱{item.price}</p>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
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
                {bookingRentalCart.length || 0}
              </span>
            </div>
          </label>

          <dl className="flex items-center justify-between gap-4 pt-2">
            <dt className="text-xl font-bold text-gray-900 dark:text-white">
              Total ({bookingRentalCart.length} item)
            </dt>
            <dd className="text-2xl font-bold text-gray-900 dark:text-white">
              ₱{orderTotal.toFixed(2)}
            </dd>
          </dl>

          <RentalCartPopover isVisible={isBookingRentalCartPopoverVisible} />

          <button
            onClick={handleAmenitiesToggleModal}
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

export default AmenitiesModal;
