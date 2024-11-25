import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const PendingBookings = () => {
  const token = localStorage.getItem("access-token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all pending orders
  const { data: pendingOrders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["pendingOrders"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders?status=order pending`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  // Mutation to confirm an order
  const confirmOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "confirmed" }), // Send the new status
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast.success("Order confirmed successfully.");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to confirm the order: ${error.message}`);
    },
  });
  
  if (isLoading) return <p>Loading pending orders...</p>;
  if (isError) return <p>Error fetching pending orders. Try again later.</p>;

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-6">Pending Bookings</h1>
        <div className="bg-white">
          {pendingOrders.length === 0 ? (
            <p className="text-center py-10 text-gray-600">No pending orders.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>Customer Email</th>
                    <th>Order Date</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order._id}</td>
                      <td>{order.email}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₱{order.price}</td>
                      <td>{order.status}</td>
                      <td>
                        <button
                          onClick={() => confirmOrderMutation.mutate(order._id)}
                          className="btn bg-green-600 text-white px-4 py-2 rounded"
                        >
                          Confirm Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingBookings;
