import React, { useState, useEffect } from "react";

import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import "react-toastify/dist/ReactToastify.css";
import { db } from "./firebase";
import NoteCard from "./components/noteCard";
import NoteModal from "./components/noteModal";
const App = () => {
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const notesPerPage = 6;

  const fetchNotes = async () => {
    const querySnapshot = await getDocs(collection(db, "notes"));
    const notesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    notesData.sort((a, b) => b.pinned - a.pinned || b.timestamp - a.timestamp);
    setNotes(notesData);
  };

  const addNote = async (note) => {
    try {
      await addDoc(collection(db, "notes"), { ...note, pinned: false, timestamp: Date.now() });
      toast.success("Note added!");
      fetchNotes();
    } catch (error) {
      toast.error("Failed to add note.");
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const noteRef = doc(db, "notes", id);
      await updateDoc(noteRef, updatedNote);
      toast.success("Note updated!");
      fetchNotes();
    } catch (error) {
      toast.error("Failed to update note.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentNote(null);
  };

  const offset = currentPage * notesPerPage;
  const currentNotes = notes.slice(offset, offset + notesPerPage);

  return (
    <div className="app">
      <h1>Notekeeper</h1>
      <button onClick={() => setShowModal(true)}>Add Note</button>
      <div className="grid">
        {currentNotes.map((note) => (
          <NoteCard key={note.id} note={note} onEdit={() => { setCurrentNote(note); setShowModal(true); }} />
        ))}
      </div>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={Math.ceil(notes.length / notesPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
      {showModal && (
        <NoteModal
          note={currentNote}
          onClose={handleModalClose}
          onSave={currentNote ? updateNote : addNote}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
