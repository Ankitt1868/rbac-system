const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/rbacMiddleware");
const tenantMiddleware = require("../middleware/tenantMiddleware");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

// Get Users
router.get(
  "/",
  verifyToken,
  tenantMiddleware,
  checkPermission("View Users"),
  getUsers 
);

// Create User
router.post(
  "/",
  verifyToken,
  tenantMiddleware,
  checkPermission("Create User"),
  createUser
);

// Update User
router.put(
  "/:id",
  verifyToken,
  tenantMiddleware,
  checkPermission("Edit User"),
  updateUser
);

// Delete User
router.delete(
  "/:id",
  verifyToken,
  tenantMiddleware,
  checkPermission("Delete User"),
  deleteUser
);

module.exports = router;