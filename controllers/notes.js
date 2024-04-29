const { Router } = require("express");
const { authenticate } = require("../middlewares/AuthMiddleware");
const router = Router();
const {
  postNote,
  putNote,
  findExistingNote,
} = require("../services/notesServices");

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
  const { title, text, createdAt, modifiedAt } = req.body;
  const userId = req.user.id;

  try {
    if (title.length > 50) {
      return res
        .status(400)
        .json({ error: "The title must not exceed 50 characters" });
    }
    if (text.length > 300) {
      return res
        .status(400)
        .json({ error: "The text must not exceed 300 characters" });
    }

    const newNote = await postNote(userId, title, text, createdAt, modifiedAt);
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/notes", authenticate, async (req, res) => {
  const { noteId, title, text } = req.body;

  try {
    const existingNote = await findExistingNote(noteId);
    if (!existingNote) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }
    if (existingNote.title === title && existingNote.text === text) {
      return res.status(200).json({
        success: true,
        message: "No changes needed, note was not modified",
        data: existingNote,
      });
    }

    const modifiedNote = await putNote(noteId, title, text);
    if (modifiedNote) {
      return res.status(200).json({
        success: true,
        message: "Note successfully modified",
        data: modifiedNote,
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

router.delete("/notes", (req, res) => {});

module.exports = router;
