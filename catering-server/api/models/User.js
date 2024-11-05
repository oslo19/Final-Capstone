const mongoose = require('mongoose');
const { Schema } = mongoose;

// schema model
const userSchema = new Schema({
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true },
    email: {
        type: String,
        trim: true,
        minlength: 3,
        required: true
    },
    mobileNumber: {
        type: String,  
        match: [/^\+63\d{9,12}$/, "Please enter a valid phone number"],
        required: false,
    },
    photoURL: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    address: {
        type: String,
        required: false,
    },
    coordinates: {
        type: [Number],  
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false, 
    },
});

// create a model instance
const User = mongoose.model('User', userSchema);

module.exports = User;
