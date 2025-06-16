const {
  createChatSession,
  getAllChatSessions,
} = require("../models/newChatModel");

exports.createNewSession = async (userId) => {
  const result = await createChatSession(userId);

  if (result.rows.length === 0) {
    throw new Error("Insert failed - no rows returned");
  }

  return result.rows[0].chat_session_id;
};

exports.getAllSessions = async (userId) => {
  const result = await getAllChatSessions(userId);
  return result.rows;
};
