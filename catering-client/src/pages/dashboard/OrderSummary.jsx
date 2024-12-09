import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const OrderReceipt = ({ order }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatTime = (date) => new Date(date).toLocaleTimeString();

  const getStatusBadge = (status) => {
    let badgeColor = "bg-gray-300 text-black";
    switch (status) {
      case "order_pending":
        badgeColor = "bg-yellow-300 text-yellow-800";
        break;
      case "confirmed":
        badgeColor = "bg-blue-300 text-blue-800";
        break;
      case "partially_paid":
        badgeColor = "bg-orange-300 text-orange-800";
        break;
      case "fully_paid":
        badgeColor = "bg-green-300 text-green-800";
        break;
      case "completed":
        badgeColor = "bg-gray-500 text-white";
        break;
      case "cancelled":
        badgeColor = "bg-red-300 text-red-800";
        break;
      default:
        break;
    }
    return (
      <span className={`px-3 py-1 rounded-lg ${badgeColor}`}>
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printableArea").innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Reservation Summary</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .hidden-print { display: none; }
            .printable-area { margin: 20px; }
            .printable-area h1 { font-size: 24px; }
          </style>
        </head>
        <body>
          <div class="printable-area">
            ${printContent}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div
      id="printableArea"
      className="max-w-3xl mx-auto bg-white border border-gray-300 rounded-lg p-6 shadow-md mt-24"
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Reservation Summary</h1>
        <p className="text-sm text-gray-600">
          Reminder: Please print your reservation summary and take note of your
          reservation code for future inquiries.
        </p>
      </div>
      <div className="border-t border-b border-gray-200 py-4">
        <h2 className="text-lg font-bold text-prime">
          La Estellita Catering Services
        </h2>
        <p className="text-sm">Minglanilla Cebu</p>
        <p className="text-sm">Tel. No.: 09056306212</p>
        <p className="text-sm">Email: estellitacateringservices@gmail.com</p>
        <p className="text-sm">
          Facebook: facebook.com/estellitacateringservices
        </p>
      </div>
      <div className="my-6">
        <div className="mb-6 border-b border-gray-300 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>RCode:</strong> {order.transactionId}
              </p>
              <p>
                <strong>Full Name:</strong> {order.firstName} {order.lastName}
              </p>
              <p>
                <strong>Contact #:</strong> {order.mobileNumber}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Status:</strong> {getStatusBadge(order.status)}
              </p>
            </div>
            <div>
              <p>
                <strong>Event Date:</strong> {formatDate(order.createdAt)}
              </p>
              <p>
                <strong>Time:</strong> {formatTime(order.createdAt)}
              </p>
              <p>
                <strong>Venue:</strong> {order.venue || "N/A"}
              </p>
              <p>
                <strong>Occasion:</strong> {order.typeOfEvent}
              </p>
              <p>
                <strong>Type of Menu:</strong> {order.typeOfMenu}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p>
              <strong>No. of Pax:</strong> {order.numberOfPax}
            </p>
            <p>
              <strong>Payable:</strong> ₱{order.price.toLocaleString()}
            </p>
            <p>
              <strong>Remaining Balance:</strong> ₱
              {order.remainingBalance.toLocaleString()}
            </p>
            <p>
              <strong>Mode of Payment:</strong> {order.modeOfPayment}
            </p>
          </div>
          {/* Display Menu Items */}
          {order.items.menuItems?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Menu Items</h3>
              <ul className="list-disc list-inside">
                {order.items.menuItems.map((item, idx) => (
                  <li key={idx}>
                    {item.quantity} x {item.name} - ₱
                    {(item.quantity * item.price).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Venue Items */}
          {order.items.venueItems?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Venue Items</h3>
              <ul className="list-disc list-inside">
                {order.items.venueItems.map((item, idx) => (
                  <li key={idx}>
                    {item.quantity} x {item.name} - ₱
                    {(item.quantity * item.price).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Display Rental/Amenities Items */}
          {order.items.rentalItems?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Rental / Amenities Items</h3>
              <ul className="list-disc list-inside">
                {order.items.rentalItems.map((item, idx) => (
                  <li key={idx}>
                    {item.quantity} x {item.name} - ₱
                    {(item.quantity * item.price).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 text-center">
        <button className="btn btn-primary hidden-print" onClick={handlePrint}>
          Print Receipt
        </button>
      </div>
    </div>
  );
};

const Order = () => {
  const { user } = useAuth();
  const { transactionId } = useParams(); // Get the transactionId from URL
  const [order, setOrder] = useState(null);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (transactionId) {
      const fetchOrder = async () => {
        const response = await fetch(`${BASE_URL}/orders/${transactionId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          Swal.fire("Error", "Order not found.", "error");
        }
      };
      fetchOrder();
    }
  }, [transactionId]);

  return (
    <div className="max-w-screen-lg mx-auto py-10">
      {order ? (
        <OrderReceipt order={order} />
      ) : (
        <div className="text-center mt-20">
          <p>Loading your order...</p>
        </div>
      )}
    </div>
  );
};

export default Order;
