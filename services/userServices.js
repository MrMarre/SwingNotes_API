const { hashedPassword, comparePassword } = require("../bcrypt");
const { usersDB } = require("../models/usersModel");
// Alla funktioner som berör user och db

// Initiering av databas sker här

// Kanske lite middleware för att underlätta checks på signup och login? Cleanare kod blir det minsann

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
