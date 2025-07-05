const {
  getChatTitleById,
  fetchLatestChatSessionByUserId,
} = require("../services/newChatTitleService");

exports.getChatTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const chat = await getChatTitleById(id);
    // console.log("userid from db ", chat.user_id, "userid from params", user_id);
    if (chat.user_id !== user_id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.json({ title: chat.title });
  } catch (error) {
    console.error("Error fetching chat title:", error);
    if (error.message === "Not Found") {
      res.status(404).json({ error: "Chat not found" });
    } else {
      res.status(500).json({ error: "Failed to fetch chat title" });
    }
  }
};
exports.getLatestChatSession = async (req, res) => {
  try {
    const user_id = req.user.id;
    const session = await fetchLatestChatSessionByUserId(user_id);
    res.json({ session: session });
  } catch (error) {
    console.error("Error fetching chat latest title:", error);
  }
};
