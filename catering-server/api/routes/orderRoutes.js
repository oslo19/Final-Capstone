const express = require("express");
const {
  createOrder,
  getOrdersByEmailOrStatus,
  getAllOrders,
  updateOrderStatus,
  getConfirmedSchedulesForDay,
  updateOrder,
  getOrderByTransactionId,
  getAggregatedSalesReport 
} = require("../controllers/orderController");
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// POST: Create a new order
router.post("/", createOrder);

// GET: Fetch orders by email or status
router.get("/", getOrdersByEmailOrStatus);

// GET: Fetch all orders (Admin)
router.get("/all", getAllOrders);

// PATCH: Update order status
router.patch("/:id/status", updateOrderStatus);

// GET: Get confirmed schedules for a day
router.get("/schedules/confirmed", getConfirmedSchedulesForDay);
router.put('/:id', verifyToken, updateOrder);
router.get("/:transactionId", getOrderByTransactionId);
router.get("/sales-aggregation", getAggregatedSalesReport);
module.exports = router;
