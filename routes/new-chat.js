const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const { createNewChatSession } = require("../controllers/newChatController");
const { fetchAllChatSessions } = require("../controllers/newChatController");
router.post("/", authenticateToken, createNewChatSession);

router.get("/", authenticateToken, fetchAllChatSessions);
module.exports = router;
