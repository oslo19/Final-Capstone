const Rental = require("../models/Rental");

const getAllRentalItems = async(req, res) => {
    try {
        const rentals = await Rental.find({}).sort({createdAt: -1});
        res.status(200).json(rentals)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// post a new rental item
const postRentalItem = async(req, res) => {
    const newRentalItem = req.body;
    try {
        const result = await Rental.create(newRentalItem);
        res.status(200).json(result)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// delete a rental item
const deleteRentalItem = async(req, res) => {
    const rentalId = req.params.id;
    // console.log(rentalId)
    try {
        const deletedRentalItem = await Rental.findByIdAndDelete(rentalId);

        // console.log(deletedRentalItem);

        if(!deletedRentalItem){
            return res.status(404).json({ message:"Rental not found"})
        }
        res.status(200).json({message: "Rental Item deleted successfully!"})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get single rental item
const singleRentalItem = async (req, res) => {
    const rentalId = req.params.id;
    try {
        const rental = await Rental.findById(rentalId);
        res.status(200).json(rental)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update single menu item
const updateRentalItem = async (req, res) => {
    const rentalId = req.params.id;
    const { menuItemId, name, recipe, image, category, quantity, price, days } = req.body;

    // Create update object and conditionally add days
    const updateData = { menuItemId, name, recipe, image, category, quantity, price };
    if (days !== undefined) {
        updateData.days = days; // Only include days if it is passed
    }

    try {
        const updatedRental = await Rental.findByIdAndUpdate(
            rentalId, 
            updateData, 
            { new: true, runValidators: true }
        );
        if (!updatedRental) {
            return res.status(404).json({ message: "Rental not found" });
        }
        res.status(200).json(updatedRental);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const resetRentalItemQuantity = async (req, res) => {
    const rentalId = req.params.id;
    try {
        // Update the quantity to 1
        const updatedRental = await Rental.findByIdAndUpdate(
            rentalId, { quantity: 1 }, 
            { new: true, runValidators: true }
        );

        if(!updatedRental) {
            return res.status(404).json({ message: "Rental not found" });
        }

        res.status(200).json(updatedRental);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllRentalItems,
    postRentalItem, 
    deleteRentalItem,
    singleRentalItem,
    updateRentalItem,
    resetRentalItemQuantity,
}