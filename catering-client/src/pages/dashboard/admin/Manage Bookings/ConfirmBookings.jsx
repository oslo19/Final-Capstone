import React from "react";
import { useQuery } from "@tanstack/react-query";

const ConfirmBookings = () => {
  const token = localStorage.getItem("access-token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all confirmed bookings
  const { data: confirmedOrders = [], isLoading, isError } = useQuery({
    queryKey: ["confirmedOrders"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders?source=booking&status=confirmed`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading confirmed bookings...</p>;
  if (isError)
    return <p className="text-center text-red-500 mt-10">Error fetching confirmed bookings. Please try again later.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl bg-white shadow-md border border-gray-300 rounded-md">
        {/* Header */}
        <div className="p-4 bg-gray-100 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-700 text-center">Confirmed Bookings</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {confirmedOrders.length === 0 ? (
            <p className="text-center py-10 text-gray-600">No confirmed bookings.</p>
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
                  <th className="px-4 py-2 border">Address</th>
                </tr>
              </thead>
              <tbody>
                {confirmedOrders.map((order, index) => (
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
                    <td className="px-4 py-2 border">{order.address || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 border-t border-gray-300 text-sm text-gray-500 text-center">
          Total Confirmed Bookings: {confirmedOrders.length}
        </div>
      </div>
    </div>
  );
};

export default ConfirmBookings;
