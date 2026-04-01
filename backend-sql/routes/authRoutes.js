const express = require("express");
const router = express.Router();

const { registerTenant, login } = require("../controllers/authController");

router.post("/register-tenant", registerTenant);
router.post("/login", login);

module.exports = router;