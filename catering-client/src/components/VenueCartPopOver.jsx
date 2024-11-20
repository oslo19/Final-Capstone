import React, { useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import useBookingVenueCart from "../hooks/useBookingVenueCart";

const VenueCartPopover = ({ isVisible }) => {
  const [bookingVenueCart, refetch] = useBookingVenueCart();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!isVisible) return null;

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
          .delete(`http://localhost:6001/booking-venue-cart/${item._id}`)
          .then((response) => {
            if (response) {
              refetch();
              Swal.fire("Deleted!", "Your item has been deleted.", "success");
            }
          })
          .catch((error) => {
            console.error("Error deleting item:", error);
          });
      }
    });
  };

  // Calculate total price for all venues
  const calculateTotalPrice = () =>
    bookingVenueCart.reduce((total, item) => total + item.rentalPrice, 0);

  return (
    <div className="absolute bottom-[75px] left-[0px] z-10 w-80 p-2 bg-white border rounded-lg shadow-lg">
      {bookingVenueCart.length > 0 ? (
        <div className="flex flex-col space-y-2">
          {bookingVenueCart.map((item) => (
            <div
              key={item._id}
              className="flex items-center p-2 bg-white border rounded shadow-sm"
            >
              <a href="#" className="shrink-0">
                <img
                  className="h-10 w-10 object-cover rounded"
                  src={item.images?.[0]} // Use the first image from the images array
                  alt={item.venueName}
                />
              </a>
              <div className="flex flex-col flex-1 ml-2 text-xs">
                <a
                  href="#"
                  className="font-semibold text-gray-800 hover:underline"
                >
                  {item.venueName}
                </a>
                <span className="text-gray-600">{item.address}</span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  className="flex items-center justify-center h-6 w-6 text-gray-900 bg-gray-100 border rounded hover:bg-gray-200"
                  onClick={() => handleDelete(item)}
                >
                  <svg
                    className="h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
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
              <p className="text-xs font-bold text-gray-900 ml-2">
                ₱{item.rentalPrice.toFixed(2)}
              </p>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm font-semibold text-gray-800">Total:</p>
            <p className="text-sm font-bold text-gray-900">
              ₱{calculateTotalPrice().toFixed(2)}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-600">No items in the cart</div>
      )}
    </div>
  );
};

export default VenueCartPopover;
