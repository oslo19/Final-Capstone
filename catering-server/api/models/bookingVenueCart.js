const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingVenueCartSchema = new Schema({
    venueId: {
        type: String,
        required: true,
    },
    venueName: {
        type: String,
        required: true,
        trim: true,
    },
    description: String,
    address: {
        type: String,
        required: true,
    },
    images: [String],
    rentalPrice: {
        type: Number,
        required: true,
    },
    capacity: Number,
    email: {
        type: String,
        required: true,
    },
    bookingDate: {
        type: Date,
        required: true,
    },
});

const BookingVenueCart = mongoose.model("BookingVenueCart", bookingVenueCartSchema);
module.exports = BookingVenueCart;
