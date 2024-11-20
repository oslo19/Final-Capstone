const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Log all headers for debugging
  console.log("Headers:", req.headers);

  // Check if the Authorization header exists
  if (!req.headers.authorization) {
    console.warn("Authorization header is missing.");
    return res.status(401).send({ message: "Authorization header is missing." });
  }

  // Extract the token from the Authorization header
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    console.warn("Malformed token or missing Bearer.");
    return res.status(401).send({ message: "Malformed token or missing Bearer." });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(401).send({ message: "Token is invalid or expired." });
    }

    // If the token is valid, attach the decoded payload to the request
    console.log("Decoded Token:", decoded);
    req.decoded = decoded;
    next();
  });
};

module.exports = verifyToken;
