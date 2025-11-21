const express = require("express"); // For making the backend server
const promClient = require('prom-client'); // For Prometheus metrics
const cors = require("cors"); // To allow frontend to talk to backend
const dotenv = require("dotenv"); // To load .env variables
const connectDB = require("./config/db"); // Function to connect to MongoDB
// Importing routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscribeRoutes = require("./routes/subscribeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const { callAgent } = require('./agent');
const { MongoClient } = require('mongodb')

// Create an Express app
const app = express();

require("dotenv").config();

app.use(express.json());         // Let backend understand JSON data from frontend

// Allow only our frontend URLs to send requests
const allowedOrigins = [
  "http://localhost:5173",
  "https://ecommerce-m4x.vercel.app",
];
app.use(cors({
  origin:allowedOrigins
}))

dotenv.config();

// const PORT = process.env.PORT || 3000;       // Port number (from .env or 3000 if not found)
const PORT = process.env.PORT || 5000;       // Port number (from .env or 3000 if not found)
//Connect to Database
connectDB();

const client = new MongoClient(process.env.MONGO_URI);

// --- START: PROMETHEUS & GRAFANA MONITORING SETUP ---

// 2. Create a Registry to register the metrics
const register = new promClient.Registry();
register.setDefaultLabels({
  app: 'ecommerce-backend'
});
promClient.collectDefaultMetrics({ register });

// 3. Create a custom metric to count HTTP requests
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestCounter);

// 4. Add middleware to count requests - THIS MUST BE BEFORE YOUR API ROUTES
app.use((req, res, next) => {
    res.on('finish', () => {
        // Exclude the /metrics endpoint itself from being counted
        if (req.path !== '/metrics') {
            httpRequestCounter.inc({
                method: req.method,
                route: req.route ? req.route.path : req.path, // Use req.route.path if available
                status_code: res.statusCode
            });
        }
    });
    next();
});

// 5. Add the /metrics endpoint to expose the data
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// --- END: PROMETHEUS & GRAFANA MONITORING SETUP ---

// Defining a route   example
app.get("/", (req, res) => {
  res.send("Welcome to ECXM!!");
});

// Chatbot Route - Handle ChatBot requests
app.post('/chat', async (req, res) => {
  const initialMessage = req.body.message;
  const threadId = Date.now().toString();
  console.log(initialMessage);
  
  try {
    const response = await callAgent(client, initialMessage, threadId);
    res.json({ threadId, response });
  } catch (error) {
    console.error("Error Starting Conversation..", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post("/chat/:threadId", async(req, res) => {
  const {threadId } = req.params
  const { message } = req.body
  try {
    const response = await callAgent(client, message, threadId)
    res.json({ response })
  } catch (error) {
    console.error("Error in chat:",error)
    res.status(500).json({ error: 'Internal Server Error'});
  }
})

//API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/", subscribeRoutes);

// Admin routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
