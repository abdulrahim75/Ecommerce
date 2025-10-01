const express = require("express"); // For making the backend server
const cors = require("cors"); // To allow frontend to talk to backend
const dotenv = require("dotenv"); // To load .env variables
const connectDB = require("./config/db"); // Function to connect to MongoDB

// --- Importing only the routes this service needs ---
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

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

// --- Remember to set PORT=8002 in your .env file for this service ---
const PORT = process.env.PORT || 3000;       // Port number (from .env or 3000 if not found)

//Connect to Database
connectDB();

// Defining a route for health check
app.get("/", (req, res) => {
  res.send("Welcome to the User Service!!");
});

// --- I have removed the chatbot routes ---

// --- Using only the API Routes for users ---
// AFTER
app.use(userRoutes);
app.use(adminRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`User Service is running on http://localhost:${PORT}`);
});