
import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import NotesPage from './pages/NotesPage';
import ProposalPage from './pages/ProposalPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { HeartIcon } from './components/Icons';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen text-gray-700">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/proposal" element={<ProposalPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
    