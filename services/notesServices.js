// Alla hjälpfunktioner som rör notes och db
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const { notesDB } = require("../models/notesModel");
const { usersDB } = require("../models/notesModel");

const formatDate = () => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  return `${date} at ${time}`;
};

const postNote = async (userId, title, text) => {
  try {
    const note = notesDB.insert({
      id: userId, //DETTA ID ÄR SAMMA SOM I usersDB
      title: title,
      text: text,
      createdAt: formatDate(),
      modifiedAt: formatDate(),
    });
    return note;
  } catch (err) {
    console.log(err, "Something went wrong");
    throw err;
  }
};

module.exports = { postNote };
