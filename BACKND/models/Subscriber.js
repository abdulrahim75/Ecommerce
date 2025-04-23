const mongoose = require('mongoose');

// Define the schema
const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Export the model
module.exports = Subscriber;
