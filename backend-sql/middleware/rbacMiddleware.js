const { sql } = require("../config/db");

exports.checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const result = await sql.query`
        SELECT p.PermissionName
        FROM Users u
        JOIN UserRoles ur ON u.UserId = ur.UserId
        JOIN Roles r ON ur.RoleId = r.RoleId
        JOIN RolePermissions rp ON r.RoleId = rp.RoleId
        JOIN Permissions p ON rp.PermissionId = p.PermissionId
        WHERE u.UserId = ${userId}
        AND p.PermissionName = ${permissionName}
      `;

      if (result.recordset.length === 0) {
        return res.status(403).json({ message: "Access Denied" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};