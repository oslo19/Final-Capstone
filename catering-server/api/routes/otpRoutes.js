const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpControllers');

// Route to send OTP
router.post('/verify-code', otpController.verifyCode);
router.post('/send-code', otpController.sendVerificationCode);
router.get('/otp/check-expiry/:phone_number', otpController.checkOtpExpiry);

module.exports = router;