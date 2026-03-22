const User = require("../models/User");

// Assign Role to User
const assignRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = roleId;
    await user.save();

    res.json({
      message: "Role assigned successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { assignRole };