import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import toast, { Toaster } from 'react-hot-toast';
import { FaEnvelope, FaArrowLeft, FaLock } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    
    setLoading(true);
    const toastId = toast.loading("Verifying account...");

    try {
      // 1. ✅ Check if Email Exists in 'adminDetails' OR 'users' Collection
      const adminQuery = query(collection(db, "adminDetails"), where("email", "==", email));
      const userQuery = query(collection(db, "users"), where("email", "==", email));

      const [adminSnapshot, userSnapshot] = await Promise.all([
        getDocs(adminQuery),
        getDocs(userQuery)
      ]);

      if (adminSnapshot.empty && userSnapshot.empty) {
        toast.error("Account not found in our records.", { 
          id: toastId,
          style: { background: '#334155', color: '#fff', border: '1px solid #ef4444' }
        });
        setLoading(false);
        return;
      }

      // 2. ✅ If Email Found, Send Firebase Reset Link
      await sendPasswordResetEmail(auth, email);
      
      toast.success("Reset link sent! Check your inbox.", { 
        id: toastId,
        duration: 5000,
        style: { background: '#334155', color: '#fff', border: '1px solid #4ade80' }
      });
      
      setEmail('');

    } catch (error) {
      console.error("Reset Error:", error);
      let msg = error.message;
      if (error.code === 'auth/user-not-found') msg = "No account found with this email.";
      
      toast.error(msg, { 
        id: toastId,
        style: { background: '#334155', color: '#fff', border: '1px solid #ef4444' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 relative flex items-center justify-center p-4 font-sans overflow-hidden">
      
      {/* --- Ambient Background Effects --- */}
      {/* Updated: w-[500px] -> w-125, h-[500px] -> h-125 */}
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      {/* Updated: w-[400px] -> w-100, h-[400px] -> h-100 */}
      <div className="absolute bottom-[-20%] right-[-10%] w-100 h-100 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <Toaster position="top-center" />

      {/* --- Main Card --- */}
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10 transition-all duration-300 hover:border-white/20 hover:shadow-blue-900/10">
        
        {/* Header */}
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <FaLock className="text-blue-400 text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
                Enter the email associated with your account and we'll send you a link to reset your password.
            </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
                <FaEnvelope className="absolute top-3.5 left-4 text-slate-500 text-sm group-focus-within:text-blue-400 transition-colors" />
                <input 
                type="email" 
                placeholder="name@company.com" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl p-3 pl-11 text-white placeholder:text-slate-600 focus:border-blue-500 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm" 
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            // Updated: bg-gradient-to-r -> bg-linear-to-r
            className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
              {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                </>
              ) : (
                "Send Reset Link"
              )}
          </button>

        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors group">
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Login
            </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;