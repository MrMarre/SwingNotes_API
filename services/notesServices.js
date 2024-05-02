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
    const note = await notesDB.insert({
      userId: userId, //DETTA ID ÄR SAMMA SOM I usersDB (personens db_id)
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

// Nedan är mest för PUT-requests
const findExistingNote = async (noteId) => {
  const existingNote = await notesDB.findOne({ _id: noteId });
  return existingNote;
};

const putNote = async (noteId, title, text) => {
  const modifiedAt = formatDate();

  try {
    const updateNote = await notesDB.update(
      { _id: noteId },
      { $set: { title, text, modifiedAt } }
    );
    console.log(updateNote);

    return updateNote;
  } catch (err) {
    console.log(err, "Something went wrong");
    throw err;
  }
};

const getUserNotes = async (userId) => {
  try {
    const userNotes = await notesDB.find({ userId: userId });
    return userNotes;
  } catch (err) {
    console.log(err, "Error retrieving user notes");
    throw err;
  }
};

module.exports = { postNote, putNote, findExistingNote, getUserNotes };
