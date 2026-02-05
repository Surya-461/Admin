import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { db } from '../firebase';
import { 
  FaStore, FaCrown, FaExclamationTriangle, FaCalendarAlt, 
  FaCreditCard, FaReceipt, FaRocket, FaExternalLinkAlt, 
  FaSignInAlt, FaCogs, FaClock, FaTimes, FaHistory, FaRedo, FaHourglassHalf, FaFileInvoiceDollar
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const BuyerDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  
  const [activeSubscription, setActiveSubscription] = useState(null); 
  const [paymentHistory, setPaymentHistory] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Expiry States
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  
  const timerRef = useRef(null);

  // --- Helper: Calculate Expiry Date based on Plan Name ---
  const calculateExpiry = (purchaseDate, planName) => {
    let expiry = new Date(purchaseDate);
    if (planName.toLowerCase().includes("3 year")) {
      expiry.setFullYear(expiry.getFullYear() + 3);
    } else if (planName.toLowerCase().includes("5 year")) {
      expiry.setFullYear(expiry.getFullYear() + 5);
    } else {
      expiry.setFullYear(expiry.getFullYear() + 1); // Default 1 Year
    }
    return expiry;
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!currentUser?.email) {
        setLoading(false); 
        return; 
      }

      try {
        const paymentsRef = collection(db, "subscribed_payments");
        const q = query(paymentsRef, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const allData = querySnapshot.docs.map(doc => {
             const data = doc.data();
             const pDate = data.purchasedAt?.toDate ? data.purchasedAt.toDate() : new Date(data.purchasedAt);
             const eDate = calculateExpiry(pDate, data.planName || "");
             return { ...data, purchaseDate: pDate, expiryDate: eDate };
          });

          // Sort: Newest First
          allData.sort((a, b) => b.purchaseDate - a.purchaseDate);

          setPaymentHistory(allData);

          const latest = allData[0];
          const now = new Date();

          // Check Expiry Status
          if (now > latest.expiryDate) {
            setIsExpired(true);
          } else {
            // --- UPDATED: 24-HOUR WARNING LOGIC ---
            const timeDiff = latest.expiryDate.getTime() - now.getTime();
            const oneDayMs = 24 * 60 * 60 * 1000; // 86,400,000 ms

            // Show if time remaining is positive AND less than 24 hours
            if (timeDiff > 0 && timeDiff < oneDayMs) {
              setShowExpiryWarning(true);
              startCountdown(latest.expiryDate);
            }
          }

          setActiveSubscription(latest);

        } else {
          setActiveSubscription(null);
        }

      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
    return () => { if(timerRef.current) clearInterval(timerRef.current); }
  }, [currentUser]);

  const startCountdown = (expiryDate) => {
    const updateTimer = () => {
      const now = new Date();
      const difference = expiryDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        setShowExpiryWarning(false);
        clearInterval(timerRef.current);
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    updateTimer(); 
    timerRef.current = setInterval(updateTimer, 1000); 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- SCENARIO 1: NO HISTORY ---
  if (!activeSubscription) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/50 border border-white/10 p-12 rounded-3xl text-center">
            <FaExclamationTriangle className="text-amber-500 text-3xl mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">No Active Plan</h2>
            <p className="text-slate-400 mb-8 text-sm">No purchase history found for {currentUser?.email}.</p>
            <Link to="/services" className="block w-full py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-500">View Plans</Link>
        </div>
      </div>
    );
  }

  // --- SCENARIO 2: EXPIRED (Blocking Screen + History) ---
  if (isExpired) {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-rose-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-rose-600/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl w-full relative z-10 animate-fade-in-up mt-10">
           
           {/* Header Message */}
           <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-400 font-bold text-sm mb-4">
                 <FaHistory /> Subscription Expired
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Access Suspended</h1>
              <p className="text-slate-400 max-w-lg mx-auto text-lg">
                 Your subscription expired on <span className="text-white font-mono font-bold bg-white/10 px-2 py-0.5 rounded">{activeSubscription.expiryDate.toLocaleDateString()}</span>.
              </p>
           </div>

           <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Previous Plan Details Card */}
              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 opacity-75 hover:opacity-100 transition-opacity">
                  <h3 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2">
                     <FaStore /> Previous Plan
                  </h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-slate-500 text-sm">Plan Name</span>
                        <span className="font-bold text-white">{activeSubscription.planName}</span>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-slate-500 text-sm">Store Name</span>
                        <span className="font-bold text-white">{activeSubscription.storeName}</span>
                     </div>
                     <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-slate-500 text-sm">Amount Paid</span>
                        <span className="font-bold text-white">₹{Number(activeSubscription.amount).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center py-3">
                        <span className="text-slate-500 text-sm">Store ID</span>
                        <span className="font-mono text-blue-300">{activeSubscription.storeId}</span>
                     </div>
                  </div>
              </div>

              {/* Renewal Action Card */}
              <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-blue-500/30 rounded-3xl p-8 flex flex-col justify-center text-center shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px]"></div>
                 <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
                       <FaRedo className="animate-spin-slow" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Renew Access</h3>
                    <p className="text-slate-400 text-sm mb-8">
                       Restore full access to the Dashboard and POS immediately.
                    </p>
                    <Link to="/services" className="w-full block py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all transform hover:-translate-y-1">
                       View Renewal Plans
                    </Link>
                 </div>
              </div>
           </div>

           {/* --- PREVIOUS PLAN HISTORY (IN EXPIRED VIEW) --- */}
           <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-slate-400 mb-6 flex items-center gap-2">
                 <FaHistory /> Full Subscription History
              </h3>
              <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
                 {paymentHistory.map((historyItem, index) => (
                    <div key={index} className="bg-slate-950/30 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                             <FaFileInvoiceDollar />
                          </div>
                          <div>
                             <p className="font-bold text-slate-300 text-sm">{historyItem.planName}</p>
                             <p className="text-[10px] text-slate-600 font-mono">{historyItem.paymentId}</p>
                          </div>
                       </div>
                       <div className="flex gap-6 text-xs text-slate-500">
                          <div>
                             <span className="block text-[10px] uppercase">Purchased</span>
                             <span className="text-slate-300">{historyItem.purchaseDate.toLocaleDateString()}</span>
                          </div>
                          <div>
                             <span className="block text-[10px] uppercase">Expired</span>
                             <span className="text-rose-400">{historyItem.expiryDate.toLocaleDateString()}</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </div>
    );
  }

  // --- SCENARIO 3: ACTIVE DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pb-20 relative overflow-x-hidden">
      <Toaster position="top-center" />

      {/* --- 24-HOUR POPUP --- */}
      {showExpiryWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-rose-500 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(225,29,72,0.2)] relative animate-bounce-in text-center">
            <button onClick={() => setShowExpiryWarning(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><FaTimes size={20}/></button>
            <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500 animate-pulse">
                <FaHourglassHalf size={30} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Critical Expiry Warning</h3>
            <div className="my-6 p-4 bg-black/30 rounded-xl border border-rose-500/20">
               <span className="text-5xl font-mono font-bold text-rose-400 tracking-tight">{timeLeft}</span>
               <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Time Remaining</p>
            </div>
            <p className="text-slate-300 mb-8 text-sm">Your plan expires in less than 24 hours. Renew immediately to avoid service disruption.</p>
            <Link to="/services" className="block w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg">Renew Now</Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900/60 border-b border-white/5 px-6 py-6 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-2xl border border-blue-500/20"><FaStore /></div>
            <div>
              <h1 className="text-xl font-bold">{activeSubscription.storeName}</h1>
              <p className="text-xs text-slate-400 font-mono">ID: {activeSubscription.storeId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-bold text-xs uppercase">Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* --- ACTIVE SUBSCRIPTION CARD --- */}
        <div className="bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-white/10 rounded-3xl p-1 mb-10 shadow-2xl relative overflow-hidden">
           <div className="bg-slate-950/80 backdrop-blur-md rounded-[20px] p-8 relative z-10">
             <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
                 <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest bg-blue-500/10 w-fit px-3 py-1.5 rounded-full border border-blue-500/20">
                       <FaCrown /> Active Plan
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400">
                      {activeSubscription.planName}
                    </h2>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-3/5">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xl"><FaCreditCard /></div>
                       <div>
                         <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Paid Amount</p>
                         <p className="text-2xl font-bold text-white">₹{Number(activeSubscription.amount).toLocaleString()}</p>
                       </div>
                    </div>
                    
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center gap-4 relative overflow-hidden">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${showExpiryWarning ? 'bg-rose-500/10 text-rose-500 animate-pulse' : 'bg-blue-500/10 text-blue-400'}`}>
                         <FaClock />
                       </div>
                       <div>
                         <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Expires On</p>
                         {showExpiryWarning ? (
                            <p className="text-sm font-bold text-rose-400 font-mono">{timeLeft}</p>
                         ) : (
                            <p className="text-sm font-bold text-white font-mono">{activeSubscription.expiryDate.toLocaleDateString()}</p>
                         )}
                       </div>
                    </div>

                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center gap-4 sm:col-span-2">
                       <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-xl shrink-0"><FaCalendarAlt /></div>
                       <div className="flex justify-between w-full pr-4">
                          <div>
                             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Purchased Date</p>
                             <p className="text-sm font-mono text-slate-200">{activeSubscription.purchaseDate.toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Transaction ID</p>
                             <p className="text-sm font-mono text-slate-200 truncate max-w-37.5">{activeSubscription.paymentId}</p>
                          </div>
                       </div>
                    </div>
                 </div>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* --- LEFT COL: SUBSCRIPTION HISTORY --- */}
           <div className="lg:col-span-2 bg-slate-900/60 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                 <FaHistory className="text-slate-500" /> Subscription History
              </h3>
              
              <div className="space-y-4">
                 {paymentHistory.map((historyItem, index) => (
                    <div key={index} className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                             <FaFileInvoiceDollar />
                          </div>
                          <div>
                             <p className="font-bold text-white text-sm">{historyItem.planName}</p>
                             <p className="text-xs text-slate-500 font-mono">ID: {historyItem.paymentId.slice(0, 12)}...</p>
                          </div>
                       </div>

                       <div className="flex items-center justify-between sm:gap-8 w-full sm:w-auto">
                          <div className="text-right sm:text-left">
                             <p className="text-[10px] text-slate-500 uppercase">Purchased</p>
                             <p className="text-xs font-mono text-slate-300">{historyItem.purchaseDate.toLocaleDateString()}</p>
                          </div>
                          <div className="text-right sm:text-left">
                             <p className="text-[10px] text-slate-500 uppercase">Expires</p>
                             <p className="text-xs font-mono text-slate-300">{historyItem.expiryDate.toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-emerald-400 text-sm">₹{Number(historyItem.amount).toLocaleString()}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* --- RIGHT COL: LAUNCH APP & INSTRUCTIONS --- */}
           <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Launch Card */}
              <div className="bg-linear-to-br from-blue-900/40 to-slate-900/40 border border-blue-500/30 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px]"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/10">
                    <FaRocket className="text-3xl text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Ready to Launch?</h3>
                  <p className="text-blue-200/70 text-sm mb-6">Your store environment is ready.</p>
                  <a 
                          href="https://premium-ruby-rho.vercel.app/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    Open Dashboard <FaExternalLinkAlt size={12} />
                  </a>
                </div>
              </div>

              {/* Instructions Card */}
              <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6">
                 <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                    <FaCogs className="text-blue-400" /> How to Start
                 </h3>
                 <div className="space-y-6 relative">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-800"></div>
                    <Step number="1" title="Access App" desc="Click the Launch button above." />
                    <Step number="2" title="Login" desc={`Use: ${currentUser.email}`} />
                    <Step number="3" title="Sell" desc="Products are auto-linked." />
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

// Helper for Steps
const Step = ({ number, title, desc }) => (
  <div className="flex gap-4 relative z-10">
     <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg ring-2 ring-slate-900">
       {number}
     </div>
     <div>
       <h4 className="text-white font-bold text-xs mb-1">{title}</h4>
       <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
     </div>
  </div>
);

export default BuyerDashboard;