const { hashedPassword } = require("../middlewares/bcrypt");
const { usersDB } = require("../models/usersModel");

const storeUser = async (username, password) => {
  const encryptedPassword = await hashedPassword(password);

  usersDB.insert({
    username: username,
    password: encryptedPassword,
  });
};

const findUserByUsername = async (username) => {
  return await usersDB.findOne({ username: username });
};

const createUser = async (username, password) => {
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new Error("Unavailable username");
  }

  return storeUser(username, password);
};

module.exports = { storeUser, findUserByUsername, createUser };
