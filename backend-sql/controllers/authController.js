const { sql } = require("../config/db");
const jwt = require("jsonwebtoken");

// Register Tenant + Admin User
const registerTenant = async (req, res) => {
  const { tenantName, subdomain, adminName, email, password } = req.body;

  try {
    // Create Tenant
    const tenantResult = await sql.query`
      INSERT INTO Tenants (TenantName, Subdomain)
      OUTPUT INSERTED.TenantId
      VALUES (${tenantName}, ${subdomain})
    `;

    const tenantId = tenantResult.recordset[0].TenantId;

    // Create Admin User
    const userResult = await sql.query`
      INSERT INTO Users (Name, Email, Password, TenantId)
      OUTPUT INSERTED.UserId
      VALUES (${adminName}, ${email}, ${password}, ${tenantId})
    `;

    const userId = userResult.recordset[0].UserId;

    // Create default roles for this tenant
    await sql.query`
      INSERT INTO Roles (RoleName, TenantId) VALUES ('Admin', ${tenantId});
      INSERT INTO Roles (RoleName, TenantId) VALUES ('Manager', ${tenantId});
      INSERT INTO Roles (RoleName, TenantId) VALUES ('User', ${tenantId});
    `;

    // Assign Admin Role to Admin User
    await sql.query`
      INSERT INTO UserRoles (UserId, RoleId)
      SELECT ${userId}, RoleId
      FROM Roles
      WHERE RoleName = 'Admin'
      AND TenantId = ${tenantId}
    `;

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
    const result = await sql.query`
  SELECT TOP 1
    u.UserId,
    u.Name,
    u.Email,
    u.Password,
    u.TenantId,
    r.RoleId,
    r.RoleName,
    t.TenantName
  FROM Users u
  JOIN UserRoles ur ON u.UserId = ur.UserId
  JOIN Roles r ON ur.RoleId = r.RoleId
  LEFT JOIN Tenants t ON u.TenantId = t.TenantId
  WHERE u.Email = ${email}
  ORDER BY 
    CASE 
      WHEN r.RoleName = 'SuperAdmin' THEN 1
      WHEN r.RoleName = 'Admin' THEN 2
      WHEN r.RoleName = 'User' THEN 3
      ELSE 4
    END
`;

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.recordset[0];

    if (user.Password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }
    // Get Permissions
    const permissionResult = await sql.query`
      SELECT p.PermissionName
      FROM RolePermissions rp
      JOIN Permissions p ON rp.PermissionId = p.PermissionId
      WHERE rp.RoleId = ${user.RoleId}
    `;

    const permissions = permissionResult.recordset.map(
      (p) => p.PermissionName
    );

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user.UserId,
        tenantId: user.TenantId,
        role: user.RoleName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // IMPORTANT → TenantId return karna zaroori
    res.json({
      message: "Login successful",
      token: token,
      user: {
        UserId: user.UserId,
        Name: user.Name,
        Email: user.Email,
        RoleName: user.RoleName,
        TenantId: user.TenantId,
        TenantName: user.TenantName,
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