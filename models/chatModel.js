const pool = require("../db");
//models :
// This is where raw SQL lives — only DB logic.
exports.responseFromBotKnowledge = async (request) => {
  return await pool.query(
    "SELECT response FROM bot_knowledge WHERE request=$1 LIMIT 1 ",
    [request]
  );
};

exports.insertChatMessage = async (session_id, request, response) => {
  return await pool.query(
    "INSERT INTO chats (session_id,request,response) VALUES ($1,$2,$3)",
    [session_id, request, response]
  );
};

exports.CountMessagesInaSession = async (session_id) => {
  return await pool.query("SELECT COUNT(*) FROM chats WHERE session_id=$1", [
    session_id,
  ]);
};

exports.updateChatSessionTitle = async (request, session_id) => {
  return await pool.query(
    "UPDATE chat_sessions SET title=$1 where chat_session_id=$2",
    [request.slice(0, 50), session_id]
  );
};

exports.getChatMessageBySessionId = async (session_id, user_id) => {
  console.log("user_id:", user_id);
  return await pool.query(
    "SELECT  c.request,c.response FROM  chats c JOIN chat_sessions s ON c.session_id=s.chat_session_id where c.session_id =$1 AND s.user_id=$2 ORDER BY c.created_at",
    [session_id, user_id]
  );
};
//added to filter chats by user logged in
exports.getSessionCheckByUserId = async (sessionID, user_id) => {
  console.log("user_id:", user_id);

  return await pool.query(
    "Select * FROM chat_sessions WHERE chat_session_id=$1 AND user_id=$2",
    [sessionID, user_id]
  );
};
exports.deleteChatBySessionId = async (session_id, user_id) => {
  console.log(
    "sessionid to delete :",
    session_id,
    "/n user_id to delete:",
    user_id
  );
  return await pool.query(
    "DELETE  from chat_sessions where chat_session_id=$1 and user_id=$2",
    [session_id, user_id]
  );
};
exports.getAnyExistingSessionId = async () => {
  return await pool.query(
    "SELECT session_id from chats where session_id IS NOT NULL LIMIT 1 "
  );
};
exports.createChatSessionInDB = async (user_id) => {
  return await pool.query(
    "INSERT INTO chat_sessions (user_id) VALUES ($1) RETURNING chat_session_id",
    [user_id]
  );
};
