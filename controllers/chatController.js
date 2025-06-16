const {
  processChatMessage,
  getChatHistory,
  deleteChatSession,
  getFallbackSessionId,
  sessionChekByUserId,
} = require("../services/chatService");
const { createNewChatSession } = require("../services/chatService");

exports.handleChatMessage = async (req, res) => {
  try {
    const { request, session_id } = req.body;
    const response = await processChatMessage(request, session_id);
    res.status(201).json({ response });
  } catch (error) {
    console.error("Error handling chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.fetchChatHistory = async (req, res) => {
  try {
    const { sessionID } = req.params;
    const user_id = req.user.id; //comes from JWT middleware

    const sessionChek = await sessionChekByUserId(sessionID, user_id);
    if (sessionChek.length === 0) {
      return res.status(403).json({ error: "access denied" });
    }
    // here we added the session check to show the chats related to the current user

    const history = await getChatHistory(sessionID, user_id);
    res.json(history);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session_id = req.params.sessionID;
    const user_id = req.user.id;
    await deleteChatSession(session_id, user_id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ error: "Failed to delete session" });
  }
};

exports.fetchFallbackSessionId = async (req, res) => {
  try {
    const fallback = await getFallbackSessionId();
    res.json(fallback);
  } catch (error) {
    console.error("Error fetching fallback session:", error);
    res.status(500).json({ error: "Failed to fetch fallback session ID" });
  }
};

exports.createChatSession = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await createNewChatSession(user_id);
    res.status(201).json({ session_id: result.chat_session_id });
  } catch (error) {
    console.error("Error creating chat session:", error);
    res.status(500).json({ error: "Failed to create session" });
  }
};
