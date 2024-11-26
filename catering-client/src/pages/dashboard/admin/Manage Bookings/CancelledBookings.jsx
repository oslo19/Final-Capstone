import React from "react";
import { useQuery } from "@tanstack/react-query";

const CancelledBookings = () => {
  const token = localStorage.getItem("access-token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch completed orders
  const { data: completedOrders = [], isLoading, isError } = useQuery({
    queryKey: ["completedOrders"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders?source=booking&status=cancelled`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  const handleViewOrder = (orderId) => {
    console.log(`View order with ID: ${orderId}`);
  };

  const handleEditOrder = (orderId) => {
    console.log(`Edit order with ID: ${orderId}`);
  };

  if (isLoading) return <p className="text-center mt-10">Loading cancelled bookings...</p>;
  if (isError)
    return <p className="text-center text-red-500 mt-10">Error fetching cancelled bookings. Please try again later.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl bg-white shadow-md border border-gray-300 rounded-md">
        {/* Header */}
        <div className="p-4 bg-gray-100 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-700 text-center">Cancelled Bookings</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {completedOrders.length === 0 ? (
            <p className="text-center py-10 text-gray-600">No cancelled bookings.</p>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-sm">
                  <th className="px-4 py-2 border">RCode</th>
                  <th className="px-4 py-2 border">Last Name</th>
                  <th className="px-4 py-2 border">First Name</th>
                  <th className="px-4 py-2 border">Contact</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Order Date</th>
                  <th className="px-4 py-2 border">Total Price</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2 border">{order.transactionId || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.lastName || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.firstName || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.mobileNumber || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.email || "N/A"}</td>
                    <td className="px-4 py-2 border">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border">₱{order.price || "N/A"}</td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 text-xs rounded"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditOrder(order._id)}
                          className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 text-xs rounded"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 border-t border-gray-300 text-sm text-gray-500 text-center">
          Total Cancelled Bookings: {completedOrders.length}
        </div>
      </div>
    </div>
  );
};

export default CancelledBookings;
