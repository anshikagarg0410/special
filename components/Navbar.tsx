import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const navLinkClasses = (path: string) =>
    `px-3 py-2 sm:px-4 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75 ${
      location.pathname === path
        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
        : 'text-rose-700 hover:bg-rose-200/70 hover:text-rose-900'
    }`;

  return (
    <nav className="bg-gradient-to-r from-rose-100 via-pink-100 to-purple-100 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center group">
            <HeartIcon className="h-10 w-10 text-rose-500 group-hover:text-pink-600 transition-colors duration-300 transform group-hover:scale-110" />
            <span className="ml-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-600 group-hover:opacity-80 transition-opacity duration-300 tracking-tight">
              Our Special Place
            </span>
          </Link>
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <Link to="/" className={navLinkClasses('/')}>Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/gallery" className={navLinkClasses('/gallery')}>Gallery</Link>
                <Link to="/notes" className={navLinkClasses('/notes')}>Notes</Link>
                <Link to="/proposal" className={`${navLinkClasses('/proposal')} bg-pink-400 text-white hover:bg-pink-500`}>
                  <span className="hidden sm:inline">Special Letter</span>
                  <span className="sm:hidden">Letter</span>
                </Link>
                <button onClick={logout} className={navLinkClasses('/logout')}>Logout</button>
              </>
            )}
            {!isAuthenticated && (
              <Link to="/login" className={navLinkClasses('/login')}>Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;