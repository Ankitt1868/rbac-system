// const { sql } = require("../config/db");
// const jwt = require("jsonwebtoken");

// // Register Tenant + Admin User
// const registerTenant = async (req, res) => {
//   const { tenantName, subdomain, adminName, email, password } = req.body;

//   try {
//     // Create Tenant
//     const tenantResult = await sql.query`
//       INSERT INTO Tenants (TenantName, Subdomain)
//       OUTPUT INSERTED.TenantId
//       VALUES (${tenantName}, ${subdomain})
//     `;

//     const tenantId = tenantResult.recordset[0].TenantId;

//     // Create Admin User
//     const userResult = await sql.query`
//       INSERT INTO Users (Name, Email, Password, TenantId)
//       OUTPUT INSERTED.UserId
//       VALUES (${adminName}, ${email}, ${password}, ${tenantId})
//     `;

//     const userId = userResult.recordset[0].UserId;

//     // Create default roles for this tenant
//     await sql.query`
//       INSERT INTO Roles (RoleName, TenantId) VALUES ('Admin', ${tenantId});
//       INSERT INTO Roles (RoleName, TenantId) VALUES ('Manager', ${tenantId});
//       INSERT INTO Roles (RoleName, TenantId) VALUES ('User', ${tenantId});
//     `;

//     // Assign Admin Role to Admin User
//     await sql.query`
//       INSERT INTO UserRoles (UserId, RoleId)
//       SELECT ${userId}, RoleId
//       FROM Roles
//       WHERE RoleName = 'Admin'
//       AND TenantId = ${tenantId}
//     `;

//     res.json({
//       message: "Tenant registered successfully",
//       tenantId,
//       userId,
//     });
//   } catch (err) {
//     console.log("Register Tenant Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// // Login User
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // User + Role + Tenant
//     const result = await sql.query`
//   SELECT TOP 1
//     u.UserId,
//     u.Name,
//     u.Email,
//     u.Password,
//     u.TenantId,
//     r.RoleId,
//     r.RoleName,
//     t.TenantName
//   FROM Users u
//   JOIN UserRoles ur ON u.UserId = ur.UserId
//   JOIN Roles r ON ur.RoleId = r.RoleId
//   LEFT JOIN Tenants t ON u.TenantId = t.TenantId
//   WHERE u.Email = ${email}
//   ORDER BY 
//     CASE 
//       WHEN r.RoleName = 'SuperAdmin' THEN 1
//       WHEN r.RoleName = 'Admin' THEN 2
//       WHEN r.RoleName = 'User' THEN 3
//       ELSE 4
//     END
// `;

//     if (result.recordset.length === 0) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const user = result.recordset[0];

//     if (user.Password !== password) {
//       return res.status(400).json({ message: "Invalid password" });
//     }
//     // Get Permissions
//     const permissionResult = await sql.query`
//       SELECT p.PermissionName
//       FROM RolePermissions rp
//       JOIN Permissions p ON rp.PermissionId = p.PermissionId
//       WHERE rp.RoleId = ${user.RoleId}
//     `;

//     const permissions = permissionResult.recordset.map(
//       (p) => p.PermissionName
//     );

//     // Generate JWT Token
//     const token = jwt.sign(
//       {
//         userId: user.UserId,
//         tenantId: user.TenantId,
//         role: user.RoleName,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // IMPORTANT → TenantId return karna zaroori
//     res.json({
//       message: "Login successful",
//       token: token,
//       user: {
//         UserId: user.UserId,
//         Name: user.Name,
//         Email: user.Email,
//         RoleName: user.RoleName,
//         TenantId: user.TenantId,
//         TenantName: user.TenantName,
//       },
//       permissions: permissions,
//     });
//   } catch (err) {
//     console.log("Login Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   registerTenant,
//   login,
// };



const pool = require("../config/db");
const jwt = require("jsonwebtoken");

// Register Tenant + Admin User
const registerTenant = async (req, res) => {
  const { tenantName, subdomain, adminName, email, password } = req.body;

  try {
    // Create Tenant
    const tenantResult = await pool.query(
      `INSERT INTO Tenants (TenantName, Subdomain)
       VALUES ($1, $2)
       RETURNING TenantId`,
      [tenantName, subdomain]
    );

    const tenantId = tenantResult.rows[0].tenantid;

    // Create Admin User
    const userResult = await pool.query(
      `INSERT INTO Users (Name, Email, Password, TenantId)
       VALUES ($1, $2, $3, $4)
       RETURNING UserId`,
      [adminName, email, password, tenantId]
    );

    const userId = userResult.rows[0].userid;

    // Create default roles for this tenant
    await pool.query(
      `INSERT INTO Roles (RoleName, TenantId) VALUES
       ('Admin', $1),
       ('Manager', $1),
       ('User', $1)`,
      [tenantId]
    );

    // Assign Admin Role to Admin User
    await pool.query(
      `INSERT INTO UserRoles (UserId, RoleId)
       SELECT $1, RoleId
       FROM Roles
       WHERE RoleName = 'Admin'
       AND TenantId = $2`,
      [userId, tenantId]
    );

    res.json({
      message: "Tenant registered successfully",
      tenantId,
      userId,
    });
  } catch (err) {
    console.log("Register Tenant Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // User + Role + Tenant
    const result = await pool.query(`
SELECT 
  u.userid,
  u.name,
  u.email,
  u.password,
  u.tenantid,
  r.roleid,
  r.rolename,
  t.tenantname
FROM users u
JOIN userroles ur ON u.userid = ur.userid
JOIN roles r ON ur.roleid = r.roleid
LEFT JOIN tenants t ON u.tenantid = t.tenantid
WHERE u.email = $1
LIMIT 1
`, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Get Permissions
    const permissionResult = await pool.query(`
SELECT p.permissionname
FROM rolepermissions rp
JOIN permissions p ON rp.permissionid = p.permissionid
WHERE rp.roleid = $1
`, [user.roleid]);

    const permissions = permissionResult.rows.map(
      (p) => p.permissionname
    );

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user.userid,
        tenantId: user.tenantid,
        role: user.rolename,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        UserId: user.userid,
        Name: user.name,
        Email: user.email,
        RoleName: user.rolename,
        TenantId: user.tenantid,
        TenantName: user.tenantname,
      },
      permissions: permissions,
    });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerTenant,
  login,
};