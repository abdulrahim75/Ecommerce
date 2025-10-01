const mongoose = require("mongoose");
// const User = require("./User"); // <-- REMOVED THIS LINE

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // This 'ref' is just a string, so it doesn't need the Product model to be imported
    required: true
  },
  name: String,
  image: String,
  price: String,
  size: String,
  color: String,
  quantity: {
    type: Number,
    default: 1
  },
},
  { _id: false }
);

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This is okay, it's just a reference for Mongoose
  },
  guestId: {
    type: String,
  },
  products: [cartItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
},
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);