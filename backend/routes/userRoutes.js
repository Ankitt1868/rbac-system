const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { assignRole } = require("../controllers/userController");


// Protected route
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// Admin-only route
router.get(
  "/admin",
  protect,
  authorizeRoles("Admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin 🔥",
    });
  }
);
// Only Admin can assign role
router.post("/assign-role", protect, authorizeRoles("Admin"), assignRole);

module.exports = router;