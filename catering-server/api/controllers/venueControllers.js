const Venue = require('../models/Venue');

// Get all venues
const getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.find({}).sort({ createdAt: -1 });
        res.status(200).json(venues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const postVenue = async (req, res) => {
    const { venueName, venueType, description, address, capacity, rentalPrice, images } = req.body;

    try {
        const newVenue = await Venue.create({
            venueName,
            venueType,
            description,
            address,
            capacity,
            rentalPrice,
            images, 
        });
        res.status(200).json(newVenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

  

// Delete a venue
const deleteVenue = async (req, res) => {
    const venueId = req.params.id;
    try {
        const deletedVenue = await Venue.findByIdAndDelete(venueId);

        if (!deletedVenue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.status(200).json({ message: 'Venue deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single venue
const singleVenue = async (req, res) => {
    const venueId = req.params.id;
    try {
        const venue = await Venue.findById(venueId);
        res.status(200).json(venue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update single venue
const updateVenue = async (req, res) => {
    const venueId = req.params.id;
    const { venueName, venueType, description, address, capacity, rentalPrice } = req.body;

    const updateData = { venueName, venueType, description, address, capacity, rentalPrice };

    try {
        const updatedVenue = await Venue.findByIdAndUpdate(venueId, updateData, { new: true, runValidators: true });
        if (!updatedVenue) {
            return res.status(404).json({ message: 'Venue not found' });
        }
        res.status(200).json(updatedVenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset quantity of a single menu item
const resetVenueItemQuantity = async (req, res) => {
    const venueId = req.params.id;
    try {
        // Update the quantity to 1
        const updatedVenue = await Venue.findByIdAndUpdate(
            venueId, { quantity: 1 }, 
            { new: true, runValidators: true }
        );

        if(!updatedVenue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        res.status(200).json(updatedVenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllVenues,
    postVenue,
    deleteVenue,
    singleVenue,
    updateVenue,
    resetVenueItemQuantity
};
