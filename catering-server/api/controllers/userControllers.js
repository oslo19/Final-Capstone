const User = require("../models/User");
const OTP = require("../models/Otp")
const defaultCoordinates = [10.239613, 123.780381];
// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// post a new user
const createUser = async (req, res) => {
  const { firstName, lastName, email, photoURL } = req.body;
  const query = { email };

  try {
    const existingUser = await User.findOne(query);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      photoURL
    });

    const result = await newUser.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// delete a user
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    // if user not found
    if(!deletedUser){
        return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({message: "User deleted successfully!"})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get admin
const getAdmin = async (req, res) => {
    const email = req.params.email;
    const query = {email: email};
    try {
        const user = await User.findOne(query);
        // console.log(user)
        if(email !== req.decoded.email){
            return res.status(403).send({message: "Forbidden access"})
        }
        let admin = false;
        if(user ){
            admin = user?.role === "admin";
        }
        res.status(200).json({admin})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// make admin of a user
const makeAdmin = async (req, res) => {
    const userId = req.params.id;
    const {name, email, photoURL, role} = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {role: "admin"},
            {new: true, runValidators: true}
        );

        if(!updatedUser){
            return res.status(404).json({message: "User not found"})
        }
        res.status(200).json(updatedUser)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUserAddress = async (req, res) => {
  const userId = req.params.id;
  const { coordinates, address } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        address: address || "No address available", // Default address if missing
        coordinates: coordinates?.length === 2 ? coordinates : defaultCoordinates, // Use fallback coordinates if invalid
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserMobile = async (req, res) => {
  const userId = req.params.id;
  const { phone_number } = req.body; // Only expect the phone number

  try {
    // Update the user's mobile number in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { mobileNumber: phone_number },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Mobile number updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Error updating mobile number:", error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  getAdmin,
  makeAdmin,
  updateUserAddress,
  updateUserMobile
};
