const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { togglePin } = require("../controllers/noteController");

const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

// All routes protected
router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getNotes);
router.get("/:id", authMiddleware, getNoteById);
router.put("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);
router.patch("/:id/pin", authMiddleware, togglePin);

module.exports = router;
