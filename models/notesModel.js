const DataStore = require("nedb-promise");

const notesDB = new DataStore({
  filename: "./databases/notes.db",
  autoload: true,
});

module.exports = { notesDB };
