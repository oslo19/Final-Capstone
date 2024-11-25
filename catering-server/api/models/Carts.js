const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    menuItemId: String,
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3,
    },
    description: String, // Optional: Align with booking cart
    image: String,
    price: Number,
    quantity: Number,
    email: {
        type: String,
        required: true,
    },
    isRental: {
        type: Boolean,
        default: false,
    },
    days: {
        type: Number,
        default: 1,
    },
});

const Carts = mongoose.model("Cart", cartSchema);

module.exports = Carts;
