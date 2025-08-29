import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedText from '../components/AnimatedText';
import { HeartIcon, SparkleIcon } from '../components/Icons';

const HomePage: React.FC = () => {
  return (
    <div className="relative text-center py-12 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] overflow-hidden"> {/* Adjusted min-height & overflow */}
      {/* Subtle Background Decorative Elements */}
      <HeartIcon className="absolute -top-20 -left-24 w-72 h-72 text-rose-300/30 animate-slowFloat" style={{ animationDelay: '0s', animationDuration: '20s' }} />
      <SparkleIcon className="absolute -bottom-20 -right-20 w-60 h-60 text-yellow-300/20 animate-slowFloat" style={{ animationDelay: '5s', animationDuration: '25s', transform: 'rotate(45deg)' }}/>
      <HeartIcon className="absolute top-1/2 left-1/4 w-40 h-40 text-pink-300/20 animate-slowFloat" style={{ animationDelay: '10s', animationDuration: '18s' }} />


      <div className="relative mb-10 group"> {/* Added group for image hover effects */}
        <HeartIcon className="absolute -top-10 -left-12 w-24 h-24 text-rose-400/80 animate-heartBeatSoft" style={{animationDuration: '3s'}} />
        <SparkleIcon className="absolute -bottom-10 -right-10 w-20 h-20 text-yellow-400/80 animate-twinkle" style={{animationDuration: '3.5s'}}/>
        
        <div className="relative p-1.5 rounded-[calc(1.25rem+6px)] bg-gradient-to-br from-pink-300 via-rose-200 to-purple-300 shadow-xl group-hover:shadow-pink-400/60 transition-all duration-300 transform group-hover:scale-103" style={{ borderRadius: '50%' }}>
          <img 
            src="/special/lovers-wall.png" // Ensure this path is correct
            alt="A photo of us, happy and in love" 
            className="rounded-3xl w-48 h-48 sm:w-56 sm:h-56 object-cover border-4 border-white/80 transform group-hover:scale-[1.02] transition-transform duration-500"
            style={{borderRadius: '50%'}}
          />
        </div>
      </div>

      <h1 
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-600 mb-6 py-2"
        style={{ textShadow: '1px 1px 3px rgba(220, 38, 119, 0.2), 0 0 8px rgba(255, 255, 255, 0.5)' }}
      >
        <AnimatedText text="To  My  Dearest  Love," delay={70} />
      </h1>
      
      <p className="text-lg sm:text-xl text-gray-700/90 max-w-2xl mx-auto mb-12 leading-relaxed backdrop-blur-[2px] p-2 rounded-md">
        <AnimatedText 
          text={`
            Happy Birthday! This little corner of the web is just for you, a place to 
            celebrate us, our memories, and the beautiful journey ahead. 
            Here's to many more years of love, laughter, and adventure.
          `}
          delay={30}
        />
      </p>

      <div className="space-y-4 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row items-center">
        <Link 
          to="/gallery" 
          className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold py-3.5 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg flex items-center justify-center group h-[52px]"
        >
          <span className="mr-2 text-2xl">✨</span> Our Gallery
        </Link>
        <Link 
          to="/notes" 
          className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3.5 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg flex items-center justify-center group h-[52px]"
        >
          Sweet Notes <HeartIcon className="w-5 h-5 ml-2 group-hover:animate-wiggleSmall" />
        </Link>
      </div>
      
      <div className="mt-16 w-full max-w-lg mx-auto">
        <div className="my-3 h-px w-2/3 mx-auto bg-gradient-to-r from-transparent via-pink-300/70 to-transparent"></div>
        <p className="text-md text-rose-700/80 italic py-3 px-4">
          "Every love story is beautiful, but ours is, and will always be, my absolute favorite."
        </p>
        <div className="my-3 h-px w-2/3 mx-auto bg-gradient-to-r from-transparent via-pink-300/70 to-transparent"></div>
      </div>
    </div>
  );
};

export default HomePage;