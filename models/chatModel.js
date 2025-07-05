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

exports.getChatMessageBySessionId = async (sessionID, user_id) => {
  console.log("user_id:", user_id);
  const query = `
      SELECT
      c.id,
      c.request,
      c.response,
      c.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'filename', f.filename,
            'originalname', f.originalname,
            'mimetype', f.mimetype,
            'size', f.size,
            'path', f.path
          )
        ) FILTER (WHERE f.id IS NOT NULL),
        '[]'
      ) AS uploaded_files
    FROM chats c
    LEFT JOIN uploaded_files f ON f.chat_session_id = c.session_id
    JOIN chat_sessions s ON s.chat_session_id = c.session_id 
    WHERE c.session_id = $1 AND s.user_id = $2               
    GROUP BY c.id, c.request, c.response, c.created_at
    ORDER BY c.created_at;
  `;

  const result = await pool.query(query, [sessionID, user_id]);
  console.log("result", result);
  return result;
};

//added to filter chats by user logged in
exports.getSessionCheckByUserId = async (user_id) => {
  console.log("user_id:", user_id);

  return await pool.query("Select * FROM chat_sessions WHERE  user_id=$1", [
    user_id,
  ]);
};
exports.deleteChatBySessionId = async (session_id, user_id) => {
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
exports.getAllSessionsFromDBByUserId = async (user_id) => {
  const query = `
    SELECT chat_session_id AS session_id, created_at
    FROM chat_sessions
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  return await pool.query(query, [user_id]);
};

// exports.getSessionCheckBySessionIdAndUserId = async (sessionID, user_id) => {
//   return await pool.query(
//     "SELECT 1 FROM chat_sessions WHERE chat_session_id = $1 AND user_id = $2",
//     [sessionID, user_id]
//   );
// };
exports.getSessionCheckByUserId = async (sessionID, user_id) => {
  console.log("user_id:", user_id);

  return await pool.query(
    "SELECT 1 FROM chat_sessions WHERE chat_session_id = $1 AND user_id = $2",
    [sessionID, user_id]
  );
};
