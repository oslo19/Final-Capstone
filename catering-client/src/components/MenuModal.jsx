import React, { useContext, useEffect, useRef, useState } from "react";
import CartPopover from "./CartPopover";
import useCart from "../hooks/useCart";
import { AuthContext } from "../contexts/AuthProvider";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import useBookingCart from "../hooks/useBookingCart";

const MenuModal = ({
  showMenuModal,
  handleMenuToggleModal,
  menuItems,
  selectedMenuType,
}) => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [isCartPopoverVisible, setCartPopoverVisible] = useState(false);
  const [bookingCart, refetch] = useBookingCart();
  const [priceRange, setPriceRange] = useState(500);
  const [maxBudget, setMaxBudget] = useState(1000);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showMenuModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showMenuModal]);

  if (!showMenuModal) return null;

  const handleAddToCart = (item) => {
    if (user && user.email) {
      const bookingItem = {
        email: user.email,
        bookingItemId: item._id, // use item instead of bookingCart
        name: item.name,
        price: item.price,
        quantity: 1, // set quantity as needed
        image: item.image,
      };

      axios
        .post("http://localhost:6001/booking-cart", bookingItem)
        .then((response) => {
          console.log(response);
          if (response) {
            refetch(); // refetch cart
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Food added to the cart.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          console.log(error.response.data.message);
          Swal.fire({
            position: "center",
            icon: "warning",
            title: `${error.response.data.message}`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      Swal.fire({
        title: "Please login to order the food",
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

  const cartSubtotal = bookingCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // Calculate total with discount
  const orderTotal = cartSubtotal;

  const toggleCartPopover = () => {
    setCartPopoverVisible((prev) => !prev);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-[90%] h-[90%] m-4 overflow-hidden z-50 mt-9">
        <h3 className="text-2xl leading-6 font-medium text-gray-900 text-center">
          Menu Order
        </h3>
        <div className="flex justify-between px-6 py-4 border-b border-gray-200">
          {/* Compact Price Range Slider */}
          <div className="p-4 w-96">
            <div className="mb-1 ">
              <label
                htmlFor="price-range"
                className="block text-sm text-gray-700 font-medium "
              >
                Budget Range
              </label>
              <input
                type="range"
                id="price-range"
                className="w-full accent-indigo-600"
                min="0"
                max={maxBudget}
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span id="minPrice">₱{priceRange}</span>
              <span id="maxPrice">₱{maxBudget}</span>
            </div>
            <div className="mt-1">
              <label
                htmlFor="max-budget"
                className="block text-sm text-gray-700 font-medium"
              >
                Estimated Budget
              </label>
              <input
                type="number"
                id="max-budget"
                className="w-full p-1 border rounded-md text-sm text-gray-700"
                min="0"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="px-6 py-4 max-w-md">
            <h4 className="text-lg font-semibold text-gray-900">
              Selected Menu Type
            </h4>
            <p className="text-gray-700 text-base mb-4">
              {selectedMenuType || "No menu type selected"}
            </p>

            {selectedMenuType === "Buffet Type" && (
              <div>
                <h5 className="font-bold">
                  BUFFET TYPE SERVICES: P380 / person
                </h5>
                <ul className="list-disc ml-6">
                  <li>One (1) Appetizer / Salad</li>
                  <li>Five (5) Entrée’s</li>
                  <li>One (1) Dessert</li>
                  <li>One (1) Choice of Rice</li>
                  <li>One (1) Bottled Soft drink / person</li>
                  <li>Purified Water</li>
                </ul>
              </div>
            )}

            {selectedMenuType === "Packed Meals" && (
              <div>
                <h5 className="font-bold">PACKED MEAL</h5>
                <p>
                  Packed in a styrofoam, spoon, fork, and toothpick included.
                </p>
                <ul className="list-disc ml-6">
                  <li>
                    Packed Menu Php 280.00: 3 Main Dishes, 1 Dessert, Rice,
                    Juice in tetra pack
                  </li>
                  <li>
                    Packed Menu Php 260.00: 2 Main Dishes, 1 Dessert, Rice,
                    Juice in tetra pack
                  </li>
                  <li>
                    Packed Menu Php 250.00: 2 Main Dishes, Rice, Juice in tetra
                    pack
                  </li>
                </ul>
              </div>
            )}

            {selectedMenuType === "Cocktail Type" && (
              <div>
                <h5 className="font-bold">COCKTAIL TYPE SERVICE</h5>
                <p>
                  Business meetings, company launching, event opening, VIP
                  gatherings, and other functions may avail of our
                  well-personalized customer cocktail party service.
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className="prose p-6 overflow-y-auto"
          style={{ maxHeight: "50vh" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full w-full">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative m-4 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
              >
                <a
                  className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl justify-center"
                  href="#"
                >
                  <img
                    className="object-cover"
                    src={item.image}
                    alt="product image"
                  />
                </a>
                <div className="mt-4 px-5 pb-5">
                  <a href="#">
                    <h5 className="text-xl tracking-tight text-slate-900">
                      {item.name}
                    </h5>
                  </a>
                  <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                      <span className="text-3xl font-bold text-slate-900">
                        ₱{item.price}
                      </span>
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          aria-hidden="true"
                          className="h-5 w-5 text-yellow-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                      <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
                        5.0
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between fixed bottom-0 left-0 w-full lg:w-full mx-auto border-t border-gray-200">
          <label
            tabIndex={0}
            onClick={toggleCartPopover}
            className="btn btn-ghost btn-circle  lg:flex items-center justify-center mr-3"
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
                {bookingCart.length || 0}
              </span>
            </div>
          </label>

          <dl className="flex items-center justify-between gap-4 pt-2">
            <dt className="text-xl font-bold text-gray-900 dark:text-white">
              Total ({bookingCart.length} item)
            </dt>
            <dd className="text-2xl font-bold text-gray-900 dark:text-white">
              ₱{orderTotal.toFixed(2)}
            </dd>
          </dl>

          {/* CartPopover */}
          <CartPopover isVisible={isCartPopoverVisible} />

          {/*Confirm Button */}
          <button
            onClick={handleMenuToggleModal}
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

export default MenuModal;
