import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Photo } from '../types';
import PhotoCard from '../components/PhotoCard';
import Modal from '../components/Modal';
import AnimatedText from '../components/AnimatedText';
import { HeartIcon, PencilIcon, TrashIcon, PlusIcon, UploadIcon } from '../components/Icons';

const GALLERY_STORAGE_KEY = 'ourSpecialGalleryPhotos_v3'; // v3 for base64 src

interface InitialPhotoSeed {
  initialSrc: string;
  alt: string;
  caption?: string;
}

const initialPhotosData: InitialPhotoSeed[] = [
  { initialSrc: 'https://picsum.photos/seed/memory1love/600/400', alt: 'A cherished memory', caption: 'That day at the beach...' },
  { initialSrc: 'https://picsum.photos/seed/memory2joy/600/400', alt: 'Another lovely moment', caption: 'Our favorite cafe!' },
  { initialSrc: 'https://picsum.photos/seed/memory3fun/600/400', alt: 'Fun times together', caption: 'Silly faces championship.' },
  { initialSrc: 'https://picsum.photos/seed/memory4view/600/400', alt: 'Beautiful scenery', caption: 'Sunset views.' },
  { initialSrc: 'https://picsum.photos/seed/memory5special/600/400', alt: 'Special occasion', caption: 'Anniversary dinner.' },
  { initialSrc: 'https://picsum.photos/seed/memory6hike/600/400', alt: 'Adventure time', caption: 'Hiking adventure!'},
];

const GalleryPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreviewUrl, setNewPhotoPreviewUrl] = useState<string>('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentAuthor, setNewCommentAuthor] = useState('');

  const [editingComment, setEditingComment] = useState<{ id: string; text: string } | null>(null);

  const captionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("GalleryPage: Component did mount. Attempting to load photos from localStorage.");
    const storedPhotos = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (storedPhotos) {
      try {
        const parsedPhotos: Photo[] = JSON.parse(storedPhotos);
        const ids = parsedPhotos.map(p => p.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
          console.warn("GalleryPage: Duplicate photo IDs detected in localStorage data!", ids);
        }

        const photosWithIds = parsedPhotos.map(p => ({
          ...p,
          id: p.id || `fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          comments: (p.comments || []).map(c => ({
            ...c,
            id: c.id || `comment-fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          }))
        }));
        setPhotos(photosWithIds);
        console.log("GalleryPage: Loaded photos from localStorage:", photosWithIds.length, "photos loaded.");
      } catch (error) {
        console.error("GalleryPage: Error parsing photos from localStorage:", error);
        loadInitialPhotos();
      }
    } else {
      console.log("GalleryPage: No photos found in localStorage. Loading initial photos.");
      loadInitialPhotos();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInitialPhotos = () => {
    const photosWithInitialIds = initialPhotosData.map((p, index) => ({
      src: p.initialSrc,
      alt: p.alt,
      caption: p.caption,
      id: `initial-${index}-${Date.now()}`,
      comments: [],
    }));
    setPhotos(photosWithInitialIds);
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(photosWithInitialIds));
    console.log("GalleryPage: Initial photos loaded and saved to localStorage.");
  };

  const openDetailModal = useCallback((photoToOpen: Photo) => {
    // Ensure we are selecting from the most current 'photos' state
    const currentVersionOfPhoto = photos.find(p => p.id === photoToOpen.id);
    setSelectedPhoto(currentVersionOfPhoto || photoToOpen);
    setIsDetailModalOpen(true);
    setNewCommentText('');
    setNewCommentAuthor('');
    setEditingComment(null);
  }, [photos]); // Depends on `photos` to find the current version

  const closeModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedPhoto(null);
    setEditingComment(null);
  }, []);
  
  const openAddPhotoModal = useCallback(() => {
    if (!isAddPhotoModalOpen) {
      setNewPhotoFile(null);
      setNewPhotoPreviewUrl('');
      setNewPhotoCaption('');
      setIsAddPhotoModalOpen(true);
    }
  }, [isAddPhotoModalOpen]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setNewPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setNewPhotoFile(null);
      setNewPhotoPreviewUrl('');
    }
  }, []);

  const handleAddPhoto = useCallback(() => {
    if (!newPhotoFile) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      let newPhotoId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      if (photos.some(p => p.id === newPhotoId)) {
        console.warn("GalleryPage: Duplicate ID generated for new photo. Regenerating ID.", newPhotoId);
        newPhotoId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-dedup`;
      }
      const newPhoto: Photo = {
        id: newPhotoId,
        src: reader.result as string, 
        alt: newPhotoCaption.trim() || 'A beautiful new memory',
        caption: newPhotoCaption.trim(),
        comments: []
      };
      const updatedPhotos = [newPhoto, ...photos];
      setPhotos(updatedPhotos);
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedPhotos));
      setIsAddPhotoModalOpen(false);
      setNewPhotoFile(null);
      setNewPhotoPreviewUrl('');
      setNewPhotoCaption('');
      console.log("GalleryPage: Added new photo:", newPhoto.id);
    };
    reader.readAsDataURL(newPhotoFile);
  }, [newPhotoFile, newPhotoCaption, photos]);

  const handleAddComment = useCallback(() => {
    if (!newCommentText.trim() || !newCommentAuthor.trim() || !selectedPhoto) return;

    const newCommentObj = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
      text: newCommentText,
      author: newCommentAuthor,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const updatedPhotos = photos.map(photo =>
      photo.id === selectedPhoto.id
        ? { ...photo, comments: [...(photo.comments || []), newCommentObj] }
        : photo
    );

    setPhotos(updatedPhotos);
    const currentSelectedPhoto = updatedPhotos.find(p => p.id === selectedPhoto.id);
    setSelectedPhoto(currentSelectedPhoto ? {...currentSelectedPhoto} : null); 
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedPhotos));
    setNewCommentText('');
    console.log("GalleryPage: Added new comment to photo:", selectedPhoto.id);
  }, [newCommentText, newCommentAuthor, selectedPhoto, photos]);

  const handleEditComment = useCallback((commentId: string, currentText: string) => {
    setEditingComment({ id: commentId, text: currentText });
  }, []);

  const handleSaveEditedComment = useCallback(() => {
    if (!editingComment || !selectedPhoto || !editingComment.text.trim()) return;

    const updatedPhotos = photos.map(photo => {
      if (photo.id === selectedPhoto.id) {
        return {
          ...photo,
          comments: (photo.comments || []).map(comment =>
            comment.id === editingComment.id
              ? { ...comment, text: editingComment.text, date: `${comment.date.split(' (Edited)')[0]} (Edited)` } 
              : comment
          )
        };
      }
      return photo;
    });

    setPhotos(updatedPhotos);
    const currentlySelected = updatedPhotos.find(p => p.id === selectedPhoto.id);
    setSelectedPhoto(currentlySelected ? {...currentlySelected} : null); 
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedPhotos));
    setEditingComment(null);
    console.log("GalleryPage: Edited comment:", editingComment.id, "on photo:", selectedPhoto.id);
  }, [editingComment, selectedPhoto, photos]);
  
  const handleDeleteComment = useCallback((commentId: string) => {
    if (!selectedPhoto || !window.confirm("Are you sure you want to delete this comment? This action cannot be undone.")) return;

    const updatedPhotos = photos.map(photo => {
      if (photo.id === selectedPhoto.id) {
        return {
          ...photo,
          comments: (photo.comments || []).filter(comment => comment.id !== commentId)
        };
      }
      return photo;
    });
    
    setPhotos(updatedPhotos);
    const currentlySelected = updatedPhotos.find(p => p.id === selectedPhoto.id);
    setSelectedPhoto(currentlySelected ? {...currentlySelected} : null); 
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedPhotos));
    console.log("GalleryPage: Deleted comment:", commentId, "from photo:", selectedPhoto.id);
  }, [selectedPhoto, photos]);
  
  const handleDeletePhoto = useCallback((photoId: string) => {
    if (window.confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
      const updatedPhotos = photos.filter(photo => photo.id !== photoId);
      setPhotos(updatedPhotos);
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedPhotos));
      // Close modal if the deleted photo was open
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setIsDetailModalOpen(false);
        setSelectedPhoto(null);
      }
    }
  }, [photos, selectedPhoto]);
  
  const memoizedPhotos = useMemo(() => {
    return photos.map((photo, index) => (
      <div key={photo.id || `photo-${index}`} className="animate-fadeInUp-global" style={{animationDelay: `${index * 0.1}s`}}>
        <PhotoCard
          photo={photo}
          onClick={() => openDetailModal(photo)}
          onDelete={() => handleDeletePhoto(photo.id)} // Pass delete handler
        />
      </div>
    ));
  }, [photos, openDetailModal, handleDeletePhoto]);


  useEffect(() => {
    if (isAddPhotoModalOpen) {
      captionInputRef.current?.focus();
    }
  }, [isAddPhotoModalOpen]);

  return (
    <div className="py-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-600 mb-6 py-2">
        <AnimatedText text="Our Photo Album" delay={60} />
      </h1>
      <p className="text-center text-gray-700 mb-8 max-w-xl mx-auto leading-relaxed">
        A collection of moments that tell our story. Each picture holds a thousand unsaid words and a million feelings. Feel free to add your thoughts and new memories!
      </p>
      
      <div className="text-center mb-10">
        <button
          onClick={openAddPhotoModal}
          disabled={isAddPhotoModalOpen}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Add New Photo
        </button>
      </div>

      {photos.length === 0 ? (
        <p className="text-center text-gray-500 italic text-lg mt-8">Your gallery is empty. Click "Add New Photo" to start filling it with love!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 px-2">
          {memoizedPhotos}
        </div>
      )}

      <Modal
        isOpen={isAddPhotoModalOpen}
        // Only reset fields when modal is first opened, not on every close
        onClose={() => setIsAddPhotoModalOpen(false)}
        title="Add a New Memory"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="newPhotoFile" className="block text-sm font-medium text-gray-700 mb-1">Choose Image:</label>
            <input
              type="file"
              id="newPhotoFile"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200 transition-colors cursor-pointer"
            />
          </div>
          {newPhotoPreviewUrl && (
            <div className="my-3 text-center">
              <img src={newPhotoPreviewUrl} alt="Preview" className="max-h-48 w-auto inline-block rounded-md shadow-md border border-rose-200" />
            </div>
          )}
          <div>
            <label htmlFor="newPhotoCaption" className="block text-sm font-medium text-gray-700 mb-1">Caption (Optional):</label>
            <input
              ref={captionInputRef}
              type="text"
              id="newPhotoCaption"
              value={newPhotoCaption}
              onChange={(e) => setNewPhotoCaption(e.target.value)}
              placeholder="e.g., Our special day!"
              className="w-full p-2.5 border border-rose-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
            />
          </div>
          <button
            onClick={handleAddPhoto}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-2.5 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            disabled={!newPhotoFile}
          >
            <UploadIcon className="w-5 h-5 inline mr-2" /> Add Photo
          </button>
        </div>
      </Modal>

      {selectedPhoto && (
        <Modal isOpen={isDetailModalOpen} onClose={closeModal} title={selectedPhoto.caption || "Our Memory"} size="xl">
          <div className="max-h-[85vh] pr-2"> 
            <img 
              src={selectedPhoto.src} 
              alt={selectedPhoto.alt} 
              className="w-full max-h-[50vh] object-contain rounded-lg shadow-xl mb-4 border-4 border-white" 
            />
            {selectedPhoto.caption && <p className="mb-4 text-center text-gray-700 font-semibold text-lg">{selectedPhoto.caption}</p>}
            
            {/* Photo Deletion Button Removed */}

            <div className="comments-section mt-6 border-t-2 border-rose-200 pt-6">
              <h3 className="text-xl font-semibold text-rose-700 mb-4 flex items-center">
                <HeartIcon className="w-6 h-6 mr-2 text-rose-500" /> Comments & Thoughts:
              </h3>
              {selectedPhoto.comments && selectedPhoto.comments.length > 0 ? (
                <ul className="space-y-4 mb-6 max-h-40 overflow-y-auto custom-modal-scrollbar pr-2"> 
                  {selectedPhoto.comments.map((comment, idx) => ( 
                    <li key={comment.id || `comment-${idx}`} className="bg-rose-50 p-3.5 rounded-lg shadow-sm border border-rose-100 relative group animate-fadeInUp-global" style={{animationDelay: `${(idx % 10) * 0.05}s`}}> 
                      {editingComment && editingComment.id === comment.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingComment.text}
                            onChange={(e) => setEditingComment({ ...editingComment, text: e.target.value })}
                            rows={2}
                            className="w-full p-2 border border-pink-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-sm"
                            autoFocus
                          />
                          <div className="flex justify-end space-x-2">
                            <button onClick={handleSaveEditedComment} className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-md hover:bg-green-600 transition">Save</button>
                            <button onClick={() => setEditingComment(null)} className="text-xs bg-gray-300 text-gray-700 px-2.5 py-1 rounded-md hover:bg-gray-400 transition">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-800 break-words">{comment.text}</p>
                          <p className="text-xs text-rose-500 mt-1.5 text-right">
                            - {comment.author} on {comment.date}
                          </p>
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                            <button onClick={() => handleEditComment(comment.id, comment.text)} className="p-1 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-100/50" aria-label="Edit comment">
                              <PencilIcon className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteComment(comment.id)} className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100/50" aria-label="Delete comment">
                              <TrashIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mb-4 italic">No comments yet. Be the first to share your thoughts!</p>
              )}
              
              {(!editingComment) && ( 
                <div className="space-y-3 border-t border-rose-200 pt-4">
                  <div>
                      <label htmlFor="commentAuthor" className="block text-sm font-medium text-gray-700 mb-1">Your Name:</label>
                      <input
                        type="text"
                        id="commentAuthor"
                        value={newCommentAuthor}
                        onChange={(e) => setNewCommentAuthor(e.target.value)}
                        placeholder="Your name"
                        className="w-full p-2 border border-rose-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-sm transition-shadow focus:ring-2"
                      />
                    </div>
                  <div>
                    <label htmlFor="newCommentText" className="block text-sm font-medium text-gray-700 mb-1">Add a loving comment:</label>
                    <textarea
                      id="newCommentText"
                      rows={3}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Write your thoughts here..."
                      className="w-full p-2 border border-rose-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-sm transition-shadow focus:ring-2"
                    />
                  </div>
                  <button
                    onClick={handleAddComment}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-2.5 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    disabled={!newCommentText.trim() || !newCommentAuthor.trim()}
                  >
                    <HeartIcon className="w-4 h-4 inline mr-1.5" /> Add Comment
                  </button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GalleryPage;
