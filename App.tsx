import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import NotesPage from './pages/NotesPage';
import ProposalPage from './pages/ProposalPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
// We do NOT import AuthProvider here anymore

const App: React.FC = () => {
  return (
    // The extra <AuthProvider> wrapper has been removed from this file.
    // The correct one is in index.tsx.
    <HashRouter>
      <div className="flex flex-col min-h-screen text-gray-700">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/proposal" element={<ProposalPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;