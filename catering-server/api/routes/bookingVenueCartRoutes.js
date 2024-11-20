const express = require('express');
const router = express.Router();
const bookingVenueCartController = require('../controllers/bookingVenueCartControllers');
const verifyToken = require('../middleware/verifyToken');

router.get('/',  bookingVenueCartController.getBookingVenueCartByEmail);
router.post('/',  bookingVenueCartController.addToBookingVenueCart);
router.put('/:id',  bookingVenueCartController.updateBookingVenueCart);
router.delete('/:id',  bookingVenueCartController.deleteBookingVenueCart);
router.get('/:id',  bookingVenueCartController.getSingleBookingVenueCart);

module.exports = router;
