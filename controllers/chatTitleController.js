const { getChatTitleById } = require("../services/newChatTitleService");

exports.getChatTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const title = await getChatTitleById(id);
    res.json({ title });
  } catch (error) {
    console.error("Error fetching chat title:", error);
    if (error.message === "Not Found") {
      res.status(404).json({ error: "Chat not found" });
    } else {
      res.status(500).json({ error: "Failed to fetch chat title" });
    }
  }
};
