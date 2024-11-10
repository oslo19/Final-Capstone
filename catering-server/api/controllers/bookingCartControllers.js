const BookingCart = require("../models/BookingCart");

// Get booking carts by email
const getBookingCartByEmail = async (req, res) => {
    try {
        const email = req.query.email;
        const query = { email: email };
        const result = await BookingCart.find(query).exec();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a booking item
const addToBookingCart = async (req, res) => {
    const { bookingItemId, name, description, image, price, quantity, email, isRental, days } = req.body;

    try {
        // Check if the booking item already exists
        const existingBookingItem = await BookingCart.findOne({ email, bookingItemId });
        if (existingBookingItem) {
            return res.status(400).json({ message: "Booking item already exists in the cart!" });
        }

        const bookingItemData = {
            bookingItemId,
            name,
            description,
            image,
            price,
            quantity,
            email,
        };

        if (isRental) {
            bookingItemData.isRental = true;
            bookingItemData.days = days;
        }

        const bookingItem = await BookingCart.create(bookingItemData);
        res.status(201).json(bookingItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a booking item
const updateBookingCart = async (req, res) => {
    const bookingCartId = req.params.id;
    const { bookingItemId, name, description, image, price, quantity, email } = req.body;

    try {
        const updatedBookingCart = await BookingCart.findByIdAndUpdate(
            bookingCartId,
            { bookingItemId, name, description, image, price, quantity, email  },
            { new: true, runValidators: true }
        );
        if (!updatedBookingCart) {
            return res.status(404).json({ message: "Booking item not found" });
        }
        res.status(200).json(updatedBookingCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a booking item
const deleteBookingCart = async (req, res) => {
    const bookingCartId = req.params.id;
    try {
        const deletedBookingCart = await BookingCart.findByIdAndDelete(bookingCartId);
        if (!deletedBookingCart) {
            return res.status(404).json({ message: "Booking item not found" });
        }
        res.status(200).json({ message: "Booking item deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single booking item
const getSingleBookingCart = async (req, res) => {
    const bookingCartId = req.params.id;
    try {
        const bookingItem = await BookingCart.findById(bookingCartId);
        res.status(200).json(bookingItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBookingCartByEmail,
    addToBookingCart,
    updateBookingCart,
    deleteBookingCart,
    getSingleBookingCart
};
