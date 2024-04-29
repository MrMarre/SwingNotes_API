const DataStore = require("nedb-promise");

const usersDB = new DataStore({
  filename: "./databases/users.db",
  autoload: true,
});

module.exports = { usersDB };
