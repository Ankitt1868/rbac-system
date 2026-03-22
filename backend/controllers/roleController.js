const Role = require("../models/Role");

// Create Role
const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const role = await Role.create({
      name,
      permissions,
    });

    res.status(201).json({
      message: "Role created",
      role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRole };