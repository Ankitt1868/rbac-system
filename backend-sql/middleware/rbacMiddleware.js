const { sql } = require("../config/db");

const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.UserId;

      const result = await sql.query`
        SELECT DISTINCT p.PermissionName
        FROM UserRoles ur
        JOIN RolePermissions rp ON ur.RoleId = rp.RoleId
        JOIN Permissions p ON rp.PermissionId = p.PermissionId
        WHERE ur.UserId = ${userId}
      `;

      const permissions = result.recordset.map(
        (p) => p.PermissionName
      );

      console.log("User Permissions:", permissions);

      if (!permissions.includes(permissionName)) {
        return res.status(403).json({
          message: "Access Denied: No Permission",
        });
      }

      next();
    } catch (err) {
      console.log("RBAC Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = checkPermission;