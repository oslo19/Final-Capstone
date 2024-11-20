const https = require("https");
const querystring = require("querystring");
const OTP = require("../models/Otp");

// Send OTP
const sendVerificationCode = async (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
    const apiKey = process.env.SEMAPHORE_API_KEY; // Semaphore API Key
    const senderName = "SEMAPHORE";
    const message = `Your OTP code is: ${otp}`;

    // Semaphore API URL
    const url = "https://semaphore.co/api/v4/messages";

    // Prepare POST data
    const postData = querystring.stringify({
      apikey: apiKey,
      number: phone_number,
      message: message,
      sendername: senderName,
    });

    // HTTPS request options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const request = https.request(url, options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", async () => {
        console.log("Semaphore response:", data);
        const responseData = JSON.parse(data);

        if (responseData.status === "Queued") {
          const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
          const otpRecord = new OTP({
            phone_number,
            otp,
            otp_expiry: otpExpiry,
          });

          await otpRecord.save();
          res.status(200).json({ message: "OTP sent successfully." });
        } else {
          throw new Error("Failed to queue OTP in Semaphore.");
        }
      });
    });

    request.on("error", (error) => {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send OTP.", error: error.message });
    });

    // Write POST data and end the request
    request.write(postData);
    request.end();
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP.", error: error.message });
  }
};

// Verify OTP
const verifyCode = async (req, res) => {
  const { phone_number, code } = req.body;

  if (!phone_number || !code) {
    return res.status(400).json({ message: "Phone number and OTP are required." });
  }

  try {
    // Look up the OTP record
    const otpRecord = await OTP.findOne({ phone_number });

    if (!otpRecord) {
      return res.status(404).json({ message: "OTP not found." });
    }

    // Check if the OTP is correct and not expired
    if (otpRecord.otp !== code || otpRecord.otp_expiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP.", error: error.message });
  }
};

module.exports = { sendVerificationCode, verifyCode };
