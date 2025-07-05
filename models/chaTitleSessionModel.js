const pool = require("../db");

exports.findChatTitleById = async (id) => {
  return await pool.query(
    "SELECT title,user_id FROM chat_sessions WHERE chat_session_id = $1",
    [id]
  );
};
exports.fetchLatestChatSessionByUserId = async (user_id) => {
  return await pool.query(
    "Select chat_session_id FROM chat_sessions where user_id =$1 ORDER BY created_at DESC LIMIT 1  ",
    [user_id]
  );
};
