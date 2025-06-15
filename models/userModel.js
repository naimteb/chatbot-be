const pool = require("../db");

exports.findUserByUsername = async (username) => {
  const result = await pool.query(
    "SELECT id, username, password, refresh_token FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0];
};

exports.updateUserRefreshToken = async (userId, token) => {
  await pool.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
    token,
    userId,
  ]);
};

exports.findUserByRefreshToken = async (token) => {
  const result = await pool.query(
    "SELECT id, username FROM users WHERE refresh_token = $1",
    [token]
  );
  return result.rows[0];
};

exports.clearUserRefreshToken = async (token) => {
  await pool.query(
    "UPDATE users SET refresh_token = NULL WHERE refresh_token = $1",
    [token]
  );
};
