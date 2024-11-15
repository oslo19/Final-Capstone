const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingRentalCartSchema = new Schema({
    rentalItemId: String,
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3
    },
    category: String,
    description: String,
    image: String,
    price: Number,
    quantity: Number,
    email: {
        type: String,
        required: true,
    },
    rentalDays: {
        type: Number,
        default: 1,
    },
});

const BookingRentalCart = mongoose.model("BookingRentalCart", bookingRentalCartSchema);

module.exports = BookingRentalCart;
