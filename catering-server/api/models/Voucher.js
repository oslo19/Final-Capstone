// models/Voucher.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const voucherSchema = new Schema({
    code: { type: String, required: true, unique: true, trim: true },
    discountType: { type: String, enum: ['flat', 'percentage'], default: 'percentage' },
    discountValue: { type: Number, required: true },
    validUntil: { type: Date, required: true },
    maxUsage: { type: Number, default: 1 }, // New field
    usageCount: { type: Number, default: 0 }, // New field
    // usersRedeemed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Temporarily remove this
    description: { type: String, default: 'Get a discount on your next purchase!' },
    minimumSpend: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Voucher = mongoose.model("Voucher", voucherSchema);
module.exports = Voucher;
