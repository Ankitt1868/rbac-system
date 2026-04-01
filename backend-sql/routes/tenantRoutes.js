const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/rbacMiddleware");

const {
  registerTenant,
  getTenants,
  deleteTenant,
  switchTenant
} = require("../controllers/tenantController");

// Register Tenant
router.post(
  "/register",
  verifyToken,
  checkPermission("Create Tenant"),
  registerTenant
);

// Get Tenants
router.get(
  "/",
  verifyToken,
  checkPermission("View Tenants"),
  getTenants
);

// Delete Tenant
router.delete(
  "/:id",
  verifyToken,
  checkPermission("Delete Tenant"),
  deleteTenant
);

// Switch Tenant
router.post(
  "/switch",
  verifyToken,
  switchTenant
);

module.exports = router;