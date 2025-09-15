const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();    //Create a router object 

// ------------------ GET ALL PRODUCTS (ADMIN) ------------------
// @route   GET /api/admin/products
// @desc    Get all products (Admin only)
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    // Fetch all products from MongoDB
    const products = await Product.find({});

    // Send products as JSON response
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
