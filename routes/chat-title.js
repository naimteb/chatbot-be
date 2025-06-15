const express = require("express");
const router = express.Router();
const { getChatTitle } = require("../controllers/chatTitleController");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/:id", authenticateToken, getChatTitle);

module.exports = router;
