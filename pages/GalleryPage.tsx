import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Photo } from '../types';
import PhotoCard from '../components/PhotoCard';
import Modal from '../components/Modal';
import AnimatedText from '../components/AnimatedText';
import { HeartIcon, PencilIcon, TrashIcon, PlusIcon, UploadIcon } from '../components/Icons';

// --- Firebase Imports ---
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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

  // --- 1. Fetch Photos from Firebase ---
  useEffect(() => {
    const fetchPhotos = async () => {
      const photosQuery = query(collection(db, "photos"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(photosQuery);
      const photosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Photo[];
      setPhotos(photosData);
    };

    fetchPhotos().catch(console.error);
  }, []);

  const openDetailModal = useCallback((photoToOpen: Photo) => {
    const currentVersionOfPhoto = photos.find(p => p.id === photoToOpen.id);
    setSelectedPhoto(currentVersionOfPhoto || photoToOpen);
    setIsDetailModalOpen(true);
    setNewCommentText('');
    setNewCommentAuthor('');
    setEditingComment(null);
  }, [photos]);

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

  // --- 2. Add New Photo to Firebase ---
  const handleAddPhoto = async () => {
    if (!newPhotoFile) {
      alert("Please select an image file.");
      return;
    }

    const imageRef = ref(storage, `images/${newPhotoFile.name + Date.now()}`);

    try {
      await uploadBytes(imageRef, newPhotoFile);
      const downloadURL = await getDownloadURL(imageRef);

      const newPhotoData = {
        src: downloadURL,
        alt: newPhotoCaption.trim() || 'A beautiful new memory',
        caption: newPhotoCaption.trim(),
        comments: [],
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "photos"), newPhotoData);
      
      // Update state to show new photo immediately
      setPhotos(prevPhotos => [{ id: docRef.id, ...newPhotoData, comments: [] }, ...prevPhotos]);

    } catch (error) {
      console.error("Error adding photo:", error);
      alert("Failed to upload photo.");
    }

    setIsAddPhotoModalOpen(false);
    setNewPhotoFile(null);
    setNewPhotoPreviewUrl('');
    setNewPhotoCaption('');
  };

  // --- 3. Delete Photo from Firebase ---
  const handleDeletePhoto = async (photoId: string, photoSrc: string) => {
    if (window.confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "photos", photoId));
        const imageRef = ref(storage, photoSrc);
        await deleteObject(imageRef);
        setPhotos(photos.filter(photo => photo.id !== photoId));
        if (selectedPhoto && selectedPhoto.id === photoId) {
          closeModal();
        }
      } catch (error) {
        console.error("Error deleting photo:", error);
        alert("Failed to delete photo. It may have already been removed.");
      }
    }
  };

  // --- Comment logic still uses local state for now, but will be updated next ---
  const handleAddComment = useCallback(async () => {
    if (!newCommentText.trim() || !newCommentAuthor.trim() || !selectedPhoto) return;

    const newCommentObj = {
      id: `comment-${Date.now()}`,
      text: newCommentText,
      author: newCommentAuthor,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    const updatedComments = [...(selectedPhoto.comments || []), newCommentObj];
    const photoRef = doc(db, "photos", selectedPhoto.id);
    await updateDoc(photoRef, { comments: updatedComments });

    const updatedPhotos = photos.map(p => p.id === selectedPhoto.id ? { ...p, comments: updatedComments } : p);
    setPhotos(updatedPhotos);
    setSelectedPhoto({ ...selectedPhoto, comments: updatedComments });
    setNewCommentText('');
    setNewCommentAuthor('');
  }, [newCommentText, newCommentAuthor, selectedPhoto, photos]);
  
  // NOTE: The rest of the comment logic (edit, delete) will need a similar update to work with Firebase.
  // For now, we are focusing on getting the core photo functionality working.
  
  const memoizedPhotos = useMemo(() => {
    return photos.map((photo, index) => (
      <div key={photo.id} className="animate-fadeInUp-global" style={{animationDelay: `${index * 0.1}s`}}>
        <PhotoCard
          photo={photo}
          onClick={() => openDetailModal(photo)}
          onDelete={() => handleDeletePhoto(photo.id, photo.src)} // Pass id and src
        />
      </div>
    ));
  }, [photos, openDetailModal]);

  // The rest of your component remains the same...
  return (
    <div className="py-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-600 mb-6 py-2">
        <AnimatedText text="Our Photo Album" delay={60} />
      </h1>
      <p className="text-center text-gray-700 mb-8 max-w-xl mx-auto leading-relaxed">
        A collection of moments that tell our story. Each picture holds a thousand unsaid words and a million feelings.
      </p>
      
      <div className="text-center mb-10">
        <button
          onClick={openAddPhotoModal}
          disabled={isAddPhotoModalOpen}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Add New Photo
        </button>
      </div>

      {photos.length === 0 ? (
        <p className="text-center text-gray-500 italic text-lg mt-8">Your gallery is empty. Add a photo to begin!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 px-2">
          {memoizedPhotos}
        </div>
      )}

      {/* --- Modals remain the same --- */}
      <Modal
        isOpen={isAddPhotoModalOpen}
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
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0"
            />
          </div>
          {newPhotoPreviewUrl && (
            <div className="my-3 text-center">
              <img src={newPhotoPreviewUrl} alt="Preview" className="max-h-48 w-auto inline-block rounded-md shadow-md" />
            </div>
          )}
          <div>
            <label htmlFor="newPhotoCaption" className="block text-sm font-medium text-gray-700 mb-1">Caption:</label>
            <input
              ref={captionInputRef}
              type="text"
              id="newPhotoCaption"
              value={newPhotoCaption}
              onChange={(e) => setNewPhotoCaption(e.target.value)}
              placeholder="e.g., Our special day!"
              className="w-full p-2.5 border border-rose-300 rounded-md"
            />
          </div>
          <button
            onClick={handleAddPhoto}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold py-2.5 px-4 rounded-md"
            disabled={!newPhotoFile}
          >
            <UploadIcon className="w-5 h-5 inline mr-2" /> Add Photo
          </button>
        </div>
      </Modal>

      {selectedPhoto && (
        <Modal isOpen={isDetailModalOpen} onClose={closeModal} title={selectedPhoto.caption || "Our Memory"} size="xl">
          {/* Your detail modal content remains the same, but will now show comments fetched from Firebase */}
          <div>
            <img src={selectedPhoto.src} alt={selectedPhoto.alt} className="w-full max-h-96 object-contain rounded-md mb-4" />
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">{selectedPhoto.caption}</h2>
              <p className="text-gray-600">{selectedPhoto.alt}</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Comments</h3>
              <ul className="mb-4">
                {(selectedPhoto.comments || []).map((comment: any) => (
                  <li key={comment.id} className="mb-2">
                    <span className="font-semibold">{comment.author}:</span> {comment.text}
                    <span className="text-xs text-gray-400 ml-2">{comment.date}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Your name"
                  value={newCommentAuthor}
                  onChange={e => setNewCommentAuthor(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <button
                  onClick={handleAddComment}
                  className="bg-rose-500 text-white px-3 py-1 rounded hover:bg-rose-600"
                  disabled={!newCommentText.trim() || !newCommentAuthor.trim()}
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GalleryPage;