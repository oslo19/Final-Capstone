const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartControllers');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, cartController.getCartByEmail);
router.post('/', cartController.addToCart);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);
router.get('/:id', cartController.getSingleCart);



module.exports = router;
