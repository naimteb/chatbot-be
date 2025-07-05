const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const util = require("util");
const {
  findUserByUsername,
  updateUserRefreshToken,
  findUserByRefreshToken,
  clearUserRefreshToken,
  fetchUsernameByrefreshAccessToken,
} = require("../models/userModel");

exports.loginUser = async (username, password) => {
  const user = await findUserByUsername(username);
  if (!user) throw { status: 401, message: "User not found" };

  const isMatch = password === user.password; //just for testing later will be hashed and compared by bcrypt
  if (!isMatch) throw { status: 401, message: "Invalid password" };

  const payload = { id: user.id, name: user.username };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
  await updateUserRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken };
};

exports.refreshAccessToken = async (refreshToken) => {
  const user = await findUserByRefreshToken(refreshToken);
  if (!user) throw { status: 403, message: "Invalid refresh token" };
  //use  async
  // return new Promise((resolve, reject) => {
  //   jwt.verify(
  //     refreshToken,
  //     process.env.REFRESH_TOKEN_SECRET,
  //     (err, payload) => {
  //       if (err)
  //         return reject({ status: 403, message: "Token expired or invalid" });

  //       const accessToken = jwt.sign(
  //         { id: user.id, name: user.username },
  //         process.env.ACCESS_TOKEN_SECRET,
  //         { expiresIn: "15m" }
  //       );
  //       resolve(accessToken);
  //       //resolve doesn't return anything meaningful ,it is just telling the promise "here is the accestoken ready "
  //     }
  //   );
  // });
  try {
    const verifyAsync = util.promisify(jwt.verify);
    const payload = await verifyAsync(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ); //throws if  the token is expired  or invalid
    const accessToken = jwt.sign(
      { id: user.id, name: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    return accessToken;
  } catch (err) {
    throw { status: 403, message: "Token expired or invalid" };
  }
};

exports.logoutUser = async (refreshToken) => {
  await clearUserRefreshToken(refreshToken);
};
exports.getUsernameByrefreshAccessToken = async (token) => {
  const user = await findUserByRefreshToken(token);
  if (!user) throw { status: 403, message: "Invalid refresh token" };
  return { username: user.username };
};
