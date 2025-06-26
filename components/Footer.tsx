
import React from 'react';
import { HeartIcon } from './Icons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 text-rose-700 py-8 text-center shadow-top-lg mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center mb-2">
          <HeartIcon className="h-6 w-6 text-pink-500 mr-2 animate-pulse" style={{animationDuration: '1.5s'}} />
          <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500">
            Made with all my love, for the love of my life.
          </p>
          <HeartIcon className="h-6 w-6 text-pink-500 ml-2 animate-pulse" style={{animationDuration: '1.5s', animationDelay: '0.5s'}} />
        </div>
        <p className="text-xs text-gray-600">&copy; {currentYear} Our Endless Journey. All Rights Reserved (by us!).</p>
      </div>
    </footer>
  );
};

export default Footer;