const {
  createNewSession,
  getAllSessions,
} = require("../services/newChatService");

exports.createNewChatSession = async (req, res) => {
  try {
    const userId = req.user.id; //  from decoded JWT
    const chatId = await createNewSession(userId);
    res.status(201).json({ chatId });
  } catch (error) {
    console.error("Failed to create chat session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.fetchAllChatSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await getAllSessions(userId);
    res.json(sessions);
  } catch (error) {
    console.error("Failed to fetch chat sessions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
