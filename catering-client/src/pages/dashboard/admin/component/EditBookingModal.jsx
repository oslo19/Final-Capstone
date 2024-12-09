import React, { useState, useEffect } from "react";

const EditBookingModal = ({ order, onClose, onUpdate }) => {
  if (!order) return null;
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const [rentalItems, setRentalItems] = useState([]); // Store all rental items from the API
  const [selectedRentalItem, setSelectedRentalItem] = useState(null); 
  const [menu, setMenu] = useState([]); 
  const [editedOrder, setEditedOrder] = useState({
    ...order,
    items: order.items || { menuItems: [], rentalItems: [] }, // Updated key for rentalItems
  });

  const [selectedMenuItem, setSelectedMenuItem] = useState(null); // Track the selected menu item

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

  // Fetch menu items from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/menu`);
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    let hours = date.getHours();  // Get hours (0-23)
    let minutes = date.getMinutes(); // Get minutes (0-59)

    // Pad single digits with a leading zero
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutes}`;  // Format as HH:MM
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

  const handleDeleteItem = (itemType, idx) => {
    const updatedItems = [...editedOrder.items[itemType]];
    updatedItems.splice(idx, 1);
    setEditedOrder((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [itemType]: updatedItems,
      },
    }));
  };

  // Handle adding a new menu item by selecting from the dropdown
  const handleAddItem = () => {
    if (selectedMenuItem) {
      // Check if the item is already in the menuItems list
      const existingItemIndex = editedOrder.items.menuItems.findIndex(
        (item) => item._id === selectedMenuItem._id
      );
  
      let updatedItems = [...editedOrder.items.menuItems]; // Make a copy of the items array
  
      // If the item is not in the list, add it with a quantity of 1
      if (existingItemIndex === -1) {
        const newItem = {
          ...selectedMenuItem,  // Copy selected menu item details
          quantity: 1, // Set quantity to 1 for new item
        };
        updatedItems.push(newItem); // Add the new item to the list
  
        // Add the price of the new item to the current remaining balance
        const updatedRemainingBalance = editedOrder.remainingBalance + selectedMenuItem.price;
  
        // Update the state with the new list of items and updated remaining balance
        setEditedOrder((prev) => ({
          ...prev,
          items: {
            ...prev.items,
            menuItems: updatedItems, // Update the menuItems list
          },
          remainingBalance: updatedRemainingBalance, // Update remaining balance
        }));
      }
  
      // Clear the selected item after adding
      setSelectedMenuItem(null);
    }
  };
  
  
  

  const handleAddRentalItem = () => {
    if (selectedRentalItem) {
      const updatedRentalItems = [...editedOrder.items.rentalItems];
      updatedRentalItems.push({
        ...selectedRentalItem,
        quantity: 1,
      });
  
      // Add the price of the new rental item to the current remaining balance
      const updatedRemainingBalance = editedOrder.remainingBalance + selectedRentalItem.price;
  
      setEditedOrder((prev) => ({
        ...prev,
        items: {
          ...prev.items,
          rentalItems: updatedRentalItems,
        },
        remainingBalance: updatedRemainingBalance, // Update remaining balance
      }));
  
      setSelectedRentalItem(null); // Clear the rental item selection
    }
  };
  

  const calculateTotalPrice = (menuItems, rentalItems) => {
    const menuTotal = menuItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const rentalTotal = rentalItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return menuTotal + rentalTotal; // Sum of both menu and rental items
  };
  
  // Filter out items that are already in the menuItems list
  const availableMenuItems = menu.filter(
    (item) =>
      !editedOrder.items.menuItems.some((addedItem) => addedItem._id === item._id)
  );

  const availableRentalItems = rentalItems.filter(
    (item) =>
      !editedOrder.items.rentalItems.some((addedItem) => addedItem._id === item._id)
  );

  // Handle quantity change (allow direct input for quantity)
  const handleQuantityChange = (e, idx) => {
    const { value } = e.target;
    if (value >= 1) {
      const updatedItems = [...editedOrder.items.menuItems];
      const previousQuantity = updatedItems[idx].quantity;
      const newQuantity = parseInt(value, 10);
  
      // Update the quantity of the item
      updatedItems[idx].quantity = newQuantity;
  
      // Calculate the price difference for the item
      const priceDifference = (newQuantity - previousQuantity) * updatedItems[idx].price;
  
      // Update the remaining balance
      const updatedRemainingBalance = editedOrder.remainingBalance + priceDifference;
  
      // Update the state with the new quantity and remaining balance
      setEditedOrder((prev) => ({
        ...prev,
        items: {
          ...prev.items,
          menuItems: updatedItems,
        },
        remainingBalance: updatedRemainingBalance, // Update remaining balance
      }));
    }
  };
  

  const handleRentalQuantityChange = (e, idx) => {
    const { value } = e.target;
    if (value >= 1) {
      const updatedItems = [...editedOrder.items.rentalItems];
      const previousQuantity = updatedItems[idx].quantity;
      const newQuantity = parseInt(value, 10);
  
      // Update the quantity of the rental item
      updatedItems[idx].quantity = newQuantity;
  
      // Calculate the price difference for the rental item
      const priceDifference = (newQuantity - previousQuantity) * updatedItems[idx].price;
  
      // Update the remaining balance
      const updatedRemainingBalance = editedOrder.remainingBalance + priceDifference;
  
      // Update the state with the new quantity and remaining balance
      setEditedOrder((prev) => ({
        ...prev,
        items: {
          ...prev.items,
          rentalItems: updatedItems,
        },
        remainingBalance: updatedRemainingBalance, // Update remaining balance
      }));
    }
  };
  
  const handleSave = () => {
    if (typeof onUpdate === 'function') {
      onUpdate(editedOrder); // Save the changes
    } else {
      console.error("onUpdate is not a function");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-7xl max-h-[80vh] overflow-y-auto">
        <div id="printableArea" className="bg-white border border-gray-300 rounded-lg p-6 shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Edit Reservation</h1>
            <p className="text-sm text-gray-600">Update your booking details below</p>
          </div>
          <div className="border-t border-b border-gray-200 py-4">
            <h2 className="text-lg font-bold text-prime">La Estellita Catering Services</h2>
            <p className="text-sm">Minglanilla Cebu</p>
            <p className="text-sm">Tel. No.: 09056306212</p>
            <p className="text-sm">Email: estellitacateringservices@gmail.com</p>
            <p className="text-sm">Facebook: facebook.com/estellitacateringservices</p>
          </div>

          <div className="my-6">
            <div className="mb-6 border-b border-gray-300 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {/* Editable fields */}
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

                {/* Event Date, Time, and Occasion */}
                <div>
                  <div className="mb-2">
                    <label className="block">Event Date:</label>
                    <input
                      type="date"
                      name="createdAt"
                      value={formatDate(editedOrder.createdAt)}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block">Time:</label>
                    <input
                      type="time"
                      name="createdAt"
                      value={formatTime(editedOrder.createdAt)}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block">Occasion:</label>
                    <input
                      type="text"
                      name="typeOfEvent"
                      value={editedOrder.typeOfEvent}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block">Type of Menu:</label>
                    <input
                      type="text"
                      name="typeOfMenu"
                      value={editedOrder.typeOfMenu}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p><strong>No. of Pax:</strong>
                  <input
                    type="number"
                    name="numberOfPax"
                    value={editedOrder.numberOfPax}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </p>
                <p><strong>Customer Payment:</strong> ₱{editedOrder.price.toLocaleString()}</p>
                <p><strong>Remaining Balance:</strong> ₱{editedOrder.remainingBalance.toLocaleString()}</p>
                <p><strong>Mode of Payment:</strong> {editedOrder.modeOfPayment}</p>
              </div>
            </div>

            {/* Add items section */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Add Menu Item</h3>
              <div className="flex space-x-4">
                <select
                  value={selectedMenuItem ? selectedMenuItem._id : ""}
                  onChange={(e) => {
                    const selectedItem = menu.find((item) => item._id === e.target.value);
                    setSelectedMenuItem(selectedItem);
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a menu item</option>
                  {availableMenuItems.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} - ₱{item.price}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddItem}
                  className="p-2 bg-blue-500 text-white rounded"
                  disabled={!selectedMenuItem}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Display added menu items */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Added Menu Items</h3>
              <ul>
                {editedOrder.items.menuItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center mb-2">
                    <span>
                      {item.name} - ₱{item.price} (x
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(e, idx)}
                        className="w-16 text-center border rounded"
                        min="1"
                      />)
                    </span>
                    <button
                      onClick={() => handleDeleteItem("menuItems", idx)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Add rental item section */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Add Rental Item</h3>
              <div className="flex space-x-4">
                <select
                  value={selectedRentalItem ? selectedRentalItem._id : ""}
                  onChange={(e) => {
                    const selectedItem = rentalItems.find((item) => item._id === e.target.value);
                    setSelectedRentalItem(selectedItem);
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a rental item</option>
                  {availableRentalItems.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} - ₱{item.price}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddRentalItem}
                  className="p-2 bg-blue-500 text-white rounded"
                  disabled={!selectedRentalItem}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Display added rental items */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Added Rental Items</h3>
              <ul>
                {editedOrder.items.rentalItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center mb-2">
                    <span>
                      {item.name} - ₱{item.price} (x
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleRentalQuantityChange(e, idx)}
                        className="w-16 text-center border rounded"
                        min="1"
                      />)
                    </span>
                    <button
                      onClick={() => handleDeleteItem("rentalItems", idx)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-gray-700 rounded"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="py-2 px-4 bg-green-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
