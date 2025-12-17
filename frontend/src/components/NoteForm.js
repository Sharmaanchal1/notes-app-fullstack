import { useEffect, useState } from "react";
import api from "../services/api";

const NoteForm = ({ fetchNotes, editNote, setEditNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setContent(editNote.content);
    }
  }, [editNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editNote) {
        await api.put(`/notes/${editNote.id}`, { title, content });
        setEditNote(null);
      } else {
        await api.post("/notes", { title, content });
      }

      setTitle("");
      setContent("");
      fetchNotes();
    } catch {
      alert("Error saving note");
    }
  };

return (
  <div
    className="card shadow border-0 mb-4"
    style={{
      background: "linear-gradient(135deg, #ffffff, #f3f6ff)",
    }}
  >
    <div className="card-body">
      <h5 className="mb-3 text-primary fw-bold">
         {editNote ? "Edit Note" : "Add a New Note"}
      </h5>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="form-control mb-3"
          rows="4"
          placeholder="Write your thoughts here..."
          value={content}
          required
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="text-end">
          <button className="btn btn-primary px-4">
            {editNote ? "Update" : "Add Note"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default NoteForm;
