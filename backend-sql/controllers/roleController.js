const { sql } = require("../config/db");

// Create Role
const createRole = async (req, res) => {
  const { roleName } = req.body;
  const tenantId = req.user.TenantId;

  try {
    await sql.query`
      INSERT INTO Roles (RoleName, TenantId)
      VALUES (${roleName}, ${tenantId})
    `;

    res.json({ message: "Role created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating role" });
  }
};

// Get Roles
const getRoles = async (req, res) => {
  try {
    console.log("Logged User:", req.user);

    const tenantId = req.user.TenantId;

    const result = await sql.query`
  SELECT RoleId, RoleName
  FROM Roles
`;

    res.json(result.recordset);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching roles" });
  }
};
// Assign Role to User
const assignRole = async (req, res) => {
  const { userId, roleId } = req.body;

  try {
    // Remove old role
    await sql.query`
      DELETE FROM UserRoles
      WHERE UserId = ${userId}
    `;

    // Insert new role
    await sql.query`
      INSERT INTO UserRoles (UserId, RoleId)
      VALUES (${userId}, ${roleId})
    `;

    res.json({ message: "Role updated successfully" });
  } catch (err) {
    console.log("Assign Role Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign Permissions to Role
const assignPermissionsToRole = async (req, res) => {
  const { roleId, permissions } = req.body;

  try {
    console.log("RoleId:", roleId);
    console.log("Permissions:", permissions);

    if (!roleId || !permissions) {
      return res.status(400).json({ message: "Missing data" });
    }

    // Delete old permissions
    await sql.query`
      DELETE FROM RolePermissions WHERE RoleId = ${roleId}
    `;

    // Insert new permissions
    for (const permId of permissions) {
      await sql.query`
        INSERT INTO RolePermissions (RoleId, PermissionId)
        VALUES (${roleId}, ${permId})
      `;
    }

    res.json({ message: "Permissions assigned successfully" });

  } catch (err) {
    console.log("Assign Permissions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Role Permissions
const getRolePermissions = async (req, res) => {
  const { roleId } = req.params;

  try {
    const result = await sql.query`
      SELECT p.PermissionId, p.PermissionName
      FROM RolePermissions rp
      JOIN Permissions p ON rp.PermissionId = p.PermissionId
      WHERE rp.RoleId = ${roleId}
    `;

    res.json(result.recordset);
  } catch (err) {
    console.log("Get Role Permissions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if role assigned
    const check = await sql.query`
      SELECT * FROM UserRoles WHERE RoleId = ${id}
    `;

    if (check.recordset.length > 0) {
      return res.json({ message: "Cannot delete role assigned to users" });
    }

    // Delete role permissions
    await sql.query`
      DELETE FROM RolePermissions WHERE RoleId = ${id}
    `;

    // Delete role
    await sql.query`
      DELETE FROM Roles WHERE RoleId = ${id}
    `;

    res.json({ message: "Role deleted successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting role" });
  }
};


module.exports = {
  createRole,
  getRoles,
  assignRole,
  assignPermissionsToRole,
  getRolePermissions,
  deleteRole
};