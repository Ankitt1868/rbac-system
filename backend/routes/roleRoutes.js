const express = require("express");
const router = express.Router();
const { createRole } = require("../controllers/roleController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createRole);

module.exports = router;