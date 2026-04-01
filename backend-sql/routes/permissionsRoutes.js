const express = require("express");
const router = express.Router();
const { sql } = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

// Get all permissions
router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await sql.query`
      SELECT PermissionId, PermissionName FROM Permissions
    `;
    res.json(result.recordset);
  } catch (err) {
    console.log("Get Permissions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;