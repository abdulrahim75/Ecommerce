const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

app.use('/api/cart', (req, res, next) => {
  console.log('Received request for /api/cart', req.method, req.url);
  next(); // pass to proxy
});

// --- Routes for User Service (Port 8002) ---
app.use('/api/users', proxy('http://localhost:8002'));
app.use('/api/admin/users', proxy('http://localhost:8002'));

// --- Routes for Product Service (Port 8001) ---
app.use('/api/products', proxy('http://localhost:8001'));
app.use('/api/admin/products', proxy('http://localhost:8001'));

// ==========================================================
// --- ADD THESE NEW ROUTES for Order Service (Port 8003) ---
// ==========================================================
app.use('/api/cart', proxy('http://localhost:8003'));
app.use('/api/checkout', proxy('http://localhost:8003'));
app.use('/api/orders', proxy('http://localhost:8003'));
app.use('/api/admin/orders', proxy('http://localhost:8003'));


// A simple welcome message for the gateway's root
app.get('/', (req, res) => {
    res.send("API Gateway is running.");
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
});