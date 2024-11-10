const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


// middleware
app.use(cors());
app.use(express.json());



// mongodb configuration using mongoose

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@catering-final-project.bnejb.mongodb.net/capstone-final-project?retryWrites=true&w=majority`
  )
  .then(
    console.log("MongoDB Connected Successfully!")
  )
  .catch((error) => console.log("Error connecting to MongoDB", error));

// jwt authentication
app.post('/jwt', async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1hr'
  })
  res.send({ token });
})


//   import routes here
const menuRoutes = require('./api/routes/menuRoutes');
const cartRoutes = require('./api/routes/cartRoutes');
const userRoutes = require('./api/routes/userRoutes');
const paymentRoutes = require('./api/routes/paymentRoutes');
const rentalRoutes = require('./api/routes/rentalRoutes');
const voucherRoutes = require('./api/routes/voucherRoutes');
const otpRoutes = require('./api/routes/otpRoutes');
const bookingCartRoutes = require('./api/routes/bookingCartRoutes');
const packageRoutes = require('./api/routes/packageRoutes');
app.use('/menu', menuRoutes)
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/rental', rentalRoutes);
app.use('/voucher', voucherRoutes);
app.use('/otp', otpRoutes);
app.use('/booking-cart', bookingCartRoutes);
app.use('/packages', packageRoutes);



// stripe payment routes
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price*100;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
   
    payment_method_types: ["card",],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});





app.get("/", (req, res) => {
  res.send("Hello Foodi Client Server!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
