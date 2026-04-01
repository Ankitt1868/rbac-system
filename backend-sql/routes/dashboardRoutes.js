const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/rbacMiddleware");
const { getStats } = require("../controllers/dashboardController");

router.get(
  "/dashboard-stats",
  verifyToken,
  checkPermission("View Dashboard"),
  getStats
);

module.exports = router;