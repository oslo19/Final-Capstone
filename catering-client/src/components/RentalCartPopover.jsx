import React, { useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import useBookingRentalCart from "../hooks/useBookingRentalCart";

const RentalCartPopover = ({ isVisible }) => {
  const [bookingRentalCart, refetch] = useBookingRentalCart();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!isVisible) return null;

  const calculateTotalPrice = (item) => item.price * item.quantity;

  const handleIncrease = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:6001/booking-rental-cart/${item._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: item.quantity + 1 }),
        }
      );

      if (response.ok) {
        await refetch();
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      try {
        const response = await fetch(
          `http://localhost:6001/booking-rental-cart/${item._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity: item.quantity - 1 }),
          }
        );

        if (response.ok) {
          await refetch();
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

  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "swal-custom-zindex",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:6001/booking-rental-cart/${item._id}`)
          .then((response) => {
            if (response) {
              refetch();
              Swal.fire("Deleted!", "Your item has been deleted.", "success");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  return (
    <div className="absolute bottom-[75px] left-[0px] z-10 w-80 p-2 bg-white border rounded-lg shadow-lg">
      {bookingRentalCart.length > 0 ? (
        <div className="flex flex-col space-y-2">
          {bookingRentalCart.map((item) => (
            <div
              key={item._id}
              className="flex items-center p-2 bg-white border rounded shadow-sm"
            >
              <a href="#" className="shrink-0">
                <img className="h-10 w-10" src={item.image} alt={item.name} />
              </a>
              <div className="flex flex-col flex-1 ml-2 text-xs">
                <a
                  href="#"
                  className="font-semibold text-gray-800 hover:underline"
                >
                  {item.name}
                </a>
                {item.isRental && item.rentalDays && (
                  <span className="text-gray-600">
                    rent for {item.rentalDays} day(s)
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center space-x-1">
                <button
                  type="button"
                  className="flex items-center justify-center h-6 w-6 text-gray-900 bg-gray-100 border rounded hover:bg-gray-200"
                  onClick={() => handleDecrease(item)}
                >
                  <svg
                    className="h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                  >
                    <path stroke="currentColor" strokeWidth="2" d="M1 1h16" />
                  </svg>
                </button>

                <input
                  type="text"
                  className="w-10 bg-transparent text-center text-xs text-gray-900 border-none focus:outline-none"
                  value={item.quantity}
                  readOnly
                />

                <button
                  type="button"
                  className="flex items-center justify-center h-6 w-6 text-gray-900 bg-gray-100 border rounded hover:bg-gray-200"
                  onClick={() => handleIncrease(item)}
                >
                  <svg
                    className="h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-xs font-bold text-gray-900 ml-2">
                ₱{calculateTotalPrice(item).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-600">No items in the cart</div>
      )}
    </div>
  );
};

export default RentalCartPopover;
