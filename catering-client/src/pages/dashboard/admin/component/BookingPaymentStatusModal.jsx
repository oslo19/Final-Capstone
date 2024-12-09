import React, { useState, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import { toast } from "react-toastify"; // If you're using toast notifications

const BookingPaymentStatusModal = ({ order, onClose, onUpdate }) => {
  const [paymentAmount, setPaymentAmount] = useState(""); // Initial value is an empty string
  const [orderStatus, setOrderStatus] = useState(order.status || "order pending");
  const [remaining, setRemaining] = useState(order.remainingBalance);
  const [customerPayment, setCustomerPayment] = useState(order.price); // Initialize customer payment with order price
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token"); // Or any other method to get the token

  // Log the order to debug
  console.log("Order details:", order);

  // Handle payment amount change
  const handlePaymentChange = (e) => {
    const payment = parseFloat(e.target.value) || 0; // Fallback to 0 if the input is empty or invalid
    setPaymentAmount(payment);

    // Update remaining balance
    const newRemainingBalance = Math.max(0, order.remainingBalance - payment);
    setRemaining(newRemainingBalance);

    // Update customer payment (payable amount)
    const newCustomerPayment = order.price + payment; // Add the entered payment to the order price
    setCustomerPayment(newCustomerPayment); // Update the customer payment state
  };

  // Handle order status change
  const handleStatusChange = (e) => {
    setOrderStatus(e.target.value);  // Updates the local state with the new status
  };

  // Handle the form submission (update order)
  const handleSubmit = () => {
    const updatedOrder = {
      ...order,
      paymentAmount: paymentAmount || 0,  
      status: orderStatus,
      remainingBalance: remaining,
    };

    onUpdate(updatedOrder); // Send the updated order to the parent
    onClose();  // Close the modal after saving
  };

  // Initialize form values when the order prop changes
  useEffect(() => {
    setPaymentAmount(""); // Keep the payment field blank
    setOrderStatus(order.status || "order pending");
    setRemaining(order.remainingBalance); // Update remaining balance when order prop changes
    setCustomerPayment(order.price); // Initialize the customer payment with the order price
  }, [order]);

  console.log("Updated Order Status: ", orderStatus); // Debugging log

  // Update order in the backend
 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-96 shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-4">Update Order</h2>

        {/* Payment Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Payment Amount</label>
          <input
            type="number"
            value={paymentAmount}
            onChange={handlePaymentChange}
            placeholder="Enter payment amount"
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          />
        </div>

        {/* Payable and Remaining Balance Display */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">Customer Payment: ₱{customerPayment}</p> {/* Display updated customer payment */}
          <p className={`text-sm font-medium ${remaining < 0 ? 'text-red-500' : 'text-gray-700'}`}>
            Remaining Balance: ₱{remaining}
          </p>
          {remaining < 0 && (
            <p className="text-xs text-red-500 mt-1">The payment exceeds the remaining balance.</p>
          )}
        </div>

        {/* Order Status Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Order Status</label>
          <select
            value={orderStatus}
            onChange={handleStatusChange}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          >
            <option value="order pending">Order Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <FaSave size={16} className="mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPaymentStatusModal;
