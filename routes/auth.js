const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleTokenRefresh,
  handleLogout,
  getUsername,
} = require("../controllers/userController");

router.post("/login", handleLogin);
router.post("/token", handleTokenRefresh);
router.post("/logout", handleLogout);
router.get("/profile/:token", getUsername);
module.exports = router;
