const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpControllers');

// Route to send OTP
router.post('/send-code', otpController.sendVerificationCode);

// Route to verify OTP
router.post('/verify-code', otpController.verifyCode);

module.exports = router;