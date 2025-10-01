const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {protect} = require("../middleware/authMiddleware")

const router = express.Router();                  // Create a router object to hold all user-related routes

// ---------------- REGISTER NEW USER ----------------


// @route POST /api/users/register
// @desc Register a new user
// @access Public   ----  Anyone can use this route (Public)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
                                                                                                            //async == This function will run in the background and not block other code from running
  // Check if all fields are filled
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
     // Check if the user already exists
     let user = await User.findOne({ email });

     if (user) 
       return res.status(400).json({ message: "User already exists" });
 
     // Create a new user
     user = new User({
       name,
       email,
       password,
     });
 
     // Save the user to the database
     await user.save();

     // Send user details + token back to frontend
     const payload = {user: {id: user._id, role: user.role} };
     jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "40h"}, (err, token) => {
      if(err) throw err;
      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      })
     });
   } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});


// ---------------- LOGIN USER ----------------

// @route POST /api/users/login
//@desc Authenticate user
// @access Public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Check if the password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    // Create data for JWT token
    const payload = {user: {id: user._id, role: user.role} };
    // Create JWT token valid for 40 hours
    jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "40h"}, (err, token) => {
     if(err) throw err;
     // Send user details + token back to frontend
     res.json({
       user: {
         _id: user._id,
         name: user.name,
         email: user.email,
         role: user.role,
       },
       token,
     })
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


// ---------------- GET USER PROFILE ----------------


// @route GET /api/users/profile
// @desc Get logged-in user's profile
// @access Private  -- This route is private (only logged-in users can see it)
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;