// models/User.js
const mongoose = require("mongoose");

const wpmSchema = new mongoose.Schema({
  wpm: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  wpmHistory: {
    type: [wpmSchema],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);

