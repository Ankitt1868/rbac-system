// const { sql } = require("../config/db");
// const jwt = require("jsonwebtoken");

// // Register Tenant + Admin
// const registerTenant = async (req, res) => {
//   const { tenantName, subdomain, adminName, email, password } = req.body;

//   try {
//     // Insert Tenant
//     const tenantResult = await sql.query`
//       INSERT INTO Tenants (TenantName, Subdomain)
//       OUTPUT INSERTED.TenantId
//       VALUES (${tenantName}, ${subdomain})
//     `;

//     const tenantId = tenantResult.recordset[0].TenantId;

//     // Insert Admin User
//     const userResult = await sql.query`
//       INSERT INTO Users (Name, Email, Password, TenantId)
//       OUTPUT INSERTED.UserId
//       VALUES (${adminName}, ${email}, ${password}, ${tenantId})
//     `;

//     const userId = userResult.recordset[0].UserId;

//     // Assign Admin Role
//     await sql.query`
//       INSERT INTO UserRoles (UserId, RoleId)
//       SELECT ${userId}, RoleId
//       FROM Roles
//       WHERE RoleName = 'Admin'
//     `;

//     res.json({
//       message: "Tenant registered successfully",
//       tenantId: tenantId
//     });

//   } catch (err) {
//     console.log("Register Tenant Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };


// // Get All Tenants (Super Admin)
// const getTenants = async (req, res) => {
//   try {
//     const result = await sql.query`
//       SELECT TenantId, TenantName, Subdomain, CreatedAt
//       FROM Tenants
//       ORDER BY TenantId DESC
//     `;

//     res.json(result.recordset);
//   } catch (err) {
//     console.log("Get Tenants Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // Delete Tenant
// const deleteTenant = async (req, res) => {
//   const id = req.params.id;

//   try {
//     await sql.query`
//       DELETE FROM UserRoles
//       WHERE UserId IN (SELECT UserId FROM Users WHERE TenantId = ${id})
//     `;

//     await sql.query`
//       DELETE FROM Users WHERE TenantId = ${id}
//     `;

//     await sql.query`
//       DELETE FROM Tenants WHERE TenantId = ${id}
//     `;

//     res.json({ message: "Tenant deleted successfully" });
//   } catch (err) {
//     console.log("Delete Tenant Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // Switch Tenant (Super Admin)
// const switchTenant = async (req, res) => {
//   const { tenantId } = req.body;

//   try {
//     // Check tenant exists
//     const result = await sql.query`
//       SELECT TenantId, TenantName
//       FROM Tenants
//       WHERE TenantId = ${tenantId}
//     `;

//     if (result.recordset.length === 0) {
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     // Generate new JWT with tenantId
//     const token = jwt.sign(
//       {
//         userId: req.user.UserId,
//         tenantId: tenantId,
//         role: req.user.RoleName
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({
//       message: "Tenant switched successfully",
//       token: token,
//       tenant: result.recordset[0]
//     });

//   } catch (err) {
//     console.log("Switch Tenant Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   registerTenant,
//   getTenants,
//   deleteTenant,
//   switchTenant
// };


// PostgreSQL Converted File (tenantController.js)

const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// Register Tenant + Admin
const registerTenant = async (req, res) => {
  const { tenantName, subdomain, adminName, email, password } = req.body;

  try {
    // Insert Tenant
    const tenantResult = await pool.query(
      `INSERT INTO Tenants (TenantName, Subdomain)
       VALUES ($1, $2)
       RETURNING TenantId`,
      [tenantName, subdomain]
    );

    const tenantId = tenantResult.rows[0].tenantid;

    // Insert Admin User
    const userResult = await pool.query(
      `INSERT INTO Users (Name, Email, Password, TenantId)
       VALUES ($1, $2, $3, $4)
       RETURNING UserId`,
      [adminName, email, password, tenantId]
    );

    const userId = userResult.rows[0].userid;

    // Assign Admin Role
    await pool.query(
      `INSERT INTO UserRoles (UserId, RoleId)
       SELECT $1, RoleId
       FROM Roles
       WHERE RoleName = 'Admin'`,
      [userId]
    );

    res.json({
      message: "Tenant registered successfully",
      tenantId: tenantId
    });

  } catch (err) {
    console.log("Register Tenant Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get All Tenants (Super Admin)
const getTenants = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT TenantId, TenantName, Subdomain, CreatedAt
       FROM Tenants
       ORDER BY TenantId DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.log("Get Tenants Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete Tenant
const deleteTenant = async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query(
      `DELETE FROM UserRoles
       WHERE UserId IN (SELECT UserId FROM Users WHERE TenantId = $1)`,
      [id]
    );

    await pool.query(
      `DELETE FROM Users WHERE TenantId = $1`,
      [id]
    );

    await pool.query(
      `DELETE FROM Tenants WHERE TenantId = $1`,
      [id]
    );

    res.json({ message: "Tenant deleted successfully" });
  } catch (err) {
    console.log("Delete Tenant Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Switch Tenant (Super Admin)
const switchTenant = async (req, res) => {
  const { tenantId } = req.body;

  try {
    // Check tenant exists
    const result = await pool.query(
      `SELECT TenantId, TenantName
       FROM Tenants
       WHERE TenantId = $1`,
      [tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Generate new JWT with tenantId
    const token = jwt.sign(
      {
        userId: req.user.UserId,
        tenantId: tenantId,
        role: req.user.RoleName
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Tenant switched successfully",
      token: token,
      tenant: result.rows[0]
    });

  } catch (err) {
    console.log("Switch Tenant Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerTenant,
  getTenants,
  deleteTenant,
  switchTenant
};