const Voucher = require('../models/Voucher');
const moment = require('moment');



// Create a new voucher
const createVoucher = async (req, res) => {
    const newVoucher = req.body;

    // Ensure validUntil is a proper DateTime format using moment
    if (!moment(newVoucher.validUntil, moment.ISO_8601, true).isValid()) {
        return res.status(400).json({ message: 'Invalid DateTime format.' });
    }

    try {
        const result = await Voucher.create(newVoucher);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all vouchers
const getAllVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find({}).sort({ createdAt: -1 });

        // Format dates using moment.js
        const formattedVouchers = vouchers.map(voucher => ({
            ...voucher._doc,
            validUntil: moment(voucher.validUntil).format('MMMM DD, YYYY HH:mm') // Example: October 19, 2024 23:59
        }));

        res.status(200).json(formattedVouchers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single voucher by code
const getVoucherByCode = async (req, res) => {
    try {
        const code = req.params.code;
        const voucher = await Voucher.findOne({ code });

        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found!' });
        }

        // Format the date using moment.js
        const formattedVoucher = {
            ...voucher._doc,
            validUntil: moment(voucher.validUntil).format('MMMM DD, YYYY HH:mm')
        };

        res.status(200).json(formattedVoucher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a voucher
const updateVoucher = async (req, res) => {
    try {
        const code = req.params.code;
        const updatedData = req.body;

        if (updatedData.validUntil && !moment(updatedData.validUntil, moment.ISO_8601, true).isValid()) {
            return res.status(400).json({ message: 'Invalid DateTime format.' });
        }

        const updatedVoucher = await Voucher.findOneAndUpdate(
            { code },
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedVoucher) {
            return res.status(404).json({ message: 'Voucher not found!' });
        }

        res.status(200).json(updatedVoucher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a voucher
const deleteVoucher = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedVoucher = await Voucher.findByIdAndDelete(id);

        if (!deletedVoucher) {
            return res.status(404).json({ message: 'Voucher not found!' });
        }

        res.status(200).json({ message: 'Voucher deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Validate a voucher
const validateVoucher = async (req, res) => {
    const { code, amountSpent } = req.body;

    try {
        const voucher = await Voucher.findOne({ code });

        if (!voucher) {
            return res.status(404).json({ message: 'Voucher not found!' });
        }

        if (!voucher.isActive) {
            return res.status(400).json({ message: 'This voucher is no longer active.' });
        }

        const now = moment(); // Current date and time
        if (moment(voucher.validUntil).isBefore(now)) {
            return res.status(400).json({ message: 'This voucher has expired.' });
        }

        if (amountSpent < voucher.minimumSpend) {
            return res.status(400).json({
                message: `Minimum spend of ₱${voucher.minimumSpend} is required to use this voucher.`,
            });
        }

        if (voucher.usageCount >= voucher.maxUsage) {
            return res.status(400).json({ message: 'This voucher has reached its usage limit.' });
        }

       

        // Update the voucher usage
        voucher.usageCount += 1;
        await voucher.save();

        res.status(200).json({ message: 'Voucher is valid and applied!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVoucher,
    getAllVouchers,
    getVoucherByCode,
    updateVoucher,
    deleteVoucher,
    validateVoucher,
};
