import React, { useState } from "react";
import { toast } from "react-toastify";

const NoteModal = ({ note, onClose, onSave }) => {
  const [formData, setFormData] = useState(note || { title: "", tagline: "", body: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.body) {
      // Show toast notification for validation errors
      toast.error("Title and Body are required!");
      return;
    }
    onSave(note?.id, formData);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{note ? "Edit Note" : "Add Note"}</h2>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <input
          name="tagline"
          value={formData.tagline}
          onChange={handleChange}
          placeholder="Tagline"
        />
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          placeholder="Body"
        ></textarea>
        <button onClick={handleSubmit}>{note ? "Save Changes" : "Add Note"}</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default NoteModal;
