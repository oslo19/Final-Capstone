import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import BookingViewModal from "../component/BookingViewModal"; // Import the modal

const CancelledBookings = () => {
  const token = localStorage.getItem("access-token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders with pagination
  const { data: allOrders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["allOrders", currentPage],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders/all?page=${currentPage}&limit=10`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTotalPages(data.totalPages);
      return Array.isArray(data.orders) ? data.orders : [];
    },
    keepPreviousData: true,
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
        body: JSON.stringify({ status: "confirmed" }),
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

  const handleViewOrder = (orderId) => {
    const selectedOrder = allOrders.find(order => order._id === orderId);
    setSelectedOrder(selectedOrder);  // Store the selected order
    setIsModalOpen(true);  // Open the modal
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  const filteredOrders = useMemo(() => {
    const filteredByStatusAndSource = allOrders.filter(
      (order) => order.source === "booking" && order.status === "cancelled"
    );
    if (searchQuery) {
      return filteredByStatusAndSource.filter((order) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          order.firstName.toLowerCase().includes(lowerCaseQuery) ||
          order.lastName.toLowerCase().includes(lowerCaseQuery) ||
          order.email.toLowerCase().includes(lowerCaseQuery) ||
          order.transactionId.toLowerCase().includes(lowerCaseQuery)
        );
      });
    }
    return filteredByStatusAndSource;
  }, [searchQuery, allOrders]);

  if (isLoading) return <p>Loading all orders...</p>;
  if (isError) return <p>Error fetching orders. Try again later.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <div className="w-full max-w-6xl bg-white shadow-md border border-gray-300 rounded-md">
        <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-700">Cancelled Bookings</h2>
          <input
            type="text"
            placeholder="Search orders..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
        </div>

        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <p className="text-center py-10 text-gray-600">No cancelled orders available.</p>
          ) : (
            <table className="min-w-full table-fixed border-collapse">
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
                {filteredOrders.map((order, index) => (
                  <tr key={order._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-2 border">{order.transactionId || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.lastName || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.firstName || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.mobileNumber || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.email || "N/A"}</td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 text-xs rounded"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 text-xs rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmOrderMutation.mutate(order._id)}
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

        <div className="flex justify-between items-center p-4 bg-gray-100 border-t border-gray-300 text-sm text-gray-500">
          <span>Total Orders: {filteredOrders.length}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded-md"
            >
              Previous
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <BookingViewModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CancelledBookings;
