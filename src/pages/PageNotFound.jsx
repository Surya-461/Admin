 import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGhost, FaArrowLeft, FaHome } from 'react-icons/fa';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* --- Ambient Background Glow --- */}
      {/* Blue glow top-left */}
      <div className="absolute top-0 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      {/* Purple glow bottom-right */}
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-lg w-full text-center">
        
        {/* Animated Ghost Icon */}
        <div className="inline-flex justify-center items-center mb-8">
          <div className="relative">
            {/* Pulsing halo behind the icon */}
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
            {/* Ghost Icon with standard Tailwind bounce animation */}
            <FaGhost className="text-7xl md:text-8xl text-blue-400 relative z-10 animate-bounce drop-shadow-2xl" />
          </div>
        </div>

        {/* 404 Heading */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-600 tracking-tighter mb-4">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Lost in the Void?
        </h2>
        <p className="text-gray-400 text-sm md:text-base mb-10 max-w-xs mx-auto leading-relaxed">
          The page you are looking for doesn't exist, has been moved, or simply vanished into thin air.
        </p>

        {/* Buttons - Stack on mobile, Row on desktop */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          
          {/* Go Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 font-medium hover:text-white hover:border-gray-700 hover:bg-gray-800 transition-all duration-200 active:scale-95"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Go Back</span>
          </button>

          {/* Home Button */}
          <button 
            onClick={() => navigate('/')} 
            className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-[1.02] transition-all duration-200 active:scale-95"
          >
            <FaHome />
            <span>Back to Home</span>
          </button>

        </div>
      </div>

      {/* Simple Footer */}
      <div className="absolute bottom-8 text-[10px] text-gray-600 font-mono tracking-widest uppercase opacity-50">
        Error Code: 404_NOT_FOUND
      </div>
    </div>
  );
};

export default PageNotFound;