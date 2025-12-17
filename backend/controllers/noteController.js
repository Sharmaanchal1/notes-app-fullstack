const db = require("../config/db");

// CREATE NOTE
exports.createNote = (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }

  const query =
    "INSERT INTO notes (user_id, title, content, pinned) VALUES (?, ?, ?, ?)";
db.query(query, [userId, title, content, false], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error", error: err });
    }

    res.status(201).json({ message: "Note created successfully" });
  });
};

// GET ALL NOTES
exports.getNotes = (req, res) => {
  const userId = req.user.id;

  const query = "SELECT * FROM notes WHERE user_id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error", error: err });
    }

    res.json(result);
  });
};

// GET SINGLE NOTE
exports.getNoteById = (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;

  const query =
    "SELECT * FROM notes WHERE id = ? AND user_id = ?";
  db.query(query, [noteId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error", error: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(result[0]);
  });
};

// UPDATE NOTE
exports.updateNote = (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;
  const { title, content } = req.body;

  const query =
    "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?";
  db.query(query, [title, content, noteId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note updated successfully" });
  });
};

// DELETE NOTE
exports.deleteNote = (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;

  const query =
    "DELETE FROM notes WHERE id = ? AND user_id = ?";
  db.query(query, [noteId, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  });
};


exports.togglePin = (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;

  const query =
    "UPDATE notes SET pinned = NOT pinned WHERE id = ? AND user_id = ?";
  db.query(query, [noteId, userId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });

    res.json({ message: "Pin status updated" });
  });
};
