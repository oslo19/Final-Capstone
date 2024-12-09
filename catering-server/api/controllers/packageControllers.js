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
        // After creating the package, populate the items (menu items) to include their names
        const populatedPackage = await Package.findById(result._id).populate('items', 'name');

        res.status(200).json(populatedPackage); // Return the populated package with item names
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deletePackageItem = async(req, res) => {
    const packageId = req.params.id;
    // console.log(menuId)
    try {
        const deletedItem = await Package.findByIdAndDelete(packageId);

        // console.log(deletedItem);

        if(!deletedItem){
            return res.status(404).json({ message:"Menu not found"})
        }
        res.status(200).json({message: "Menu Item deleted successfully!"})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllPackages,
    createPackage,
    deletePackageItem
};
