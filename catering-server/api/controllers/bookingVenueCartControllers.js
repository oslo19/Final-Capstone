const BookingVenueCart = require("../models/bookingVenueCart");

// Get all booked venues by email
const getBookingVenueCartByEmail = async (req, res) => {
    try {
        const email = req.query.email;
        const result = await BookingVenueCart.find({ email }).exec();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a venue to booking cart
const addToBookingVenueCart = async (req, res) => {
    const { venueId, venueName, description, address, images, rentalPrice, capacity, email, bookingDate } = req.body;

    try {
        const existingVenue = await BookingVenueCart.findOne({ email, venueId });
        if (existingVenue) {
            return res.status(400).json({ message: "Venue already exists in the cart!" });
        }

        const venueItem = await BookingVenueCart.create({
            venueId,
            venueName,
            description,
            address,
            images,
            rentalPrice,
            capacity,
            email,
            bookingDate,
        });
        res.status(201).json(venueItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a booked venue in the cart
const updateBookingVenueCart = async (req, res) => {
    const bookingVenueCartId = req.params.id;
    const { venueId, venueName, description, address, images, rentalPrice, capacity, email, bookingDate } = req.body;

    try {
        const updatedVenue = await BookingVenueCart.findByIdAndUpdate(
            bookingVenueCartId,
            { venueId, venueName, description, address, images, rentalPrice, capacity, email, bookingDate },
            { new: true, runValidators: true }
        );
        if (!updatedVenue) {
            return res.status(404).json({ message: "Venue not found in the cart" });
        }
        res.status(200).json(updatedVenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a booked venue from the cart
const deleteBookingVenueCart = async (req, res) => {
    const bookingVenueCartId = req.params.id;

    try {
        const deletedVenue = await BookingVenueCart.findByIdAndDelete(bookingVenueCartId);
        if (!deletedVenue) {
            return res.status(404).json({ message: "Venue not found in the cart" });
        }
        res.status(200).json({ message: "Venue deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single booked venue from the cart
const getSingleBookingVenueCart = async (req, res) => {
    const bookingVenueCartId = req.params.id;

    try {
        const venue = await BookingVenueCart.findById(bookingVenueCartId);
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }
        res.status(200).json(venue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBookingVenueCartByEmail,
    addToBookingVenueCart,
    updateBookingVenueCart,
    deleteBookingVenueCart,
    getSingleBookingVenueCart,
};
