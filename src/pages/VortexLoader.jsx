import React from 'react';

const VortexLoader = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center relative overflow-hidden font-sans z-50">
      
      {/* --- Ambient Background Glow --- */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] pointer-events-none animate-pulse"></div>

      {/* --- Vortex Container --- */}
      <div className="relative flex items-center justify-center w-48 h-48 mb-8">
        
        {/* Ring 1: Outer (Blue, Slow, Clockwise) */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500/30 border-l-transparent animate-spin" 
          style={{ animationDuration: '3s' }}
        ></div>

        {/* Ring 2: Middle (Purple, Medium, Counter-Clockwise) */}
        <div 
          className="absolute inset-2 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-500/30 border-l-transparent animate-spin" 
          style={{ animationDuration: '2s', animationDirection: 'reverse' }}
        ></div>

        {/* Ring 3: Inner (Cyan, Fast, Clockwise) */}
        <div 
          className="absolute inset-6 rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-cyan-400/30 border-l-transparent animate-spin" 
          style={{ animationDuration: '1s' }}
        ></div>

        {/* Center Core: Pulsing Dot */}
        <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_2px_rgba(59,130,246,0.8)] animate-ping opacity-75"></div>
        <div className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_10px_2px_rgba(59,130,246,1)]"></div>
        
      </div>

      {/* --- Loading Text --- */}
      <div className="flex flex-col items-center space-y-2 z-10">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 tracking-[0.2em] uppercase animate-pulse">
          Welcome to GSH Services
        </h2>
        <p className="text-xs text-gray-500 font-mono">
          Make Your Soul Happy
        </p>
      </div>

    </div>
  );
};

export default VortexLoader;