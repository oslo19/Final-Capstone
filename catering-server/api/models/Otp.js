// models/OTP.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema = new Schema({
  phone_number: { 
    type: String, 
    required: true, 
    match: [/^\+?\d{10,15}$/, "Invalid phone number format"] // Update regex to allow optional '+' sign
  },
  otp: { type: String, required: true },
  otp_expiry: { type: Date, required: true },
  verified: { type: Boolean, default: false }, // Track if OTP is verified
});

const OTP = mongoose.model('Otp', otpSchema);
module.exports = OTP;
