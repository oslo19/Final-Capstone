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

  const handleUpdateQuantity = async (item, quantity) => {
    if (quantity <= 0) {
      handleDelete(item);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:6001/booking-rental-cart/${item._id}`,
        {
          quantity,
        }
      );

      if (response.status === 200) {
        await refetch();
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This item will be removed from the cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:6001/booking-rental-cart/${item._id}`)
          .then((response) => {
            if (response.status === 200) {
              refetch();
              Swal.fire("Deleted!", "Item has been removed.", "success");
            }
          })
          .catch((error) => {
            console.error("Error deleting item:", error);
          });
      }
    });
  };

  const handleClearAll = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove all items from the cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear all!",
    }).then((result) => {
      if (result.isConfirmed) {
        Promise.all(
          bookingRentalCart.map((item) =>
            axios.delete(`http://localhost:6001/booking-rental-cart/${item._id}`)
          )
        )
          .then(() => {
            refetch();
            Swal.fire("Cleared!", "All items have been removed.", "success");
          })
          .catch((error) => {
            console.error("Error clearing cart:", error);
          });
      }
    });
  };

  return (
    <div className="absolute bottom-[75px] left-[0px] z-10 w-80 p-2 bg-white border rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Your Cart</h3>
        <button
          onClick={handleClearAll}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Clear Items
        </button>
      </div>
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
                <div className="flex items-center mt-1">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateQuantity(item, parseInt(e.target.value, 10))
                    }
                    className="w-12 text-center text-gray-900 border border-gray-300 rounded-md focus:outline-none"
                  />
                  <p className="ml-2 text-sm">₱{item.price} each</p>
                </div>
              </div>
              <div className="flex items-center ml-2">
                <p className="text-xs font-bold text-gray-900 ml-2">
                  ₱{calculateTotalPrice(item).toFixed(2)}
                </p>
                <button
                  onClick={() => handleDelete(item)}
                  className="ml-3 text-red-500 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-600 mt-4">No items in the cart</div>
      )}
    </div>
  );
};

export default RentalCartPopover;
