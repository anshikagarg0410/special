import React from 'react';
import type { Photo } from '../types';
import { TrashIcon } from './Icons';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void; // NEW
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onClick, onDelete }) => {
  return (
    <div 
      className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-500 ease-in-out"
      style={{ perspective: '1000px' }}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03) rotateX(5deg) rotateY(-3deg)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)')}
    >
      <img 
        src={photo.src} 
        alt={photo.alt} 
        className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {photo.caption && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-white text-md font-semibold">{photo.caption}</p>
        </div>
      )}
      <div className="absolute top-2 right-2 flex flex-row space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(e); }}
          className="bg-rose-500 text-white p-1 rounded-full shadow-md hover:bg-rose-700 transition w-7 h-7 flex items-center justify-center"
          title="Delete Photo"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
        <div className="bg-rose-500 text-white p-1.5 rounded-full text-xs shadow-md">
          View Details
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;