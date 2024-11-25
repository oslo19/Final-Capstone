const Contract = require("../models/Contract");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// Upload a contract
const uploadContract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const newContract = await Contract.create({
      userId,
      filePath: req.file.path,
    });

    res.status(201).json({
      message: "Contract uploaded successfully.",
      contract: newContract,
    });
  } catch (error) {
    console.error("Error uploading contract:", error);
    res.status(500).json({ message: "Failed to upload contract." });
  }
};


// Fetch all contracts for a user
const getUserContracts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userContracts = await Contract.find({ userId }).sort({ uploadedAt: -1 });
    res.status(200).json(userContracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadContract, getUserContracts };
