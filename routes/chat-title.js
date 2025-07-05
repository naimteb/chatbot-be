const express = require("express");
const router = express.Router();
const {
  getChatTitle,
  getLatestChatSession,
} = require("../controllers/chatTitleController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/:id", authenticateToken, getChatTitle);
router.get("/", authenticateToken, getLatestChatSession);
module.exports = router;
