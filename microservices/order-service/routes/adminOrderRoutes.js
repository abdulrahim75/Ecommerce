const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
// const { protect, admin } = require("../middleware/authMiddleware"); // <-- REMOVED this line

// @route   GET /api/admin/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get("/", async (req, res) => { // <-- REMOVED 'protect' and 'admin'
    try {
        // REMOVED .populate("user", "name email")
        // The Order service only returns order data. The frontend will need to fetch user details separately.
        const orders = await Order.find({});
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


// @route   PUT /api/admin/orders/:id
// @desc    Update order status
// @access  Private/Admin
router.put("/:id", async (req, res) => { // <-- REMOVED 'protect' and 'admin'
    try {
        // REMOVED .populate("user", "name email")
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;

            if (req.body.status === "Delivered") {
                order.isDelivered =
                    req.body.status === "Delivered" ? true : order.isDelivered;
                order.deliveredAt =
                    req.body.status === "Delivered" ? Date.now() : order.deliveredAt;
            }
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// @route   DELETE /api/admin/orders/:id
// @desc    Delete an order
// @access  Private/Admin
router.delete("/:id", async (req, res) => { // <-- REMOVED 'protect' and 'admin'
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await order.deleteOne();
            res.json({ message: "Order removed" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
module.exports = router;