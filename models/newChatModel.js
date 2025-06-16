const pool = require("../db");

exports.createChatSession = async (userId) => {
  return await pool.query(
    "INSERT INTO chat_sessions (user_id) VALUES ($1) RETURNING chat_session_id",
    [userId]
  );
};

exports.getAllChatSessions = async (userId) => {
  console.log("user_id:", userId);

  return await pool.query(
    "SELECT chat_session_id, title  from chat_sessions where user_id=$1 ORDER by created_at",
    [userId]
  );
};
