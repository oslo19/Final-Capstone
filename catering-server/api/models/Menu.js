const mongoose = require('mongoose');
const {Schema} = mongoose;

// create schema object for Menu Items
const menuSchema = new Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    }

})

// create model
const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;