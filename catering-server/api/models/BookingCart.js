const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingCartSchema = new Schema({
    bookingItemId: String,
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3
    },
    description: String,
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

const BookingCart = mongoose.model("BookingCart", bookingCartSchema);

module.exports = BookingCart;
