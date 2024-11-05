const OTP = require('../models/Otp');
const twilio = require('twilio');

// Initialize Twilio client with your credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


const client = twilio(accountSid, authToken);

// Send OTP function
const sendVerificationCode = async (req, res) => {
    const { phone_number } = req.body;

    console.log('Sending OTP to:', phone_number); // Debug log

    if (!phone_number) {
        return res.status(400).json({ message: "Phone number is required." });
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP

        // Send OTP via Twilio
        const message = await client.messages.create({
            body: `Your OTP code is: ${otp}`,
            from: twilioPhoneNumber, // Your Twilio number
            to: phone_number, // Verified recipient number
        });

        console.log('OTP sent successfully, SID:', message.sid);

        res.status(200).json({ message: "OTP sent successfully." });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP.', error: error.message });
    }
};

// Verify OTP function
const verifyCode = async (req, res) => {
    const { phone_number, code } = req.body;

    console.log('Verifying OTP:', phone_number, code); // Debugging log

    if (!phone_number || !code) {
        return res.status(400).json({ message: "Phone number and code are required." });
    }

    try {
        const otpRecord = await OTP.findOne({ phone_number });

        if (!otpRecord) {
            return res.status(404).json({ message: "OTP not found." });
        }

        if (otpRecord.otp !== code || otpRecord.otp_expiry < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        // Mark OTP as verified
        otpRecord.verified = true;
        await otpRecord.save();

        res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP.' });
    }
};

module.exports = { sendVerificationCode, verifyCode };
