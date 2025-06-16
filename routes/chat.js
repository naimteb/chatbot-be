const express = require("express");
const router = express.Router();
const { handleChatMessage } = require("../controllers/chatController");
const { fetchChatHistory } = require("../controllers/chatController");
const { deleteSession } = require("../controllers/chatController");
const authenticateToken = require("../middleware/authenticateToken");
const { createChatSession } = require("../controllers/chatController");

router.post("/", authenticateToken, handleChatMessage);

router.get("/:sessionID", authenticateToken, fetchChatHistory);

router.delete("/:sessionID", authenticateToken, deleteSession);

router.post("/create-session", authenticateToken, createChatSession); // for creating a session automatically
//router.get("/", deleteSession);
module.exports = router;
