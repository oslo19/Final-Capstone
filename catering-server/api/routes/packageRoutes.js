const express = require("express");
const packageController = require('../controllers/packageControllers');
const router = express.Router();

router.get('/', packageController.getAllPackages);
router.post('/', packageController.createPackage);
router.delete('/:id', packageController.deletePackageItem);
module.exports = router;
