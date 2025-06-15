const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleTokenRefresh,
  handleLogout,
} = require("../controllers/userController");

router.post("/login", handleLogin);
router.post("/token", handleTokenRefresh);
router.post("/logout", handleLogout);

module.exports = router;
