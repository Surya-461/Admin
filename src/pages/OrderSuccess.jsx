import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaStore, FaHome, FaCopy, FaCheck } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OrderSuccess = () => {
  const location = useLocation();
  const { paymentId, storeId, amount, planName } = location.state || {};
  
  // State for window size to handle Confetti resizing
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // State for copy button feedback
  const [copied, setCopied] = useState(false);

  // Handle Window Resize for Confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCopyStoreId = () => {
    if (storeId) {
      navigator.clipboard.writeText(storeId);
      setCopied(true);
      toast.success("Store ID copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!paymentId) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-slate-400">No order details found.</p>
        <Link to="/" className="px-6 py-2 bg-blue-600 rounded-full font-bold hover:bg-blue-500 transition">Go Home</Link>
      </div>
    );
  }

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 15,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const checkmarkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { type: "spring", stiffness: 200, delay: 0.2 } 
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* 1. Confetti Layer */}
      <Confetti 
        width={windowSize.width} 
        height={windowSize.height} 
        numberOfPieces={300} 
        recycle={false} // Stops generating after a while
        gravity={0.15}
      />

      {/* 2. Background Glow */}
      {/* Updated: w-[600px] -> w-150, h-[600px] -> h-150 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 3. Main Card */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-lg w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 text-center"
      >
        
        {/* Animated Checkmark */}
        <motion.div 
          variants={checkmarkVariants}
          // Updated: bg-gradient-to-br -> bg-linear-to-br
          className="w-24 h-24 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.5)]"
        >
          <FaCheckCircle className="text-white text-5xl drop-shadow-md" />
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl font-extrabold mb-2 text-white tracking-tight">
          Payment Successful!
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-slate-400 mb-8 text-lg">
          Hooray! Your store is now officially active.
        </motion.p>

        {/* Receipt Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-slate-950/60 rounded-2xl p-6 border border-white/5 mb-8 text-left space-y-4 shadow-inner"
        >
           <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Paid</span>
              <span className="text-2xl font-bold text-emerald-400">₹{amount}</span>
           </div>

           <div className="space-y-3">
              <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Subscription Plan</span>
                 <span className="text-white font-semibold">{planName}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                 <span className="text-slate-500">Transaction ID</span>
                 <span className="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded border border-white/5">{paymentId}</span>
              </div>
              
              {/* Important Store ID Section */}
              <div className="flex justify-between text-sm items-center bg-blue-500/10 -mx-2 p-2 rounded-lg border border-blue-500/20">
                 <span className="text-blue-200 font-medium ml-2">Your Store ID</span>
                 <div className="flex items-center gap-2">
                    <span className="text-white font-bold font-mono tracking-wide">{storeId}</span>
                    <button 
                      onClick={handleCopyStoreId}
                      className="text-slate-400 hover:text-white transition p-1"
                      title="Copy Store ID"
                    >
                      {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                    </button>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
           <Link 
             to="/buyer-dashboard" 
             // Updated: bg-gradient-to-r -> bg-linear-to-r
             className="group w-full py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
           >
             <FaStore className="group-hover:rotate-12 transition-transform" /> 
             Go to Dashboard
           </Link>
           
           <Link 
             to="/" 
             className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
           >
             <FaHome /> Back to Home
           </Link>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default OrderSuccess;