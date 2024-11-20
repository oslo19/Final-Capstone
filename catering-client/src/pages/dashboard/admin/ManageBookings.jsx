import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ManageBookings = () => {
  const token = localStorage.getItem("access-token");

  const { data: orders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:6001/orders/all`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      return res.json();
    },
  });

  const confirmOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const res = await fetch(`http://localhost:6001/orders/confirm/${orderId}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Order confirmed successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to confirm the order: ${error.message}`);
    },
  });

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  if (isError) {
    return <p>Error fetching orders. Please try again later.</p>;
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-6">Manage Orders</h1>
        <div className="bg-white">
          {orders.length === 0 ? (
            <p className="text-center py-10 text-gray-600">No orders available.</p>
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
                  {orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order._id}</td>
                      <td>{order.email}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₱{order.price}</td>
                      <td>{order.status}</td>
                      <td>
                        {order.status === "order pending" ? (
                          <button
                            onClick={() => confirmOrderMutation.mutate(order._id)}
                            className="btn bg-green-600 text-white px-4 py-2 rounded"
                          >
                            Confirm Order
                          </button>
                        ) : (
                          <span className="text-green-600 font-semibold">Confirmed</span>
                        )}
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

export default ManageBookings;
