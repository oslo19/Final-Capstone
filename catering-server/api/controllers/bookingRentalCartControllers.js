const BookingRentalCart = require("../models/bookingRentalCart");

// Get booking rental cart items by email
const getBookingRentalCartByEmail = async (req, res) => {
    try {
        const email = req.query.email;
        const result = await BookingRentalCart.find({ email }).exec();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a booking rental item
const addToBookingRentalCart = async (req, res) => {
    const { rentalItemId, name, category, description, image, price, quantity, email, rentalDays } = req.body;

    try {
        const existingRentalItem = await BookingRentalCart.findOne({ email, rentalItemId });
        if (existingRentalItem) {
            return res.status(400).json({ message: "Rental item already exists in the cart!" });
        }

        const rentalItem = await BookingRentalCart.create({
            rentalItemId,
            name,
            category,
            description,
            image,
            price,
            quantity,
            email,
            rentalDays,
        });
        res.status(201).json(rentalItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a booking rental item
const updateBookingRentalCart = async (req, res) => {
    const bookingRentalCartId = req.params.id;
    const { rentalItemId, name, category, description, image, price, quantity, email, rentalDays } = req.body;

    try {
        const updatedBookingRentalCart = await BookingRentalCart.findByIdAndUpdate(
            bookingRentalCartId,
            { rentalItemId, name, category, description, image, price, quantity, email, rentalDays },
            { new: true, runValidators: true }
        );
        if (!updatedBookingRentalCart) {
            return res.status(404).json({ message: "Rental item not found" });
        }
        res.status(200).json(updatedBookingRentalCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a booking rental item
const deleteBookingRentalCart = async (req, res) => {
    const bookingRentalCartId = req.params.id;
    try {
        const deletedBookingRentalCart = await BookingRentalCart.findByIdAndDelete(bookingRentalCartId);
        if (!deletedBookingRentalCart) {
            return res.status(404).json({ message: "Rental item not found" });
        }
        res.status(200).json({ message: "Rental item deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single booking rental item
const getSingleBookingRentalCart = async (req, res) => {
    const bookingRentalCartId = req.params.id;
    try {
        const rentalItem = await BookingRentalCart.findById(bookingRentalCartId);
        res.status(200).json(rentalItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBookingRentalCartByEmail,
    addToBookingRentalCart,
    updateBookingRentalCart,
    deleteBookingRentalCart,
    getSingleBookingRentalCart,
};
