import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const PendingBookings = () => {
  const token = localStorage.getItem("access-token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all pending bookings
  const { data: pendingBookings = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["pendingBookings"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders?source=booking&status=pending`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  // Mutation to confirm a booking
  const confirmBookingMutation = useMutation({
    mutationFn: async (orderId) => {
      const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast.success("Booking confirmed successfully.");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to confirm the booking: ${error.message}`);
    },
  });

  const handleViewOrder = (orderId) => {
    console.log(`View booking with ID: ${orderId}`);
  };

  const handleEditOrder = (orderId) => {
    console.log(`Edit booking with ID: ${orderId}`);
  };

  if (isLoading) return <p className="text-center mt-10">Loading pending bookings...</p>;
  if (isError)
    return <p className="text-center text-red-500 mt-10">Error fetching pending bookings. Please try again later.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl bg-white shadow-md border border-gray-300 rounded-md">
        {/* Header */}
        <div className="p-4 bg-gray-100 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-700 text-center">Pending Bookings</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {pendingBookings.length === 0 ? (
            <p className="text-center py-10 text-gray-600">No pending bookings.</p>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-sm">
                  <th className="px-4 py-2 border">RCode</th>
                  <th className="px-4 py-2 border">Last Name</th>
                  <th className="px-4 py-2 border">First Name</th>
                  <th className="px-4 py-2 border">Contact</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2 border">{booking.transactionId || "N/A"}</td>
                    <td className="px-4 py-2 border">{booking.lastName || "N/A"}</td>
                    <td className="px-4 py-2 border">{booking.firstName || "N/A"}</td>
                    <td className="px-4 py-2 border">{booking.mobileNumber || "N/A"}</td>
                    <td className="px-4 py-2 border">{booking.email || "N/A"}</td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(booking._id)}
                          className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 text-xs rounded"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditOrder(booking._id)}
                          className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 text-xs rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmBookingMutation.mutate(booking._id)}
                          className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 text-xs rounded"
                        >
                          Confirm
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
          Total Pending Bookings: {pendingBookings.length}
        </div>
      </div>
    </div>
  );
};

export default PendingBookings;
