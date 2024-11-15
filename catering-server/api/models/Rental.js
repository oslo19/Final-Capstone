const mongoose = require('mongoose');
const {Schema} = mongoose;

// create schema object for Menu Items
const rentalSchema = new Schema({
    menuItemId: String,
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3
    },
    recipe: String,
    image: String, 
    category: String,
    quantity: Number,
    price: Number,
    days: {
        type: Number, 
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

// create model
const Rental = mongoose.model("Rental", rentalSchema);
module.exports = Rental;