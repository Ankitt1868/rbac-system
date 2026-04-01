const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/rbacMiddleware");

const {
  createRole,
  getRoles,
  assignRole,
  assignPermissionsToRole,
  getRolePermissions,
  deleteRole
} = require("../controllers/roleController");

// Create Role
router.post(
  "/",
  verifyToken,
  checkPermission("Create Role"),
  createRole
);

// Get Roles
router.get(
  "/",
  verifyToken,
  checkPermission("View Roles"),
  getRoles
);

// Assign Role to User
router.post(
  "/assign-role",
  verifyToken,
  assignRole
);

// Assign Permissions
router.post(
  "/assign-permissions",
  verifyToken,
  assignPermissionsToRole
);

// Get Role Permissions
router.get(
  "/permissions/:roleId",
  verifyToken,
  getRolePermissions
);

router.delete("/roles/:id", deleteRole);

module.exports = router;