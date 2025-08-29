export interface Photo {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  comments?: Array<{ id: string; text: string; date: string; author: string }>;
  createdAt?: any; // Added for Firestore timestamp
}

export interface Note {
  id:string;
  author: string;
  message: string;
  date: string;
  title?: string;
  createdAt?: any; // Added for Firestore timestamp
}