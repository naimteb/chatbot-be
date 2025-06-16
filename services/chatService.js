const {
  responseFromBotKnowledge,
  insertChatMessage,
  CountMessagesInaSession,
  updateChatSessionTitle,
  getChatMessageBySessionId,
  deleteChatBySessionId,
  getAnyExistingSessionId,
  getSessionCheckByUserId,
} = require("../models/chatModel");
const { createChatSessionInDB } = require("../models/chatModel");

exports.processChatMessage = async (request, session_id) => {
  const result = await responseFromBotKnowledge(request);

  const response =
    result.rows.length > 0 ? result.rows[0].response : "I don't understand";

  await insertChatMessage(session_id, request, response);

  const countResult = await CountMessagesInaSession(session_id);
  const isFirstMessage = parseInt(countResult.rows[0].count) === 1;

  if (isFirstMessage) {
    await updateChatSessionTitle(request, session_id);
  }

  return response;
};

exports.getChatHistory = async (session_id, user_id) => {
  const result = await getChatMessageBySessionId(session_id, user_id);
  return result.rows;
};
//added thesessioncheckbyuser to show only the chats related to user logged
exports.sessionChekByUserId = async (sessionID, user_id) => {
  const result = await getSessionCheckByUserId(sessionID, user_id);
  return result.rows;
};
exports.deleteChatSession = async (session_id, user_id) => {
  await deleteChatBySessionId(session_id, user_id);
};

exports.getFallbackSessionId = async () => {
  const result = await getAnyExistingSessionId();
  return result.rows;
};

exports.createNewChatSession = async (user_id) => {
  const result = await createChatSessionInDB(user_id);
  return result.rows[0];
};
