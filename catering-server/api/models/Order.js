const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  transactionId: { type: String, required: true },
  items: {
    menuItems: { type: Array, default: [] },
    rentalItems: { type: Array, default: [] },
    venueItems: { type: Array, default: [] },
  },
  price: { type: Number, required: true },
  source: { type: String, required: true }, // "book" or "cart"
  status: { type: String, default: "order pending" },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
