const WPMRecord = require("../models/WPMRecord");

exports.saveWPM = async (req, res) => {
  const { wpm } = req.body;
  const userId = req.userId;

  // Save new WPM record
  await WPMRecord.create({ userId, wpm });

  // Count how many WPM records the user has
  const count = await WPMRecord.countDocuments({ userId });

  // If more than 5, delete the oldest ones
  if (count > 5) {
    const oldest = await WPMRecord.find({ userId })
      .sort({ timestamp: 1 }) // oldest first
      .limit(count - 5); // get the extra ones
    const idsToDelete = oldest.map((r) => r._id);
    await WPMRecord.deleteMany({ _id: { $in: idsToDelete } });
  }

  res.status(201).json({ message: "WPM saved" });
};

exports.getLastFiveWPM = async (req, res) => {
  const records = await WPMRecord.find({ userId: req.userId })
    .sort({ timestamp: 1 }); // oldest to newest = Test 1 to Test 5
  res.json(records);
};
