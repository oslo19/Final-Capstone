const mongoose = require('mongoose');
const { Schema } = mongoose;


const venueSchema = new Schema({
    venueName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    venueType: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    images: { 
        type: [String], 
        required: true, 
    },
    address: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    rentalPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Venue = mongoose.model('Venue', venueSchema);
module.exports = Venue;
