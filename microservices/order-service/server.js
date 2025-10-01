const express = require("express"); // For making the backend server
const cors = require("cors"); // To allow frontend to talk to backend
const dotenv = require("dotenv"); // To load .env variables
const connectDB = require("./config/db"); // Function to connect to MongoDB

// --- Importing only the routes this service needs ---
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

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

// --- Remember to set PORT=8003 in your .env file for this service ---
const PORT = process.env.PORT || 3000;       // Port number (from .env or 3000 if not found)

//Connect to Database
connectDB();

// Defining a route for health check
app.get("/", (req, res) => {
  res.send("Welcome to the Order Service!!");
});

// --- I have removed the chatbot routes ---


app.use(cartRoutes);
app.use(orderRoutes);
app.use(adminOrderRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Order Service is running on http://localhost:${PORT}`);
});