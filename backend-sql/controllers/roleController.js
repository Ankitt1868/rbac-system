const { sql } = require("../config/db");

exports.createRole = async (req, res) => {
  try {
    const { roleName } = req.body;

    await sql.query`
      INSERT INTO Roles (RoleName)
      VALUES (${roleName})
    `;

    res.json({ message: "Role created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    await sql.query`
      INSERT INTO UserRoles (UserId, RoleId)
      VALUES (${userId}, ${roleId})
    `;

    res.json({ message: "Role assigned successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};