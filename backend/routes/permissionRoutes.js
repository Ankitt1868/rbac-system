const express = require("express");
const router = express.Router();
const { createPermission } = require("../controllers/permissionController");
const protect = require("../middleware/authMiddleware");

// Only logged-in users can create (later admin-only)
router.post("/", protect, createPermission);

module.exports = router;