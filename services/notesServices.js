// Alla hjälpfunktioner som rör notes och db
const { v4: uuidv4 } = require("uuid");
// Initiering av databas sker här
const { notesDB } = require("../models/notesModel");
const { usersDB } = require("../models/notesModel");

const postNote = async (userId, title, text) => {
  try {
    const note = notesDB.insert({
      id: userId, //DETTA ID ÄR SAMMA SOM I usersDB
      title: title,
      text: text,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return note;
  } catch (err) {
    console.log(err, "Something went wrong");
    throw err;
  }
};

module.exports = { postNote };
