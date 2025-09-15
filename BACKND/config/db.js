const mongoose = require('mongoose');                 // Bring in mongoose (a tool which is used to connect and work with MongoDB)

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);                                    // Try to connect to MongoDB using the MONGO_URI from .env file
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};


// Make this function available to other files
module.exports = connectDB;