import { useEffect, useState } from "react";
import api from "../services/api";
import NoteForm from "./NoteForm";
import NoteList from "./NoteList";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [editNote, setEditNote] = useState(null);

  // undo delete state
  const [deletedNote, setDeletedNote] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch {
      navigate("/");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  //  search + sort pinned
  const filteredNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.pinned - a.pinned);

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);

  //  delete with undo
  const handleDelete = (note) => {
    setDeletedNote(note);
    setNotes((prev) => prev.filter((n) => n.id !== note.id));

    const timer = setTimeout(async () => {
      await api.delete(`/notes/${note.id}`);
      setDeletedNote(null);
    }, 5000);

    setUndoTimer(timer);
  };

  const undoDelete = () => {
    clearTimeout(undoTimer);
    setNotes((prev) => [deletedNote, ...prev]);
    setDeletedNote(null);
  };

  return (
    <div className="min-vh-100" style={{ background: "#f4f7fb" }}>
      {/* HEADER */}
      <div
        className="p-4 text-white"
        style={{
          background: "linear-gradient(135deg, #667eea, #764ba2)",
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1">Hi, {userName} </h4>
            <small className="opacity-75">
              Here are your personal notes
            </small>
          </div>

          <div className="d-flex gap-2">
            <input
              className="form-control"
              style={{ width: "220px" }}
              placeholder="Search notes..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-light text-danger fw-semibold"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mt-4">
        <NoteForm
          fetchNotes={fetchNotes}
          editNote={editNote}
          setEditNote={setEditNote}
        />

        {pinnedNotes.length > 0 && (
          <>
            <h6 className="text-muted mt-4"> Pinned notes</h6>
            <NoteList
              notes={pinnedNotes}
              setEditNote={setEditNote}
              onDelete={handleDelete}
              fetchNotes={fetchNotes}
            />
          </>
        )}

        {otherNotes.length > 0 && (
          <>
            <h6 className="text-muted mt-4">Others</h6>
            <NoteList
              notes={otherNotes}
              setEditNote={setEditNote}
              onDelete={handleDelete}
              fetchNotes={fetchNotes}
            />
          </>
        )}
      </div>

      {/* UNDO SNACKBAR */}
      {deletedNote && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 bg-dark text-white px-4 py-2 rounded shadow"
          style={{ zIndex: 999 }}
        >
          Note deleted
          <button
            className="btn btn-link text-warning ms-3"
            onClick={undoDelete}
          >
            UNDO
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
