const mongoose = require('mongoose');
const {Schema} = mongoose;

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
    menuTypes: {
        type: [String],
        enum: ["buffet", "packed meals"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;