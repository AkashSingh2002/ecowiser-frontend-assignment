import React from "react";

const NoteCard = ({ note, onEdit }) => {
  return (
    <div className={`note-card ${note.pinned ? "pinned" : ""}`} onClick={onEdit}>
      <h2>{note.title}</h2>
      <p>{note.tagline}</p>
      <p>{note.body}</p>
    </div>
  );
};

export default NoteCard;
