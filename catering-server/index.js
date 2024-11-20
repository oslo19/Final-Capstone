const paymongo = require('paymongo');
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
const venueRoutes = require('./api/routes/venueRoutes');
const voucherRoutes = require('./api/routes/voucherRoutes');
const bookingCartRoutes = require('./api/routes/bookingCartRoutes');
const bookingRentalCartRoutes = require('./api/routes/bookingRentalCartRoutes');
const bookingVenueCartRoutes = require('./api/routes/bookingVenueCartRoutes');
const packageRoutes = require('./api/routes/packageRoutes');
const otpRoutes = require('./api/routes/otpRoutes');
const orderRoutes = require('./api/routes/orderRoutes');  
app.use('/menu', menuRoutes)
app.use('/carts', cartRoutes);
app.use('/users', userRoutes);
app.use('/payments', paymentRoutes);
app.use('/rental', rentalRoutes);
app.use('/voucher', voucherRoutes);
app.use('/booking-cart', bookingCartRoutes);
app.use('/booking-rental-cart', bookingRentalCartRoutes);
app.use('/booking-venue-cart', bookingVenueCartRoutes);
app.use('/packages', packageRoutes);
app.use('/venues', venueRoutes);
app.use('/otp', otpRoutes); 
app.use('/orders', orderRoutes); 




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


app.post('/create-payment-intent', async (req, res) => {
  try {
    const { price } = req.body;
    const amount = price * 100; // Convert price to centavos (for PHP)

    // Authenticate PayMongo (replace with your PayMongo secret key)
    paymongo.auth(process.env.PAYMONGO_SECRET_KEY);

    // Create the payment link (this is a simplified example)
    const paymentIntent = await paymongo.createAPaymentintent({
      data: {
        attributes: {
          amount,
          payment_method_allowed: ['gcash', 'card', 'paymaya'], // Allowed payment methods
          currency: 'PHP',
          capture_type: 'automatic',
        }
      }
    });

    res.json({ clientSecret: paymentIntent.data.attributes.client_key }); // Respond with client key for front-end
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send("Failed to create payment intent");
  }
});

// Order creation route (you already have this setup)
app.post('/orders', async (req, res) => {
  const orderData = req.body;
  try {
    // Save order in the database (e.g., MongoDB)
    // Assuming you have an Order model set up
    const newOrder = new Order(orderData);
    await newOrder.save();
    res.status(200).send({ message: "Order placed successfully", orderId: newOrder._id });
  } catch (error) {
    res.status(500).send({ error: "Failed to place order" });
  }
});





app.get("/", (req, res) => {
  res.send("Hello Foodi Client Server!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
