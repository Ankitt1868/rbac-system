const { sql } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Tenant Register
exports.registerTenant = async (req, res) => {
  try {
    const { tenantName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql.query`
      INSERT INTO Tenants (TenantName, Email, Password)
      VALUES (${tenantName}, ${email}, ${hashedPassword})
    `;

    res.json({ message: "Tenant registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login API
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await sql.query`
      SELECT * FROM Users WHERE Email = ${email}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.UserId },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};