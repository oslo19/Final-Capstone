const Carts = require("../models/Carts");
const User = require("../models/User"); // Assuming you have a User model

// get carts using email
const getCartByEmail = async (req, res) => {
    try {
        const email = req.query.email;

        // Check if the user exists in the database
        const userExists = await User.findOne({ email });
        if (!userExists) {
            // If user doesn't exist, delete their cart items
            await Carts.deleteMany({ email });  // Delete all cart items for that email
            return res.status(404).json({ message: "User not found, cart items deleted." });
        }

        const query = { email: email };
        const result = await Carts.find(query).exec();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// post a cart when add-to-cart btn clicked 
const addToCart = async (req, res) => {
    const { menuItemId, name, recipe, image, price, quantity, email, isRental, days } = req.body;

    try {
        // Check if the user exists
        const userExists = await User.findOne({ email });
        if (!userExists) {
            // If user does not exist, delete their cart items
            await Carts.deleteMany({ email });  // Delete all cart items for that email
            return res.status(404).json({ message: "User not found, cart items deleted." });
        }

        // Check if the cart item already exists
        const existingCartItem = await Carts.findOne({ email, menuItemId });
        if (existingCartItem) {
            return res.status(400).json({ message: "Product already exists in the cart!" });
        }

        // Build the cart item
        const cartItemData = {
            menuItemId,
            name,
            recipe,
            image,
            price,
            quantity,
            email,
        };

        // If the item is a rental, set the isRental flag and days
        if (isRental) {
            cartItemData.isRental = true;
            cartItemData.days = days;  // Ensure 'days' is passed correctly
        }

        // Create the cart item
        const cartItem = await Carts.create(cartItemData);

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// delete a cart item
const deleteCart = async (req, res) => {
    const cartId = req.params.id;
    try {
        const deletedCart = await Carts.findByIdAndDelete(cartId);
        if (!deletedCart) {
            return res.status(404).json({ message: "Cart Item not found!" });
        }
        res.status(200).json({ message: "Cart Item Deleted Successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// update a cart item
const updateCart = async (req, res) => {
    const cartId = req.params.id;
    const { menuItemId, name, recipe, image, price, quantity, email } = req.body;

    try {
        const updatedCart = await Carts.findByIdAndUpdate(
            cartId, { menuItemId, name, recipe, image, price, quantity, email }, {
                new: true, runValidators: true
            }
        )
        if (!updatedCart) {
            return res.status(404).json({ message: "Cart Item not found" })
        }
        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get single recipe
const getSingleCart = async (req, res) => {
    const cartId = req.params.id;
    try {
        const cartItem = await Carts.findById(cartId)
        res.status(200).json(cartItem)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCartByEmail,
    addToCart,
    deleteCart,
    updateCart,
    getSingleCart,
};
