import React, { useState, useEffect, useMemo } from 'react';
import type { Note } from '../types';
import NoteCard from '../components/NoteCard';
import Modal from '../components/Modal';
import AnimatedText from '../components/AnimatedText';
import { HeartIcon, PencilIcon } from '../components/Icons';

// --- Firebase Imports ---
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // --- 1. Fetch Notes from Firebase ---
  useEffect(() => {
    const fetchNotes = async () => {
      const notesQuery = query(collection(db, "notes"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(notesQuery);
      const notesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      setNotes(notesData);
    };
    fetchNotes();
  }, []); // This runs only once when the component loads

  const openAddModal = () => {
    setEditingNote(null);
    setCurrentAuthor('');
    setCurrentMessage('');
    setCurrentTitle('');
    setIsModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setCurrentAuthor(note.author);
    setCurrentMessage(note.message);
    setCurrentTitle(note.title || '');
    setIsModalOpen(true);
  };

  // --- 2. Save or Update Note in Firebase ---
  const handleSaveNote = async () => {
    if (!currentAuthor.trim() || !currentMessage.trim()) {
      alert("Please fill in at least your name and a message!");
      return;
    }

    if (editingNote) {
      // Update existing note in Firestore
      const noteRef = doc(db, "notes", editingNote.id);
      const updatedData = { 
        author: currentAuthor, 
        message: currentMessage, 
        title: currentTitle.trim(),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' (Edited)'
      };
      await updateDoc(noteRef, updatedData);
      setNotes(notes.map(note => note.id === editingNote.id ? { ...note, ...updatedData } : note));
    } else {
      // Add a new note to Firestore
      const newNoteData = {
        author: currentAuthor.trim(),
        message: currentMessage.trim(),
        title: currentTitle.trim(),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, "notes"), newNoteData);
      setNotes(prevNotes => [{ id: docRef.id, ...newNoteData }, ...prevNotes]);
    }

    setIsModalOpen(false);
    setEditingNote(null);
  };

  // --- 3. Delete Note from Firebase ---
  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this sweet note?")) {
      await deleteDoc(doc(db, "notes", noteId));
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    }
  };
  
  const memoizedNotes = useMemo(() => notes.map((note, index) => (
    <NoteCard 
      key={note.id} 
      note={note} 
      onEdit={openEditModal}
      onDelete={handleDeleteNote}
      className="animate-fadeInUp-global"
      style={{animationDelay: `${index * 0.1}s`}}
    />
  )), [notes]);


  return (
    <div className="py-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-600 mb-6 py-2">
        <AnimatedText text="Our Little Notes" delay={60} />
      </h1>
      <p className="text-center text-gray-700 mb-8 max-w-xl mx-auto leading-relaxed">
        Words from the heart, for my one and only. Share your thoughts, dreams, and sweet nothings here.
      </p>

      <div className="text-center mb-10">
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
        >
          <PencilIcon className="w-5 h-5 mr-2.5 inline" /> Add a New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="text-center text-gray-500 italic text-lg mt-8">No notes yet... be the first to write something special!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
          {memoizedNotes}
        </div>
      )}

      {/* --- Modal remains the same --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingNote(null);}} 
        title={editingNote ? "Edit Your Special Note" : "Write a Special Note"}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700 mb-1">Title (Optional):</label>
            <input
              type="text" id="noteTitle" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder="e.g., A little something for you"
              className="w-full p-2.5 border border-rose-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Your Name:</label>
            <input
              type="text" id="author" value={currentAuthor} onChange={(e) => setCurrentAuthor(e.target.value)}
              placeholder="e.g., Your Sweetheart"
              className="w-full p-2.5 border border-rose-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message:</label>
            <textarea
              id="message" rows={5} value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Pour your heart out..."
              className="w-full p-2.5 border border-rose-300 rounded-md"
            />
          </div>
          <button
            onClick={handleSaveNote}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-2.5 px-4 rounded-md"
            disabled={!currentAuthor.trim() || !currentMessage.trim()}
          >
            <HeartIcon className="w-5 h-5 inline mr-2" /> {editingNote ? "Update Note" : "Save Note"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default NotesPage;