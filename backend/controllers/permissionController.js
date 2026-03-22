const Permission = require("../models/Permission");

// Create Permission
const createPermission = async (req, res) => {
  try {
    const { name } = req.body;

    const permission = await Permission.create({ name });

    res.status(201).json({
      message: "Permission created",
      permission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPermission };