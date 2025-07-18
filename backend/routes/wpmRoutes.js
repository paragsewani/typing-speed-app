const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// Save new WPM, keep last 5
router.post("/save", auth, async (req, res) => {
  const userId = req.userId; // ✅ Use correct variable
  const { wpm } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.wpmHistory.push({ wpm });
    if (user.wpmHistory.length > 5)
      user.wpmHistory = user.wpmHistory.slice(-5);

    await user.save();
    res.json({ message: "WPM saved", wpmHistory: user.wpmHistory });
  } catch (err) {
    console.error("Save WPM Error:", err); // ✅ Debug line
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch latest WPMs
router.get("/latest", auth, async (req, res) => {
  const userId = req.userId; // ✅ Use correct variable

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.wpmHistory);
  } catch (err) {
    console.error("Fetch WPM Error:", err); // ✅ Debug line
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
