import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import debounce from "lodash.debounce"; // Import debounce function
import OrderViewModal from "../component/OrderViewModal"; // Import OrderViewModal
import OrderPaymentStatusModal from "../component/OrderPaymentStatusModal"; // Import OrderPaymentStatusModal
import { GrView } from "react-icons/gr"; 
import { FaMoneyBill } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import EditOrderModal from "../component/EditOrderModal";
const ConfirmOrders = () => {
  const token = localStorage.getItem("access-token");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // New state for Payment Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders with pagination
  const { data: allOrders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["allOrders", currentPage],  // Include currentPage as part of the query key
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/orders/all?page=${currentPage}&limit=10`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTotalPages(data.totalPages); // Set the total number of pages
      return Array.isArray(data.orders) ? data.orders : [];
    },
    keepPreviousData: true, // Keeps previous data while loading new page
  });

 

  // Handle View Order (Open Modal)
  const handleViewOrder = (order) => {
    setSelectedOrder(order);  // Set the selected order data for viewing
    setIsModalOpen(true);  // Open the modal
  };

  // Handle Payment Status (Open Payment Modal)
  const handlePaymentStatus = (order) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true); // Open Payment Status Modal
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true); // Open Edit Order Modal
  };


  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Debounced search input handler
  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300); // 300ms debounce delay

  // Client-side search filtering
  const filteredOrders = useMemo(() => {
    // First filter for source 'cart' and status 'order pending'
    const filteredByStatusAndSource = allOrders.filter(
      (order) => order.source === "cart" && order.status === "confirmed"
    );

    // If there is a search query, filter further based on search query
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

    // Return filtered orders by source and status if no search query
    return filteredByStatusAndSource;
  }, [searchQuery, allOrders]); // Recalculate when searchQuery or allOrders changes

  if (isLoading) return <p>Loading all orders...</p>;
  if (isError) return <p>Error fetching orders. Try again later.</p>;

  // Modal for editing order
  const handleSaveOrder = async (updatedOrder) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${updatedOrder._id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOrder),
      });
  
      if (!res.ok) throw new Error(await res.text());
  
      toast.success("Order updated successfully.");
      refetch(); // If you're using a hook to refetch data
      setIsModalOpen(false); // Close modal on success
    } catch (error) {
      toast.error(`Failed to update the order: ${error.message}`);
    }
  };
  
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <div className="w-full max-w-6xl bg-white shadow-md border border-gray-300 rounded-md">
        {/* Header with Search Bar */}
        <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-700">
            Order Confirmed
          </h2>
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search orders..."
            onChange={(e) => debouncedSearch(e.target.value)} // Use debounced function here
            className="px-4 py-2 border rounded-md"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <p className="text-center py-10 text-gray-600">No confirmed orders from cart available.</p>
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
                  <tr
                    key={order._id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2 border">{order.transactionId || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.lastName || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.firstName || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.mobileNumber || "N/A"}</td>
                    <td className="px-4 py-2 border">{order.email || "N/A"}</td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)} // Pass the order object to view modal
                          className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 text-xs rounded"
                        >
                           <GrView size={16} />
                        </button>  
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 text-xs rounded"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handlePaymentStatus(order)} // Open payment status modal
                          className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 text-xs rounded"
                        >
                         <FaMoneyBill size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer with Pagination */}
        <div className="flex justify-between items-center p-4 bg-gray-100 border-t border-gray-300 text-sm text-gray-500">
          <span>Total Orders: {filteredOrders.length}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Prev
            </button>
            <span className="text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order View Modal */}
      {isModalOpen && selectedOrder && (
        <OrderViewModal
          order={selectedOrder}  // Pass the selected order to the modal
          onClose={() => setIsModalOpen(false)}  // Close modal
          onSave={handleSaveOrder}  // Pass save handler to the modal
        />
      )}

    {/* Edit Order Modal */}
    {isEditModalOpen && (
       <EditOrderModal
       order={selectedOrder}
       onClose={() => setIsEditModalOpen(false)}
       onUpdate={handleSaveOrder}  // This is correctly passing the function to the modal
     />     
      )}

      {/* Order Payment Status Modal */}
      {isPaymentModalOpen && selectedOrder && (
        <OrderPaymentStatusModal
          order={selectedOrder}
          onClose={() => setIsPaymentModalOpen(false)}  // Close the modal
          onUpdate={handleSaveOrder}  // Save payment status
        />
      )}
    </div>
  );
};

export default ConfirmOrders;
