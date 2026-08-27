const User = require("../models/User");

// Returns every user except the logged-in user.
exports.getChatUsers = async (req, res) => {
  try {
    const currentUserId=req.userId || req.user?.id;
    const users = await User.find({ _id: { $ne: currentUserId} })
      .select("-password")
      .sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
