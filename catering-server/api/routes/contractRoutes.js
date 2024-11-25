const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contractController");
const upload = require("../config/multer");


router.post("/upload", upload.single("file"), contractController.uploadContract);
router.get("/user/:userId", contractController.getUserContracts);

module.exports = router;
