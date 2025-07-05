const db = require("../db");

exports.saveUploadedFile = async (file, chatSessionId) => {
  const query = `
    INSERT INTO uploaded_files (
      chat_session_id, filename, originalname, mimetype, size, path
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    chatSessionId,
    file.filename,
    file.originalname,
    file.mimetype,
    file.size,
    file.path,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

exports.getFileByFilename = async (filename) => {
  const query = "SELECT * FROM uploaded_files WHERE filename = $1";
  const result = await db.query(query, [filename]);
  return result.rows[0]; // returns undefined if not found
};
