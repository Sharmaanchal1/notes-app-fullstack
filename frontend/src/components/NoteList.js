import api from "../services/api";

const NoteList = ({ notes, setEditNote, onDelete, fetchNotes }) => {
  const togglePin = async (e, id) => {
    e.stopPropagation();
    await api.patch(`/notes/${id}/pin`);
    fetchNotes();
  };

  if (notes.length === 0) {
    return (
      <div className="text-center text-muted mt-4">
        <small>No notes found</small>
      </div>
    );
  }

  return (
    <>
      <div className="row mt-3">
        {notes.map((note) => (
          <div key={note.id} className="col-md-4 mb-3">
            <div
              className="card border-0 shadow-sm h-100 note-card"
              onClick={() => setEditNote(note)}
            >
              {/* TOP BAR */}
              <div className="d-flex justify-content-between px-3 pt-2">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={(e) => togglePin(e, note.id)}
                  title="Pin note"
                >
                  {note.pinned ? "📌" : "📍"}
                </span>

                <span
                  style={{
                    cursor: "pointer",
                    color: "#dc3545",
                    fontWeight: "900",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note);
                  }}
                  title="Delete note"
                >
                  ✕
                </span>
              </div>

              {/* BODY */}
              <div className="card-body pt-2">
                <h6 className="fw-semibold mb-1">{note.title}</h6>

                <p className="text-muted mb-1">
                  {note.content.length > 80
                    ? note.content.substring(0, 80) + "..."
                    : note.content}
                </p>

                {/* LAST EDITED */}
                <small className="text-muted">
                  Last edited:{" "}
                  {new Date(note.updated_at).toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HOVER ANIMATION */}
      <style>{`
        .note-card {
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .note-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
      `}</style>
    </>
  );
};

export default NoteList;
