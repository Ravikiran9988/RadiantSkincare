const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  from: { type: String, required: true }, // sender email or ID
  to: { type: String, required: true },   // doctor name or ID
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", chatSchema);
