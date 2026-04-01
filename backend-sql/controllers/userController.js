const { sql } = require("../config/db");

// Get Users (Tenant Wise)
const getUsers = async (req, res) => {
  try {
    let result;

    // Super Admin → See All Users
    if (req.user.RoleName === "SuperAdmin") {
      result = await sql.query`
        SELECT 
          u.UserId,
          u.Name,
          u.Email,
          t.TenantName,
          STRING_AGG(r.RoleName, ', ') AS RoleName
        FROM Users u
        LEFT JOIN Tenants t ON u.TenantId = t.TenantId
        LEFT JOIN UserRoles ur ON u.UserId = ur.UserId
        LEFT JOIN Roles r ON ur.RoleId = r.RoleId
        GROUP BY u.UserId, u.Name, u.Email, t.TenantName
        ORDER BY u.UserId DESC
      `;
    } 
    // Tenant Users → Tenant Wise
    else {
      result = await sql.query`
        SELECT 
          u.UserId,
          u.Name,
          u.Email,
          t.TenantName,
          STRING_AGG(r.RoleName, ', ') AS RoleName
        FROM Users u
        LEFT JOIN Tenants t ON u.TenantId = t.TenantId
        LEFT JOIN UserRoles ur ON u.UserId = ur.UserId
        LEFT JOIN Roles r ON ur.RoleId = r.RoleId
        WHERE u.TenantId = ${req.tenantId}
        GROUP BY u.UserId, u.Name, u.Email, t.TenantName
        ORDER BY u.UserId DESC
      `;
    }

    res.json(result.recordset);

  } catch (err) {
    console.log("Get Users Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create User
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const tenantId = req.tenantId;

    // Insert User
    const result = await sql.query`
      INSERT INTO Users (Name, Email, Password, TenantId)
      OUTPUT INSERTED.UserId
      VALUES (${name}, ${email}, ${password}, ${tenantId})
    `;

    const userId = result.recordset[0].UserId;

    // Assign default role
    await sql.query`
      INSERT INTO UserRoles (UserId, RoleId)
      SELECT ${userId}, RoleId
      FROM Roles
      WHERE RoleName = 'User'
      AND TenantId = ${tenantId}
    `;

    res.json({ message: "User created successfully" });
  } catch (err) {
    console.log("Create User Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, tenantId } = req.body;

  try {
    await sql.query`
      UPDATE Users
      SET Name = ${name},
          Email = ${email},
          TenantId = ${tenantId || null}
      WHERE UserId = ${id}
    `;

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.log("Update User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const id = req.params.id;

  const transaction = new sql.Transaction();

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);

    await request.query(`
      DELETE FROM UserRoles WHERE UserId = ${id}
    `);

    await request.query(`
      DELETE FROM Users WHERE UserId = ${id}
    `);

    await transaction.commit();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    await transaction.rollback();
    console.log("Delete User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};