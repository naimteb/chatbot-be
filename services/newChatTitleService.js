const { findChatTitleById } = require("../models/chaTitleSessionModel");

exports.getChatTitleById = async (id) => {
  const result = await findChatTitleById(id);

  if (result.rows.length === 0) {
    throw new Error("Not Found");
  }

  return result.rows[0].title;
};
