const express = require("express");
const router = express.Router();
const {
  handleChatMessage,
  fetchAllChats,
} = require("../controllers/chatController");
const { fetchChatHistory } = require("../controllers/chatController");
const { deleteSession } = require("../controllers/chatController");
const authenticateToken = require("../middleware/authenticateToken");
const { createChatSession } = require("../controllers/chatController");
const upload = require("../middleware/upload");
//this to use in llm
router.post(
  "/",
  authenticateToken,
  upload.fields([
    { name: "files", maxCount: 10 },
    { name: "request" },
    { name: "session_id" },
  ]),
  handleChatMessage
);
router.get("/sessions", authenticateToken, fetchAllChats);

router.get("/:sessionID", authenticateToken, fetchChatHistory);

router.delete("/:sessionID", authenticateToken, deleteSession);

router.post("/create-session", authenticateToken, createChatSession); // for creating a session automatically
//router.get("/", deleteSession);
module.exports = router;
