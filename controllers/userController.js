const {
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUsernameByrefreshAccessToken,
} = require("../services/userService");

exports.handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const tokens = await loginUser(username, password);
    res.json(tokens);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

/*
Validating a given refresh token

If valid, generating a new access token

This allows the user to stay logged in without re-entering their credentials
*/
exports.handleTokenRefresh = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: "Token required" });

    const accessToken = await refreshAccessToken(token);
    res.json({ accessToken });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

exports.handleLogout = async (req, res) => {
  try {
    const { token } = req.body;
    await logoutUser(token);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
};
exports.getUsername = async (req, res) => {
  console.log("HIT /profile/:token");
  const { token } = req.params;
  console.log(token);
  const username = await getUsernameByrefreshAccessToken(token);
  res.json(username);
};
