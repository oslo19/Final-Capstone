const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    email: { type: String, required: true },
    transactionId: { type: String, required: true },
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true },
    modeOfPayment: { type: String, required: true },
    items: {
      menuItems: { type: Array, default: [] },
      rentalItems: { type: Array, default: [] },
      venueItems: { type: Array, default: [] },
    },
    price: { type: Number, required: true },
    source: { type: String, required: true }, // "cart" or "booking"
    status: {
      type: String,
      enum: ["order pending", "confirmed", "completed", "cancelled", "partially paid"],
      default: "order pending",
    },
    notes: { type: String, default: "" },
    typeOfEvent: { type: String, default: "" }, // Booking-specific fields
    numberOfPax: { type: Number, default: 0 },
    typeOfMenu: { type: String, default: "" },
    address: { type: String, required: true },
    remainingBalance: { type: Number, default: 0 },
    schedule: { type: String },
    mobileNumber: { type: String, required: true },
    estimatedMilestones: {
      confirmed: { type: Date },
      shipped: { type: Date },
      outForDelivery: { type: Date },
      delivered: { type: Date },
    },
  },

  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
