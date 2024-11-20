const express = require("express");
const { createOrder, getOrdersByEmail, confirmOrder, getAllOrders } = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder); // POST: Create a new order
router.get("/", getOrdersByEmail); // GET: Fetch orders by email
router.patch("/confirm/:id", confirmOrder);
router.get("/all", getAllOrders);

module.exports = router;
