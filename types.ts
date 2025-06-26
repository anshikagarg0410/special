
export interface Photo {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  comments?: Array<{ id: string; text: string; date: string; author: string }>;
}

export interface Note {
  id:string;
  author: string; // This is 'Your Name' in the form
  message: string;
  date: string;
  title?: string; // Optional: for edit modal or future features
}