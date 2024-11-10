const Package = require('../models/Package');

const getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find({}).populate('items').sort({ createdAt: -1 });
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPackage = async (req, res) => {
    const newPackage = req.body;
    try {
        const result = await Package.create(newPackage);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPackages,
    createPackage,
};
