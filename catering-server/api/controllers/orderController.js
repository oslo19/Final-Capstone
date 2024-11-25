const Order = require("../models/Order");

// Create a new order
const createOrder = async (req, res) => {
  const {
    email,
    transactionId,
    price,
    source,
    items,
    address,
    mobileNumber,
    paymentType,
  } = req.body;

  if (
    !email ||
    !transactionId ||
    !price ||
    !source ||
    !items ||
    !address ||
    !mobileNumber ||
    !paymentType
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const now = new Date();
    const estimatedMilestones = {
      confirmed: new Date(now.getTime() + 5 * 60 * 1000), // +5 minutes
      shipped: new Date(now.getTime() + 15 * 60 * 1000), // +15 minutes
      outForDelivery: new Date(now.getTime() + 30 * 60 * 1000), // +30 minutes
      delivered: new Date(now.getTime() + 45 * 60 * 1000), // +45 minutes
    };

    const newOrder = new Order({
      ...req.body,
      estimatedMilestones,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order.", error });
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
      const order = await Orders.findByIdAndUpdate(id, updates, { new: true });
      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};



// Get orders by email, status, or source
const getOrdersByEmailOrStatus = async (req, res) => {
  const { email, status, source } = req.query;

  if (!email && !status && !source) {
    return res.status(400).json({ message: "Email, status, or source is required to fetch orders." });
  }

  try {
    const query = {};
    if (email) query.email = email;
    if (status) query.status = status;
    if (source) query['items.source'] = source; // Ensure source filtering works.

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders.", error });
  }
};



// Get all orders (Admin view with pagination and optional source filtering)
const getAllOrders = async (req, res) => {
  const { status, source, page = 1, limit = 10 } = req.query;

  try {
    const query = {};
    if (status) query.status = status;
    if (source) query['items.source'] = source; // Add source filter

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders.", error });
  }
};


// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["order pending", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status provided." });
  }

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: `Order updated to ${status}.`, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status.", error });
  }
};

// Get confirmed schedules for a specific day
const getConfirmedSchedulesForDay = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required to fetch schedules." });
  }

  try {
    const orders = await Order.find({
      status: "confirmed",
      schedule: { $regex: `^${date}`, $options: "i" },
    });

    res.status(200).json({ count: orders.length, orders });
  } catch (error) {
    console.error("Error fetching confirmed schedules:", error);
    res.status(500).json({ message: "Failed to fetch schedules.", error });
  }
};

const getOrderByTransactionId = async (req, res) => {
  const { transactionId } = req.params;

  try {
    const order = await Order.findOne({ transactionId });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by transactionId:", error);
    res.status(500).json({ message: "Failed to fetch order.", error });
  }
};



module.exports = {
  createOrder,
  getOrdersByEmailOrStatus,
  getAllOrders,
  updateOrderStatus,
  getConfirmedSchedulesForDay,
  updateOrder,
  getOrderByTransactionId
};
