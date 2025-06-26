import React, { useState, useEffect, useMemo } from 'react';
import type { Note } from '../types';
import NoteCard from '../components/NoteCard';
import Modal from '../components/Modal';
import AnimatedText from '../components/AnimatedText';
import { HeartIcon, PencilIcon } from '../components/Icons';

const NOTES_STORAGE_KEY = 'ourSpecialNotes_v1'; // v1, assuming no major structure change needed for notes

const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

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

  const handleSaveNote = () => {
    if (!currentAuthor.trim() || !currentMessage.trim()) {
      alert("Please fill in at least your name and a message!");
      return;
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric', 
        // hour: '2-digit', minute: '2-digit' // Optional: add time if desired
    });


    if (editingNote) {
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id
          ? { ...note, author: currentAuthor, message: currentMessage, title: currentTitle.trim(), date: `${formattedDate} (Edited)` }
          : note
      );
      setNotes(updatedNotes);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        author: currentAuthor.trim(),
        message: currentMessage.trim(),
        title: currentTitle.trim(),
        date: formattedDate
      };
      setNotes(prevNotes => [newNote, ...prevNotes]);
    }

    setIsModalOpen(false);
    setEditingNote(null); 
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this sweet note? This gentle whisper will be gone forever...")) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    }
  };
  
  const memoizedNotes = useMemo(() => notes.map((note, index) => (
    <NoteCard 
      key={note.id} 
      note={note} 
      onEdit={openEditModal}
      onDelete={handleDeleteNote}
      className="animate-fadeInUp"
      style={{animationDelay: `${index * 0.1}s`}}
    />
  )), [notes, handleDeleteNote, openEditModal]); // Added dependencies for openEditModal and handleDeleteNote as they are used in memoizedNotes


  return (
    <div className="py-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-600 mb-6 py-2">
        <AnimatedText text="Our Little Notes" delay={60} />
      </h1>
      <p className="text-center text-gray-700 mb-8 max-w-xl mx-auto leading-relaxed">
        Words from the heart, for my one and only. Share your thoughts, dreams, and sweet nothings here. Each note is a treasure.
      </p>

      <div className="text-center mb-10">
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center group"
        >
          <PencilIcon className="w-5 h-5 mr-2.5 transform transition-transform duration-300 group-hover:rotate-[-15deg]" /> Add a New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="text-center text-gray-500 italic text-lg mt-8">No notes yet... be the first to write something special and light up this page with your words!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
          {memoizedNotes}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingNote(null);}} 
        title={editingNote ? "Edit Your Special Note" : "Write a Special Note"}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700 mb-1">Title (Optional):</label>
            <input
              type="text"
              id="noteTitle"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder="e.g., A little something for you"
              className="w-full p-2.5 border border-rose-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Your Name:</label>
            <input
              type="text"
              id="author"
              value={currentAuthor}
              onChange={(e) => setCurrentAuthor(e.target.value)}
              placeholder="e.g., Your Sweetheart"
              className="w-full p-2.5 border border-rose-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message:</label>
            <textarea
              id="message"
              rows={5}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Pour your heart out..."
              className="w-full p-2.5 border border-rose-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
            />
          </div>
          <button
            onClick={handleSaveNote}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-2.5 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
            disabled={!currentAuthor.trim() || !currentMessage.trim()}
          >
            <HeartIcon className="w-5 h-5 inline mr-2 transform transition-transform duration-300 group-hover:scale-125" /> {editingNote ? "Update Note" : "Save Note"}
          </button>
        </div>
      </Modal>
      {/* 
        Keyframes removed as style jsx global is not standard React.
        Ensure 'animate-fadeInUp' class and its keyframes are defined globally.
      */}
    </div>
  );
};

export default NotesPage;