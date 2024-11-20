const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueControllers');

// Get all venues
router.get('/', venueController.getAllVenues);

// Post a new venue
router.post('/', venueController.postVenue);

// Delete a venue
router.delete('/:id', venueController.deleteVenue);

// Get a single venue
router.get('/:id', venueController.singleVenue);

// Update a single venue
router.patch('/:id', venueController.updateVenue);
router.patch('/reset-quantity/:id', venueController.resetVenueItemQuantity);

module.exports = router;
