const express = require("express");
const Cart = require("../models/Cart");
const axios = require("axios"); // <-- ADDED axios to make API calls

// const Product = require("../models/Product"); // <-- REMOVED this direct dependency
// const { protect } = require("../middleware/authMiddleware"); // <-- REMOVED this, auth will be handled differently

const router = express.Router();

// Helper function to get a cart by userId or guestId
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};


// ======================================
// 🛒 ADD ITEM TO CART
// ======================================
router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    

    try {
        // =================================================================
        // THE MAGIC HAPPENS HERE: We are replacing the database call with an API call
        // =================================================================

        // BEFORE: const product = await Product.findById(productId);
        // NOW:
        // AFTER
        const response = await axios.get(`http://localhost:8001/${productId}`);
        const product = response.data;
        // console.log("1. [CART SERVICE] Fetched product data:", product);

        // The 'product' variable now holds the data sent back from our Product Service!
        // =================================================================

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Determine if user is logged in or guest
        let cart = await getCart(userId, guestId);

        //If cart exists update it
        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                // If product already exists , update the quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // add it as a new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity
                });
            }
            // Recalculate the totalPrice of the cart
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            //creating a new cart for the user (or guest) if the cart doesn"t exist
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? "guest_" + new Date().getTime() : undefined,
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity,
                    },
                ],

                totalPrice: product.price * quantity,
            });

            return res.status(201).json(newCart);
        }
    } catch (error) {
        // If the error is from Axios (product not found), send a 404
        console.log("2. [CART SERVICE] Error occurred:", error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: "Product not found" });
        }
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// ======================================
// ✏️ UPDATE QUANTITY IN CART (No changes needed here as it doesn't fetch product data)
// ======================================
router.put("/", async (req, res) => {
    // ... same code as before ...
    console.log("3. [BACKEND] Received request body:", req.body);
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1);
            }
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart " });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// ======================================
// ❌ REMOVE ITEM FROM CART (No changes needed here)
// ======================================
router.delete("/", async (req, res) => {
    // ... same code as before ...
    const { productId, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart " });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});


// ======================================
// 🛒 GET CART DETAILS (No changes needed here)
// ======================================
router.get("/", async (req, res) => {
    // ... same code as before ...
    const { userId, guestId } = req.query;
    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// ======================================
//  MERGE CARTS
// ======================================
router.post("/merge", async (req, res) => { // <-- REMOVED 'protect'
    const { guestId, userId } = req.body; // <-- ADDED userId to the body for this route

    try {
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: userId }); // <-- CHANGED from req.user._id to userId

        if (guestCart) {
            if (guestCart.products.length === 0) {
                // It's okay if the guest cart is empty, we can just delete it and send the user cart.
                await Cart.findOneAndDelete({ guestId });
                return res.status(200).json(userCart || { products: [] });
            }
        } else {
            // No guest cart to merge
            return res.status(200).json(userCart || { products: [] });
        }

        if (userCart) {
            guestCart.products.forEach((guestItem) => {
                const productIndex = userCart.products.findIndex(
                    (item) =>
                        item.productId.toString() === guestItem.productId.toString() &&
                        item.size === guestItem.size &&
                        item.color === guestItem.color
                );
                if (productIndex > -1) {
                    userCart.products[productIndex].quantity += guestItem.quantity;
                } else {
                    userCart.products.push(guestItem);
                }
            });
            userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await userCart.save();
            await Cart.findOneAndDelete({ guestId });
            return res.status(200).json(userCart);
        } else {
            // No user cart, so we assign the guest cart to the user.
            guestCart.user = userId;
            guestCart.guestId = undefined;
            await guestCart.save();
            return res.status(200).json(guestCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;