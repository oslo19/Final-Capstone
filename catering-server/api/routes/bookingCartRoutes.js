// routes/bookingCartRoutes.js
const express = require('express');
const router = express.Router();
const bookingCartController = require('../controllers/bookingCartControllers');
const verifyToken = require('../middleware/verifyToken');

router.get('/',  bookingCartController.getBookingCartByEmail);
router.post('/', bookingCartController.addToBookingCart);
router.put('/:id', bookingCartController.updateBookingCart);
router.delete('/:id', bookingCartController.deleteBookingCart);
router.get('/:id', bookingCartController.getSingleBookingCart);

module.exports = router;
