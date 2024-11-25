const mongoose = require('mongoose');
const { Schema } = mongoose;


const contractSchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Contract = mongoose.model("Contract", contractSchema);
  module.exports = Contract;
  