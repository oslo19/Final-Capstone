const express = require("express");
const Rental = require("../models/Rental");
const router = express.Router();

const rentalController = require('../controllers/rentalControllers')

// get all menu items 

router.get('/', rentalController.getAllRentalItems )

// post a menu item
router.post('/', rentalController.postRentalItem);

// delete a menu item
router.delete('/:id', rentalController.deleteRentalItem);

// get single menu item
router.get('/:id', rentalController.singleRentalItem);

// update single menu item
router.patch('/:id', rentalController.updateRentalItem)

router.patch('/reset-quantity/:id', rentalController.resetRentalItemQuantity);

module.exports= router;