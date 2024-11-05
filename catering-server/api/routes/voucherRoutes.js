const express = require('express');
const Voucher = require("../models/Voucher");
const router = express.Router();


const voucherController = require('../controllers/voucherControllers');


router.post('/', voucherController.createVoucher);
router.get('/',  voucherController.getAllVouchers);
router.get('/:id',  voucherController.getVoucherByCode);
router.put('/:id', voucherController.updateVoucher);
router.delete('/:id', voucherController.deleteVoucher);
router.post('/validate', voucherController.validateVoucher);

module.exports = router;
