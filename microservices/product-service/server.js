const express = require("express"); // For making the backend server
const cors = require("cors"); // To allow frontend to talk to backend
const dotenv = require("dotenv"); // To load .env variables
const connectDB = require("./config/db"); // Function to connect to MongoDB

// Importing only the routes this service needs
const productRoutes = require("./routes/productRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");

// Create an Express app
const app = express();

require("dotenv").config();

app.use(express.json());       // Let backend understand JSON data from frontend

// Allow only our frontend URLs to send requests
const allowedOrigins = [
  "http://localhost:5173",
  "https://ecommerce-m4x.vercel.app",
];
app.use(cors({
  origin: allowedOrigins
}))

dotenv.config();

const PORT = process.env.PORT || 3000;       // Port number (from .env or 3000 if not found)

//Connect to Database
connectDB();

// ==========================================================
// --- FIX: Define main API routes BEFORE the generic one ---
// ==========================================================
app.use(productRoutes);
app.use(productAdminRoutes);


// Defining a route for health check (this should come after main routes)
app.get("/", (req, res) => {
  res.send("Welcome to the Product Service!!");
});


// Start the server
app.listen(PORT, () => {
  console.log(`Product Service is running on http://localhost:${PORT}`);
});