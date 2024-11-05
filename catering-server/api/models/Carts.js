const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    menuItemId: String,
    name: {
        type: String,
        trim: true,
        required: true,
        minlength: 3
    },
    recipe: String,
    image: String, 
    price: Number,
    quantity: Number,
    email: {
        type: String,
        required: true,
    },
    isRental: {  // New field to mark the item as a rental
        type: Boolean,
        default: false,
    },
    days: {  // New field to store the number of days for rental
        type: Number,
        default: 1,  // Default to 1, even for non-rental items
    }
});

const Carts = mongoose.model("Cart", cartSchema);

module.exports = Carts;
