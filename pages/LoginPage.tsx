import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedText from '../components/AnimatedText';
import { HeartIcon } from '../components/Icons';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // This function is now async to handle the Firebase login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Await the login result from the AuthContext
    const success = await login(email, password); 
    
    if (success) {
      navigate('/');
    } else {
      setError('Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="relative text-center py-12 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] overflow-hidden">
      <div className="relative mb-10">
        <HeartIcon className="absolute -top-10 -left-12 w-24 h-24 text-rose-400/80 animate-heartBeatSoft" style={{animationDuration: '3s'}} />
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-600 mb-6 py-2"
          style={{ textShadow: '1px 1px 3px rgba(220, 38, 119, 0.2), 0 0 8px rgba(255, 255, 255, 0.5)' }}
        >
          <AnimatedText text="Welcome Back" delay={70} />
        </h1>
      </div>

      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white/80 p-8 rounded-2xl shadow-xl backdrop-blur-md border border-pink-100">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-left">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div className="mb-8">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 text-left">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-rose-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-shadow"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3.5 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg flex items-center justify-center group"
        >
          Login <HeartIcon className="w-5 h-5 ml-2 group-hover:animate-wiggleSmall" />
        </button>
      </form>
    </div>
  );
};

export default LoginPage;