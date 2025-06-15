const pool = require("../db");

exports.findChatTitleById = async (id) => {
  return await pool.query(
    "SELECT title FROM chat_sessions WHERE chat_session_id = $1",
    [id]
  );
};
