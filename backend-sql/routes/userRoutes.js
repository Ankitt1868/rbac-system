const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { checkPermission } = require("../middleware/rbacMiddleware");

router.get(
  "/users",
  authMiddleware,
  checkPermission("View Users"),
  userController.getUsers
);

router.post(
  "/users",
  authMiddleware,
  checkPermission("Create User"),
  userController.createUser
);

module.exports = router;