import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // REMOVE or COMMENT OUT the next line:
      // modalRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-4 animate-fadeIn"
      onClick={onClose} // Close on overlay click
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      tabIndex={-1} // Make the overlay focusable
      ref={modalRef}
    >
      <div 
        className={`bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6 rounded-xl shadow-2xl w-full ${sizeClasses[size]} transform animate-scaleUp relative overflow-hidden`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
        style={{ perspective: '1000px' }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-rose-700 transition-colors text-3xl font-light leading-none p-1 rounded-full hover:bg-rose-100/70 z-10"
          aria-label="Close modal"
        >
          &times;
        </button>
        {title && <h2 id="modal-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-600 mb-5 text-center">{title}</h2>}
        <div className="max-h-[80vh] overflow-y-auto pr-1 custom-modal-scrollbar">
          {children}
        </div>
      </div>
      {/* 
        Keyframes and scrollbar styles removed as style jsx global is not standard React.
        Ensure 'animate-fadeIn' and 'animate-scaleUp' classes and their keyframes 
        are defined globally (e.g., in index.html or a global CSS file/Tailwind config).
        The 'custom-modal-scrollbar' styles are removed.
      */}
    </div>
  );
};

export default Modal;