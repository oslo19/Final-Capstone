import React, { useContext, useEffect, useState } from "react";
import useCart from "../../hooks/useCart";
import { AuthContext } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

import useUsers from "../../hooks/useUser";

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { users } = useUsers();
  const [cart, refetch] = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);

  const currentUser = users.find((u) => u.email === user.email);

  // Calculate the total price for each item in the cart
  const calculateTotalPrice = (item) => {
    return item.price * item.quantity; // item.price should already be days * price per day
  };
  // Handle quantity increase
  const handleIncrease = async (item) => {
    const newQuantity = item.quantity + 1;

    try {
      const response = await fetch(`http://localhost:6001/carts/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setCartItems((prevCartItems) =>
          prevCartItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: updatedItem.quantity }
              : cartItem
          )
        );
        refetch(); // Sync with the latest data from the server
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Handle quantity decrease
  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;

      try {
        const response = await fetch(
          `http://localhost:6001/carts/${item._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: newQuantity }),
          }
        );

        if (response.ok) {
          const updatedItem = await response.json();
          setCartItems((prevCartItems) =>
            prevCartItems.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: updatedItem.quantity }
                : cartItem
            )
          );
          refetch(); // Sync with the latest data from the server
        } else {
          console.error("Failed to update quantity");
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } else {
      handleDelete(item);
    }
  };
  // Calculate the cart subtotal
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // Calculate total with discount
  const orderTotal = cartSubtotal - discount;

  // delete an item
  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:6001/carts/${item._id}`)
          .then((response) => {
            if (response) {
              refetch();
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  const handleProceedToCheckout = () => {
    navigate("/process-checkout", { state: { orderTotal } });
  };

  const handleQuantityChange = async (item, newQuantity) => {
    // If the input is empty, reset the quantity to 1
    if (newQuantity === "") {
      setCartItems((prevCartItems) =>
        prevCartItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: 1 } : cartItem
        )
      );

      // Update the server with quantity = 1
      try {
        const response = await fetch(
          `http://localhost:6001/carts/${item._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: 1 }),
          }
        );

        if (response.ok) {
          await refetch(); // Sync with server data
        } else {
          console.error("Failed to reset quantity");
        }
      } catch (error) {
        console.error("Error resetting quantity:", error);
      }
      return;
    }

    // Parse the new quantity
    const parsedQuantity = parseInt(newQuantity, 10);

    // If the new quantity is invalid or less than 1, do nothing
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return;
    }

    // Update the local state with the new quantity
    setCartItems((prevCartItems) =>
      prevCartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: parsedQuantity }
          : cartItem
      )
    );

    // Send the updated quantity to the backend
    try {
      const response = await fetch(`http://localhost:6001/carts/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: parsedQuantity }),
      });

      if (response.ok) {
        await refetch(); // Sync with server data
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      {/* banner */}
      <div className="">
        <div className="py-28 flex flex-col items-center justify-center">
          {/* content */}
          <div className=" text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug text-white">
              Items Added to The<span className="text-prime"> Cart</span>
            </h2>
          </div>
        </div>
      </div>

      {/* cart table */}

      <div className="container mx-auto max-w-screen-2xl">
        {cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row lg:space-x-6">
            {/* Cart Items */}
            <div className="w-full lg:w-3/4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6 mb-6"
                >
                  <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                    {/* Image */}
                    <a href="#" className="shrink-0 md:order-1">
                      <img
                        className="h-20 w-20"
                        src={item.image}
                        alt={item.name}
                      />
                    </a>

                    {/* Quantity Buttons */}
                    <div className="flex items-center justify-between md:order-3 md:justify-end">
                      <div className="flex items-center">
                        {/* Decrease Quantity */}
                        <button
                          type="button"
                          className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200"
                          onClick={() => handleDecrease(item)}
                        >
                          <svg
                            className="h-2.5 w-2.5 text-gray-900"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 2"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 1h16"
                            />
                          </svg>
                        </button>

                        {/* Quantity Input */}
                        <input
                          type="number"
                          min="1"
                          className="w-14 border-0 bg-transparent text-center text-sm font-medium text-gray-900"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item, e.target.value)
                          }
                        />

                        {/* Increase Quantity */}
                        <button
                          type="button"
                          className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200"
                          onClick={() => handleIncrease(item)}
                        >
                          <svg
                            className="h-2.5 w-2.5 text-gray-900"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 18"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 1v16M1 9h16"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          ₱{calculateTotalPrice(item).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                      <a
                        href="#"
                        className="text-base font-bold text-gray-900 hover:underline dark:text-white"
                      >
                        {item.name}
                      </a>
                      {/* Display rental days if it's a rental item */}
                      {item.isRental && item.days && (
                        <span className="text-lg text-gray-600">
                          {" "}
                          rent for {item.days} day(s)
                        </span>
                      )}

                      <div className="flex items-center gap-4">
                        {/* Add to Favorites (Optional) */}
                        <button
                          type="button"
                          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline"
                        >
                          <svg
                            className="mr-1.5 h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                            />
                          </svg>
                          Add to Favorites
                        </button>

                        {/* Remove from Cart */}
                        <button
                          type="button"
                          className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
                          onClick={() => handleDelete(item)}
                        >
                          <svg
                            className="mr-1.5 h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L17.94 6M18 18L6.06 6"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-1/4">
              <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="space-y-4">
                  <dl className="flex items-center justify-between gap-4  border-gray-200 pt-2 border-t-2">
                    <dt className="text-xl font-bold text-gray-900 dark:text-white">
                      Total ({cart.length} item)
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₱{orderTotal.toFixed(2)}
                    </dd>
                  </dl>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  href="#"
                  className="flex w-full items-center justify-center rounded-lg bg-prime px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-700 my-3"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-2xl text-gray-300">
            No items in the cart
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
