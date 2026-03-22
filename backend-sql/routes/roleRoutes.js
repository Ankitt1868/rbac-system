const express = require("express");
const router = express.Router();

const roleController = require("../controllers/roleController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/roles", authMiddleware, roleController.createRole);
router.post("/assign-role", authMiddleware, roleController.assignRole);

module.exports = router;