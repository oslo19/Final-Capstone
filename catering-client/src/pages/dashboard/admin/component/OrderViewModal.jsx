import React from 'react';

const OrderViewModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust format as needed
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(); // Adjust format as needed
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-green-500">Confirmed</span>;
      case 'order pending':
        return <span className="text-yellow-500">Pending</span>;
      case 'completed':
        return <span className="text-blue-500">Completed</span>;
      default:
        return <span className="text-gray-500">Unknown</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-7xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Order Summary</h1>
        </div>

        <div className="border-t border-b border-gray-200 py-4">
          <h2 className="text-lg font-bold text-prime">
            La Estellita Catering Services
          </h2>
          <p className="text-sm">Minglanilla Cebu</p>
          <p className="text-sm">Tel. No.: 09056306212</p>
          <p className="text-sm">Email: estellitacateringservices@gmail.com</p>
          <p className="text-sm">Facebook: facebook.com/estellitacateringservices</p>
        </div>

        <div className="my-6">
          {/* Order Details */}
          <div className="mb-6 border-b border-gray-300 pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>RCode:</strong> {order.transactionId}</p>
                <p><strong>Full Name:</strong> {order.firstName} {order.lastName}</p>
                <p><strong>Contact #:</strong> {order.mobileNumber}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Status:</strong> {getStatusBadge(order.status)}</p>
              </div>
              <div>
                <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
                <p><strong>Time:</strong> {formatTime(order.createdAt)}</p>
              </div>
            </div>

            <div className="mt-4">
              <p><strong>Payable:</strong> ₱{order.price.toLocaleString()}</p>
              <p><strong>Mode of Payment:</strong> {order.modeOfPayment}</p>
            </div>

            {/* Display Cart Items (only cartItems) */}
            {order.cartItems?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Cart Items</h3>
                <ul className="list-disc list-inside">
                  {order.cartItems.map((item, idx) => (
                    <li key={idx}>
                      {item.quantity} x {item.name} - ₱{(item.quantity * item.price).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-white py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderViewModal;
