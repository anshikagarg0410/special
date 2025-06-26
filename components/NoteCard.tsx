import React from 'react';
import type { Note } from '../types';
import { HeartIcon, PencilIcon, TrashIcon } from './Icons';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  className?: string; // For entrance animations
  style?: React.CSSProperties; // Added for animationDelay
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, className, style }) => {
  return (
    <div 
      className={`bg-white p-6 rounded-xl shadow-xl transition-all duration-300 ease-out border-l-4 border-pink-400 hover:border-purple-500 ${className}`}
      style={{ ...style, perspective: '1000px' }} // Merged existing perspective style with passed style
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02) rotateX(3deg)';
        e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(219, 39, 119, 0.3)'; // Pinkish shadow
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'; // Default shadow
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-600 break-words">{note.title || `A Sweet Note`}</h3>
        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{note.date}</span>
      </div>
      <p className="text-sm text-gray-500 mb-3 italic">From: {note.author}</p>
      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4 min-h-[60px] max-h-48 overflow-y-auto custom-scrollbar">{note.message}</p>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-rose-100">
        <HeartIcon className="w-6 h-6 text-rose-400 animate-pulse" style={{animationDuration: '1.8s'}} />
        <div className="space-x-2">
          <button 
            onClick={() => onEdit(note)} 
            className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-100/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Edit note"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(note.id)} 
            className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-100/70 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Delete note"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Scrollbar styles removed as style jsx is not standard React */}
    </div>
  );
};

export default NoteCard;