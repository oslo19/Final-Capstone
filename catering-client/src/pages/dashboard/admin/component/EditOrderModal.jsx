import React, { useState, useEffect } from "react";

const EditOrderModal = ({ order, onClose, onUpdate }) => {
  if (!order) return null;

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [rentalItems, setRentalItems] = useState([]);
  const [menu, setMenu] = useState([]);
  const [editedOrder, setEditedOrder] = useState({
    ...order,
    cartItems: order.cartItems || [], // Ensures cartItems is properly initialized
  });

  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedRentalItem, setSelectedRentalItem] = useState(null);

  // State for remaining balance
  const [remainingBalance, setRemainingBalance] = useState(order.remainingBalance || 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentalResponse = await fetch(`${BASE_URL}/rental`);
        const rentalData = await rentalResponse.json();
        setRentalItems(rentalData);
      } catch (error) {
        console.error("Error fetching rental items:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/menu`);
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes}`; // Format as HH:MM
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <span className="text-green-500">Confirmed</span>;
      case "order pending":
        return <span className="text-yellow-500">Pending</span>;
      case "completed":
        return <span className="text-blue-500">Completed</span>;
      default:
        return <span className="text-gray-500">Unknown</span>;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    if (selectedMenuItem) {
      const newItem = {
        ...selectedMenuItem,
        quantity: 1,
      };

      const updatedCartItems = [...editedOrder.cartItems, newItem];

      setEditedOrder((prev) => {
        const updatedOrder = {
          ...prev,
          cartItems: updatedCartItems,
        };
        updateRemainingBalance(updatedOrder); // Recalculate remaining balance
        return updatedOrder;
      });

      setSelectedMenuItem(null);
    }
  };

  const handleAddRentalItem = () => {
    if (selectedRentalItem) {
      const newRentalItem = {
        ...selectedRentalItem,
        quantity: 1,
      };

      const updatedCartItems = [...editedOrder.cartItems, newRentalItem];

      setEditedOrder((prev) => {
        const updatedOrder = {
          ...prev,
          cartItems: updatedCartItems,
        };
        updateRemainingBalance(updatedOrder); // Recalculate remaining balance
        return updatedOrder;
      });

      setSelectedRentalItem(null);
    }
  };

  const handleQuantityChange = (e, idx) => {
    const { value } = e.target;
    if (value >= 1) {
      const updatedItems = [...editedOrder.cartItems];
      updatedItems[idx].quantity = parseInt(value, 10);
      setEditedOrder((prev) => {
        const updatedOrder = {
          ...prev,
          cartItems: updatedItems,
        };
        updateRemainingBalance(updatedOrder); // Recalculate remaining balance
        return updatedOrder;
      });
    }
  };

  const handleDeleteItem = (idx) => {
    const itemToDelete = editedOrder.cartItems[idx];
    const updatedItems = [...editedOrder.cartItems];
    updatedItems.splice(idx, 1);
    
    setEditedOrder((prev) => {
      const updatedOrder = {
        ...prev,
        cartItems: updatedItems,
      };
      updateRemainingBalanceAfterDelete(updatedOrder, itemToDelete); // Recalculate remaining balance after deletion
      return updatedOrder;
    });
  };

  const handleSave = () => {
    // Update the remaining balance before saving
    const updatedOrder = {
      ...editedOrder,
      remainingBalance: remainingBalance, // Ensure remainingBalance is included
    };

    console.log("Saving order:", updatedOrder);

    if (typeof onUpdate === "function") {
      onUpdate(updatedOrder); // Pass the updated order with remainingBalance to onUpdate
    } else {
      console.error("onUpdate is not a function");
    }
    onClose();
  };

  // Calculate Total Order Price
  const calculateTotalPrice = () => {
    let total = 0;
    editedOrder.cartItems.forEach(item => {
      total += item.price * item.quantity;
    });
    return total;
  };

  // Update remaining balance based on total price and amount paid
  const updateRemainingBalance = (updatedOrder) => {
    const totalPrice = calculateTotalPrice();
    const amountPaid = updatedOrder.amountPaid || 0;
    setRemainingBalance(totalPrice - amountPaid); // Subtract amountPaid from total price
  };

  // Update remaining balance after deleting an item
 // Update remaining balance after deleting an item
const updateRemainingBalanceAfterDelete = (deletedItem) => {
  const totalPrice = calculateTotalPrice(); // Recalculate the total price
  const amountPaid = editedOrder.price || 0; // Amount the customer has already paid
  const itemTotal = deletedItem.price * deletedItem.quantity; // Total price of the deleted item
  const balance = totalPrice - itemTotal - amountPaid; // Subtract the deleted item's total price
  setRemainingBalance(balance); // Update the remaining balance after item removal
};

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-7xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Edit Order</h1>
          <p className="text-sm text-gray-600">Update the order details below</p>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[1000px] overflow-y-auto">
          <div className="border-t border-b border-gray-200 py-4">
            <h2 className="text-lg font-bold text-prime">La Estellita Catering Services</h2>
            <p className="text-sm">Minglanilla Cebu</p>
            <p className="text-sm">Tel. No.: 09056306212</p>
            <p className="text-sm">Email: estellitacateringservices@gmail.com</p>
            <p className="text-sm">Facebook: facebook.com/estellitacateringservices</p>
          </div>

          {/* Remaining Balance */}
          <div className="my-6">
            <h3 className="font-semibold">Remaining Balance: ₱{remainingBalance.toLocaleString()}</h3>
          </div>

          <div className="my-6">
            <div className="mb-6 border-b border-gray-300 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2">
                    <label className="block">RCode:</label>
                    <input
                      type="text"
                      value={editedOrder.transactionId}
                      readOnly
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block">Full Name:</label>
                    <input
                      type="text"
                      value={`${editedOrder.firstName} ${editedOrder.lastName}`}
                      readOnly
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block">Contact #:</label>
                    <input
                      type="text"
                      value={editedOrder.mobileNumber}
                      readOnly
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block">Address:</label>
                    <input
                      type="text"
                      name="address"
                      value={editedOrder.address}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block">Status:</label>
                    <div>{getStatusBadge(editedOrder.status)}</div>
                  </div>        
                </div>

                <div>
                  <div className="mb-2">
                    <label className="block">Schedule:</label>
                    <input
                      type="date"
                      name="schedule"
                      value={formatDate(editedOrder.schedule)}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block">Time:</label>
                    <input
                      type="time"
                      name="createdAt"
                      value={formatTime(editedOrder.schedule)}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Display Added Cart Items */}
            <ul className="mt-4">
              {editedOrder.cartItems.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-bold">Cart Items</h3>
                  <ul className="list-disc list-inside">
                    {editedOrder.cartItems.map((item, idx) => (
                      <li key={idx}>
                        {item.quantity} x {item.name} - ₱{(item.quantity * item.price).toLocaleString()}
                        <button
                          onClick={() => handleDeleteItem(idx)}
                          className="ml-2 text-red-500"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ul>

            {/* Add Menu Items */}
            <div className="mb-6">
              <h3 className="font-semibold">Add Menu Item</h3>
              <select
                value={selectedMenuItem ? selectedMenuItem._id : ""}
                onChange={(e) => {
                  const selectedItem = menu.find((item) => item._id === e.target.value);
                  setSelectedMenuItem(selectedItem);
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a menu item</option>
                {menu.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} - ₱{item.price}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddItem}
                className="mt-2 p-2 bg-blue-500 text-white rounded"
                disabled={!selectedMenuItem}
              >
                Add Item
              </button>
            </div>

            {/* Add Rental Items */}
            <div className="mb-6">
              <h3 className="font-semibold">Add Rental Item</h3>
              <select
                value={selectedRentalItem ? selectedRentalItem._id : ""}
                onChange={(e) => {
                  const selectedItem = rentalItems.find((item) => item._id === e.target.value);
                  setSelectedRentalItem(selectedItem);
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a rental item</option>
                {rentalItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} - ₱{item.price}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddRentalItem}
                className="mt-2 p-2 bg-blue-500 text-white rounded"
                disabled={!selectedRentalItem}
              >
                Add Rental Item
              </button>
            </div>

            {/* Total Price */}
            <div className="mb-4">
              <h3 className="font-semibold">Total Price: ₱{calculateTotalPrice().toLocaleString()}</h3>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Remaining Balance: ₱{remainingBalance.toLocaleString()}</h3>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Customer Payment: ₱{editedOrder.price}</h3>
            </div>

            {/* Mode of Payment */}
            <div className="mb-6">
              <h3 className="font-semibold">Mode of Payment: {editedOrder.modeOfPayment}</h3>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="p-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="p-2 bg-green-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
