const { sql } = require("../config/db");

// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT UserId, Name, Email, TenantId
      FROM Users
    `;

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, tenantId } = req.body;

    await sql.query`
      INSERT INTO Users (Name, Email, Password, TenantId)
      VALUES (${name}, ${email}, ${password}, ${tenantId})
    `;

    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};