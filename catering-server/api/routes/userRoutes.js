const express = require('express')
const router = express.Router();

const userController = require('../controllers/userControllers');
const verifyToken = require('../middleware/verifyToken')
const verifyAdmin = require('../middleware/verifyAdmin')

router.get('/',verifyToken, verifyToken,  userController.getAllUsers);
router.post('/', userController.createUser);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);
router.get('/admin/:email', verifyToken, userController.getAdmin);
router.patch('/admin/:id', verifyToken, verifyAdmin, userController.makeAdmin);
router.patch('/:id/address', verifyToken, userController.updateUserAddress);
router.patch('/:id/mobileNumber', verifyToken, userController.updateUserMobile);
router.post('/check-email', userController.checkEmailExists);
router.get('/:id/mobileNumber', verifyToken, userController.getUserMobile);
router.get('/check-mobile/:phone_number', userController.checkMobileExists);
module.exports = router;

