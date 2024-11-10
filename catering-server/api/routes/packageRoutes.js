const express = require("express");
const packageController = require('../controllers/packageControllers');
const router = express.Router();

router.get('/', packageController.getAllPackages);
router.post('/', packageController.createPackage);

module.exports = router;
