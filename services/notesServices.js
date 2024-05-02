// Alla hjälpfunktioner som rör notes och db
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

const searchNotesByTitle = async (userId, title) => {
  const regex = new RegExp(title, "i");
  try {
    const notes = await notesDB.find({ userId: userId, title: regex });

    return notes;
  } catch (err) {
    console.error("error searching notes", err);
    throw err;
  }
};

module.exports = {
  postNote,
  putNote,
  findExistingNote,
  getUserNotes,
  searchNotesByTitle,
};
