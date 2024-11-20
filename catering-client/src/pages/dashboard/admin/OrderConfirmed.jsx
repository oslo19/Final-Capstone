import React from "react";
import { useQuery } from "@tanstack/react-query";

const OrderConfirmed = () => {
  const token = localStorage.getItem("access-token");

  // Fetch confirmed orders
  const { data: confirmedOrders = [], isLoading, isError } = useQuery({
    queryKey: ["confirmedOrders"],
    queryFn: async () => {
      try {
        const res = await fetch(`http://localhost:6001/orders?status=confirmed`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        console.log("Response Status:", res.status); // Debugging response status
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Fetch Error:", errorText); // Debugging fetch errors
          throw new Error(errorText);
        }

        const data = await res.json();
        console.log("Fetched Confirmed Orders:", data); // Debugging fetched data
        return data;
      } catch (error) {
        console.error("Error Fetching Confirmed Orders:", error.message);
        throw error;
      }
    },
  });

  if (isLoading) {
    return <p>Loading confirmed orders...</p>;
  }

  if (isError) {
    return <p>Error fetching confirmed orders. Please try again later.</p>;
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-6">Confirmed Orders</h1>
        <div className="bg-white">
          {confirmedOrders.length === 0 ? (
            <p className="text-center py-10 text-gray-600">No confirmed orders available.</p>
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
                  {confirmedOrders.map((order, index) => (
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

export default OrderConfirmed;
