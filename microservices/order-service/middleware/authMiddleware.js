const jwt = require("jsonwebtoken"); // Make sure to require the 'jsonwebtoken' library
const User = require("../models/User"); // Assuming you're importing the User model

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Split the string to get the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.user.id).select("-password");
      next(); // If everything is good, proceed to the next middleware
    } catch (error) {
      console.error("Token Verification failed:",error);
      res.status(401).json({message: "Not authorized, token fialed"});
    }
  }
  else
  {
    res.status(401).json({message: "Not authorized, no token provided"});
  }
};

// Middleware to check if the user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); 
  } else {
    res.status(403).json({ message: "Not authorized as an admin" }); 
  }
};


module.exports = { protect, admin } ;
