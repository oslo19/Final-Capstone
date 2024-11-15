const express = require('express');
const router = express.Router();
const bookingRentalCartController = require('../controllers/bookingRentalCartControllers');
const verifyToken = require('../middleware/verifyToken');

router.get('/', bookingRentalCartController.getBookingRentalCartByEmail);
router.post('/', bookingRentalCartController.addToBookingRentalCart);
router.put('/:id',  bookingRentalCartController.updateBookingRentalCart);
router.delete('/:id',  bookingRentalCartController.deleteBookingRentalCart);
router.get('/:id',  bookingRentalCartController.getSingleBookingRentalCart);

module.exports = router;
