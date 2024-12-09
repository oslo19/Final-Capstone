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


// Delete a contract
const deleteContract = async (req, res) => {
  try {
    const contractId = req.params.contractId;

    // Find the contract and delete the file from the server
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found." });
    }

    // Delete the contract file from the server
    fs.unlinkSync(contract.filePath);  // Delete the file from the file system

    // Delete the contract document from the database
    await Contract.findByIdAndDelete(contractId);

    res.status(200).json({ message: "Contract deleted successfully." });
  } catch (error) {
    console.error("Error deleting contract:", error);
    res.status(500).json({ message: "Failed to delete contract." });
  }
};

const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.find().sort({ uploadedAt: -1 });
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { uploadContract, getUserContracts, deleteContract, getAllContracts };
