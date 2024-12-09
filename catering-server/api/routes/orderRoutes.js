const express = require("express");
const {
  createOrder,
  getOrdersByEmailOrStatus,
  getAllOrders,
  updateOrderStatus,
  updateOrder,
  getOrderByTransactionId,
  getAggregatedSalesReport ,
  addItemToOrder,
  updateOrderStatusAndPayment,
  getConfirmedSchedulesForDay,
  getAllConfirmedOrders,
  updateOrderStatusByTransactionId
} = require("../controllers/orderController");
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();


router.post("/", createOrder);
router.get("/", getOrdersByEmailOrStatus);
router.get("/all", getAllOrders);
router.get("/confirmed", getAllConfirmedOrders);
router.patch("/:id/status", updateOrderStatus);
router.put('/:id',  updateOrder);
router.get("/:transactionId", getOrderByTransactionId);
router.get("/sales-aggregation", getAggregatedSalesReport);
router.patch("/:id/add-item", updateOrder, addItemToOrder);
router.patch("/:id/status-payment", updateOrderStatusAndPayment);
router.get("/schedules", getConfirmedSchedulesForDay);
router.patch("/transaction/:transactionId/status", updateOrderStatusByTransactionId);


module.exports = router;
