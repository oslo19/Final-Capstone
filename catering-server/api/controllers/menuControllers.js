const Menu = require("../models/Menu");

const getAllMenuItems = async(req, res) => {
    try {
        const menus = await Menu.find({}).sort({createdAt: -1});
        res.status(200).json(menus)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// post a new menu item
const postMenuItem = async(req, res) => {
    const newItem = req.body;
    try {
        const result = await Menu.create(newItem);
        res.status(200).json(result)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// delete a menu item
const deleteMenuItem = async(req, res) => {
    const menuId = req.params.id;
    // console.log(menuId)
    try {
        const deletedItem = await Menu.findByIdAndDelete(menuId);

        // console.log(deletedItem);

        if(!deletedItem){
            return res.status(404).json({ message:"Menu not found"})
        }
        res.status(200).json({message: "Menu Item deleted successfully!"})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get single menu item
const singleMenuItem = async (req, res) => {
    const menuId = req.params.id;
    try {
        const menuItem = await Menu.findById(menuId);
        if(!menuItem){
            return res.status(404).json({ message: "Menu not found" });
        }
        res.status(200).json(menuItem)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update single menu item
const updateMenuItem = async (req, res) => {
    const menuId = req.params.id;
    const {menuItemId, name, recipe, image, category, quantity, price} = req.body;
    try {
        const updatedMenu = await Menu.findByIdAndUpdate(
            menuId, { menuItemId, name, recipe, image, category, quantity, price}, 
            {new: true, runValidators: true}
            );

        if(!updatedMenu) {
            return res.status(404).json({ message:"Menu not found"})
        }

        res.status(200).json(updatedMenu)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Reset quantity of a single menu item
const resetMenuItemQuantity = async (req, res) => {
    const menuId = req.params.id;
    try {
        // Update the quantity to 1
        const updatedMenu = await Menu.findByIdAndUpdate(
            menuId, { quantity: 1 }, 
            { new: true, runValidators: true }
        );

        if(!updatedMenu) {
            return res.status(404).json({ message: "Menu not found" });
        }

        res.status(200).json(updatedMenu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllMenuItems,
    postMenuItem, 
    deleteMenuItem,
    singleMenuItem,
    updateMenuItem,
    resetMenuItemQuantity

}