const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");


// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

// Function to seed data
const seedData = async () => {
    try {
      // Clear existing data
      await Product.deleteMany();
      await User.deleteMany();
      await Cart.deleteMany();

  
      // Create a default admin User
      const createdUser = await User.create({
        name: "Admin User",
        email: "admin@example.com",  
        password: "123456",  
        role: "admin"
      });

      // Assuming 'createdUser.id' contains the default user ID
      const userID = createdUser._id; 
      const sampleProducts = products.map((product) => {
        return {...product, user: userID };
      });

      await Product.insertMany(sampleProducts);

      console.log("Product data seeded successfully!");
      process.exit();

    } catch (error) {
        console.error("Error seeding product data: ", error);
        process.exit(1);
    }
};

seedData();