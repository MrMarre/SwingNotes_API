const { Router } = require("express");
const { authenticate } = require("../middlewares/AuthMiddleware");
const router = Router();
const {
  postNote,
  putNote,
  findExistingNote,
  getUserNotes,
} = require("../services/notesServices");
const { notesDB } = require("../models/notesModel");

// Alla router.(get,put,post,delete) för notes

// Hämtar alla notes
router.get("/notes", async (req, res) => {
  try {
    const docs = await notesDB.find({});
    res.status(200).json({ success: true, notes: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.post("/notes", authenticate, async (req, res) => {
  const { title, text } = req.body;
  const userId = req.user.id;

  try {
    if (title.length > 50 || title.length === 0) {
      return res.status(400).json({
        error: "A title is required and must not exceed 50 characters",
      });
    }

    if (text.length > 300 || text.length === 0) {
      return res.status(400).json({
        error:
          "A description text is required and must not exceed 300 characters",
      });
    }

    const newNote = await postNote(userId, title, text);
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/notes", authenticate, async (req, res) => {
  const { noteId, title, text } = req.body;

  if (!title || !text) {
    return res
      .status(400)
      .json({ success: false, error: "Title and text fields cannot be empty" });
  }
  try {
    const existingNote = await findExistingNote(noteId);

    if (!existingNote) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }
    if (req.user.id !== existingNote.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to modify this note" });
    }
    if (existingNote.title === title && existingNote.text === text) {
      return res.status(200).json({
        success: true,
        message: "No changes needed, note was not modified",
        data: existingNote,
      });
    }

    const modifiedNote = await putNote(noteId, title, text);
    const updatedNote = await findExistingNote(noteId);
    if (modifiedNote) {
      return res.status(200).json({
        success: true,
        message: "Note successfully modified",
        data: modifiedNote,
        note: updatedNote,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Unable to update note" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/notes/:noteId", authenticate, async (req, res) => {
  const userId = req.user.id;
  const { noteId } = req.params;

  try {
    const existingNote = await findExistingNote(noteId);
    if (!existingNote) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    if (existingNote.userId !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this note" });
    }

    const removeNote = await notesDB.remove({ _id: noteId, userId: userId });

    if (removeNote) {
      return res
        .status(200)
        .json({ success: true, message: "The note was successfully removed" });
    } else
      return res
        .status(400)
        .json({ success: false, error: "Unable to delete note" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/notes/:userId", authenticate, async (req, res) => {
  const userId = req.params.userId;

  if (req.user.id !== userId) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized access" });
  }

  try {
    const foundNotes = await getUserNotes(userId);
    if (foundNotes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No notes found for this user" });
    } else {
      return res.status(200).json({ success: true, data: foundNotes });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving user notes", error: err });
  }
});

module.exports = router;
