import React from "react";
import { useQuery } from "@tanstack/react-query";

const CancelledOrders = () => {
  const token = localStorage.getItem("access-token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch cancelled orders
  const { data: cancelledOrders = [], isLoading, isError } = useQuery({
    queryKey: ["cancelledOrders"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders?source=cart&status=cancelled`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  if (isLoading) return <p>Loading cancelled orders...</p>;
  if (isError) return <p>Error fetching cancelled orders. Try again later.</p>;

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-6">Cancelled Bookings</h1>
        <div className="bg-white">
          {cancelledOrders.length === 0 ? (
            <p className="text-center py-10 text-gray-600">No cancelled orders.</p>
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
                  </tr>
                </thead>
                <tbody>
                  {cancelledOrders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order._id}</td>
                      <td>{order.email}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₱{order.price}</td>
                      <td>{order.status}</td>
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

export default CancelledOrders;
