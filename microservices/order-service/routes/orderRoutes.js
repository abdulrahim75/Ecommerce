const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");


// ------------------ GET A USER'S ORDERS ------------------
// @route   GET /api/orders/my-orders?userId=...
// @desc    Get a specific user's orders by their ID
// @access  Public (Security handled by API Gateway)
router.get("/my-orders/:id", async (req, res) => { // <-- REMOVED 'protect'
    try {
        // In a microservice, the service needs to be told which user's orders to get.
        // We get the userId from a query parameter instead of req.user.
        // console.log("Fetching orders for user ID:", req.params.id);
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find orders for the specified user, sorted by most recent
        const orders = await Order.find({ user: userId }).sort({
            createdAt: -1,
        });
        console.log("Orders found:", orders.length);

        res.json(orders); // Send the orders as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


// @route   POST /orders/verify-payment
// @desc    Verify Razorpay payment and update order status
// @access  Private
// @route   POST /orders/verify-payment
// @desc    Verify Razorpay payment and update order status
// @access  Private
router.post("/verify-payment", async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            my_db_order_id // <-- This must be sent from frontend!
        } = req.body;

        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest("hex");

        if (digest === razorpay_signature) {
            // ✅ Payment is legitimate
            const order = await Order.findById(my_db_order_id);

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentStatus = "paid";
            // Optional: Store Razorpay payment ID for reference
            // order.razorpayPaymentId = razorpay_payment_id; // You'll need to add this field to your schema if you want to store it

            await order.save();

            res.json({
                status: "success",
                message: "Payment verified and order updated",
                orderId: my_db_order_id,
                paymentId: razorpay_payment_id,
            });
        } else {
            res.status(400).json({ status: "failure", message: "Payment verification failed" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Server Error" });
    }
});


// @route   POST /orders/create-razorpay-order
// @desc    Create a Razorpay order
// @access  Private
router.post("/create-razorpay-order", async (req, res) => {
    
    try {
       
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        
        const options = {
            amount:Math.round(req.body.amount * 100), // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
        };
         console.log("No issues");
        const order = await instance.orders.create(options);

        if (!order) {
            return res.status(500).send("Some error occurred");
        }

        res.json(order);
    } catch (error) {

        res.status(500).send(error.message);
    }
});


// ------------------ GET A SINGLE ORDER BY ID ------------------
// @route   GET /api/orders/:id
// @desc    Get specific order details by ID
// @access  Public (Security handled by API Gateway)
router.get("/:id", async (req, res) => { // <-- REMOVED 'protect'
    try {
        // In a microservice, this service can't "populate" user data from another database.
        // It just returns the order data it owns, including the user's ID.
        
        const order = await Order.findById(req.params.id); // <-- REMOVED .populate("user", "name email")

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Add this inside orderRoutes.js

// @route   POST /orders/checkout
// @desc    Create a new order from the checkout
// @access  Private
router.post("/checkout", async (req, res) => {
    console.log(req.body);
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            user, // The frontend should send the user ID
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        const order = new Order({
            user,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;