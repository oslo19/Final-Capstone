const https = require("https");
const querystring = require("querystring");
const OTP = require("../models/Otp");
const User = require("../models/User");

// Send OTP

const sendVerificationCode = async (req, res) => {
  console.log('Received request to send OTP:', req.body); // Log incoming request

  const { phone_number } = req.body;
  if (!phone_number) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    // Check if an OTP exists for this phone number and if it's expired
    const otpRecord = await OTP.findOne({ phone_number });

    // If OTP exists and it's expired, delete the old record and send a new OTP
    if (otpRecord) {
      const currentTime = new Date();
      if (currentTime > otpRecord.otp_expiry) {
        // OTP expired, delete the old record and send a new OTP
        await otpRecord.deleteOne();
      } else {
        // OTP is still valid, return a message
        return res.status(400).json({ message: "OTP has already been sent. Please wait for the expiry time." });
      }
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
    const apiKey = process.env.INFOBIP_API_KEY; // Infobip API Key
    const message = `Your OTP code is: ${otp}`;

    // Infobip API URL
    const url = "https://api.infobip.com/sms/2/text/advanced";

    // Validate phone number (must start with a "+" and only contain numbers)
    if (!/^\+?\d+$/.test(phone_number)) {
      console.log('Invalid phone number format:', phone_number); // Log invalid phone numbers
      return res.status(400).json({ message: "Invalid phone number format." });
    }

    const postData = JSON.stringify({
      messages: [
        {
          from: "ASDASDAS", // Replace with your actual sender name or phone number
          destinations: [{ to: phone_number }],
          text: message,
        },
      ],
    });

    const options = {
      method: "POST",
      headers: {
        "Authorization": `App ${apiKey}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const request = https.request(url, options, (response) => {
      let data = "";

      // Collect the response data
      response.on("data", (chunk) => {
        data += chunk;
      });

      // When the response ends, process the data
      response.on("end", async () => {
        console.log("Infobip response:", data); // Log the Infobip response

        const responseData = JSON.parse(data);
        const messageStatus = responseData.messages[0].status;

        // OTP expiry time: 3 hours (PH timezone)
        const otpExpiry = new Date();
        otpExpiry.setHours(otpExpiry.getHours() + 3); // Add 3 hours for PH timezone

        // Prepare OTP record
        const otpRecord = new OTP({
          phone_number,
          otp,
          otp_expiry: otpExpiry,
        });

        console.log('OTP record before saving:', otpRecord); // Log OTP record before saving

        try {
          // Save OTP to the database
          await otpRecord.save();
          console.log('OTP record saved:', otpRecord);

          // Handle different response statuses from Infobip
          if (messageStatus.groupName === "SUCCESS") {
            res.status(200).json({
              message: "OTP sent successfully.",
              otpRecord: otpRecord, // Send the OTP record back as part of the response
            });
          } else if (messageStatus.groupName === "PENDING") {
            console.log("Message is pending, delivery will continue:", messageStatus);
            res.status(200).json({
              message: "OTP is being processed. Please try again if needed.",
              otpRecord: otpRecord, // Send OTP record even if the status is pending
            });
          } else {
            console.error("Error from Infobip:", messageStatus);
            res.status(500).json({
              message: `Infobip failed to send OTP: ${messageStatus.description}`,
            });
          }
        } catch (error) {
          console.error('Error saving OTP record:', error);
          res.status(500).json({ message: 'Failed to save OTP.', error: error.message });
        }
      });
    });

    request.on("error", (error) => {
      console.error("Error sending OTP:", error); // Log errors in the request
      res.status(500).json({ message: "Failed to send OTP.", error: error.message });
    });

    request.write(postData);
    request.end();
  } catch (error) {
    console.error("Error in sending OTP:", error); // Catch any additional errors
    res.status(500).json({ message: "Failed to send OTP.", error: error.message });
  }
};





// Verify OTP
const verifyCode = async (req, res) => {
  const { phone_number, code } = req.body;

  // Ensure phone_number and code are present
  if (!phone_number || !code) {
    return res.status(400).json({ message: "Phone number and OTP code are required." });
  }

  try {
    // Find OTP record based on phone number
    const otpRecord = await OTP.findOne({ phone_number });

    // Check if OTP record exists
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP record not found for this phone number." });
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (currentTime > otpRecord.otp_expiry) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // Validate the OTP code
    if (otpRecord.otp !== code) {
      return res.status(400).json({ message: "Invalid OTP code." });
    }

    // Mark OTP as verified if correct
    otpRecord.verified = true;
    await otpRecord.save();

    const user = await User.findOneAndUpdate(
      { mobileNumber: phone_number }, 
      { isVerified: true },           
      { new: true }                  
    );
    // Return success response
    res.status(200).json({ message: "OTP verified successfully." });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP.", error: error.message });
  }
};

const checkOtpExpiry = async (req, res) => {
  const { phone_number } = req.params;

  try {
    const otpRecord = await OTP.findOne({ phone_number });

    if (!otpRecord) {
      return res.status(404).json({ message: "No OTP record found for this phone number." });
    }

    const currentTime = new Date();
    const isExpired = currentTime > otpRecord.otp_expiry;

    res.status(200).json({
      isExpired,
      otpExpiry: otpRecord.otp_expiry,  // Send the expiration time to the frontend for countdown
    });
  } catch (error) {
    res.status(500).json({ message: "Error checking OTP expiry.", error: error.message });
  }
};

module.exports = { sendVerificationCode, verifyCode, checkOtpExpiry };
