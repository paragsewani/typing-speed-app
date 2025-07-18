const mongoose = require("mongoose");

const wpmSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  wpm: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WPMRecord", wpmSchema);
