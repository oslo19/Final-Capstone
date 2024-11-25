import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const ConfirmBookings = () => {
  const token = localStorage.getItem("access-token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all confirmed orders
  const { data: confirmedOrders = [], isLoading, isError } = useQuery({
    queryKey: ["confirmedOrders"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders?status=confirmed`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  if (isLoading) return <p>Loading confirmed bookings...</p>;
  if (isError) return <p>Error fetching confirmed bookings. Try again later.</p>;

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-6">Confirmed Bookings</h1>
        <div className="bg-white">
          {confirmedOrders.length === 0 ? (
            <p className="text-center py-10 text-gray-600">No confirmed bookings.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>Customer Email</th>
                    <th>Customer Name</th>
                    <th>Order Date</th>
                    <th>Total Price</th>
                    <th>Address</th>
                    <th>Mobile Number</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedOrders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order._id}</td>
                      <td>{order.email}</td>
                      <td>
                        {order.firstName} {order.lastName}
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₱{order.price}</td>
                      <td>{order.address}</td>
                      <td>{order.mobileNumber}</td>
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

export default ConfirmBookings;
