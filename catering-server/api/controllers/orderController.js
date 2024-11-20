const Order = require("../models/Order");

// Create a new order
const createOrder = async (req, res) => {
  const orderData = req.body;

  try {
    const newOrder = new Order(orderData);
    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// Get orders by email
const getOrdersByEmail = async (req, res) => {
  const { email, status } = req.query;

  try {
    const query = {};
    if (email) query.email = email;
    if (status) query.status = status; // Match the exact status in the database

    console.log("Query:", query); // Debug query
    const orders = await Order.find(query).sort({ createdAt: -1 });
    console.log("Fetched Orders:", orders); // Debug fetched orders
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error); // Log errors
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};




const confirmOrder = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("Order ID to Confirm:", id); // Debug order ID
    const order = await Order.findByIdAndUpdate(
      id,
      { status: "confirmed" },
      { new: true } // Return the updated document
    );

    if (!order) {
      console.error("Order not found");
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Order Confirmed:", order); // Debug confirmed order
    res.status(200).json({ message: "Order confirmed successfully", order });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ message: "Failed to confirm order", error });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};



module.exports = { createOrder, getOrdersByEmail, confirmOrder, getAllOrders };
