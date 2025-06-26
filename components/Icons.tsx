import React from 'react'; // Added React import for CSSProperties

interface IconProps {
  className?: string;
  style?: React.CSSProperties; // Added optional style prop
}

export const HeartIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    style={style} // Pass style to svg
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    style={style} // Pass style to svg
  >
    <path d="M12 2l1.09 3.43L16.5 6l-2.5 2.25L15.18 12 12 9.87 8.82 12l1.18-3.75L7.5 6l3.41-.57L12 2zm0 8l-1.09-3.43L7.5 6l2.5 2.25L8.82 12 12 9.87 15.18 12l-1.18-3.75L16.5 6l-3.41.57L12 10zm0 8l1.09 3.43L16.5 22l-2.5-2.25L15.18 24 12 21.87 8.82 24l1.18-3.75L7.5 22l3.41.57L12 18z" />
  </svg>
);

export const PencilIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    style={style}
  >
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    style={style}
  >
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    style={style}
  >
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    style={style}
  >
    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
  </svg>
);