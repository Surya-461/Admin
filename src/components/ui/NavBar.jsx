import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaThLarge,
  FaBell,
  FaUserEdit,
  FaChevronRight,
  FaCreditCard,
  FaReceipt,
  FaHome,       // Added
  FaServicestack, // Added
  FaInfoCircle, // Added
  FaEnvelopeOpenText // Added
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, where, limit } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/userSlice';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { currentUser, userData, role } = useSelector((state) => state.user);

  // Active Link Helper
  const isActive = (path) => location.pathname === path;

  // Close dropdowns on outside click
  useEffect(() => {
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Real-time Notification Listener
  useEffect(() => {
    if (!currentUser?.email) {
        setNotifications([]);
        setUnreadCount(0);
        return;
    }

    const paymentsRef = collection(db, "subscribed_payments");
    const q = role === 'admin' 
      ? query(paymentsRef, where("status", "==", "succeeded"), orderBy("purchasedAt", "desc"), limit(10))
      : query(paymentsRef, where("email", "==", currentUser.email), orderBy("purchasedAt", "desc"), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(newNotifs);
      setUnreadCount(newNotifs.length); 
    }, (err) => console.error("Notif Error:", err));

    return () => unsubscribe();
  }, [currentUser, role]);

  const dashboardPath = role === 'admin' ? "/admin-dashboard" : "/buyer-dashboard";

  const handleLogout = async () => {
    try {
      setProfileOpen(false);
      setMenuOpen(false);
      await signOut(auth);
      dispatch(logoutUser());
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  const displayName = userData?.firstName 
    ? `${userData.firstName} ${userData.lastName || ''}` 
    : currentUser?.email?.split('@')[0] || "Guest";

  return (
    <>
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent z-50">
          GSH Services
        </Link>

        {/* DESKTOP NAV (Hidden on Mobile) */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          {[
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" }
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`${isActive(item.path) ? "text-blue-400" : "text-slate-300"} hover:text-white transition relative py-1`}
            >
              {item.name}
              {isActive(item.path) && (
                <motion.span layoutId="activeNav" className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-500" />
              )}
            </Link>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 md:gap-4">
          {!currentUser ? (
            <button onClick={() => navigate("/login")} className="text-slate-300 hover:text-white transition p-2">
              <FaUserCircle size={28} />
            </button>
          ) : (
            <>
              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="text-slate-300 hover:text-white transition p-2">
                  <FaBell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold border-2 border-slate-950">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-3 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-slate-900">
                        <h4 className="font-bold text-white text-xs uppercase tracking-widest">Notifications</h4>
                        <button className="text-[10px] text-blue-400 font-bold hover:underline" onClick={() => setUnreadCount(0)}>CLEAR</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-500 text-sm italic">No new activity</div>
                        ) : (
                          notifications.map((notif) => (
                            <div key={notif.id} className="p-4 hover:bg-white/5 transition border-b border-white/5 last:border-0 cursor-pointer" onClick={() => { navigate(dashboardPath); setShowNotifications(false); }}>
                                <div className="flex gap-3">
                                    <div className={`p-2 rounded-xl shrink-0 ${role === 'admin' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        {role === 'admin' ? <FaCreditCard size={14} /> : <FaReceipt size={14} />}
                                    </div>
                                    <div>
                                        <p className="text-xs text-white leading-tight font-medium">
                                            {role === 'admin' ? `${notif.customerName} paid for ${notif.planName}` : `Your payment for ${notif.planName} was successful`}
                                        </p>
                                        <p className="text-[10px] text-slate-500 mt-1">₹{notif.amount} • {notif.purchasedAt?.seconds ? new Date(notif.purchasedAt.seconds * 1000).toLocaleDateString() : 'Recent'}</p>
                                    </div>
                                </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen(!profileOpen)} className="w-9 h-9 rounded-xl overflow-hidden border border-blue-500/50 bg-slate-800 flex items-center justify-center hover:scale-105 transition active:scale-95">
                  {userData?.profileImage ? (
                    <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-400 font-bold">{displayName[0]}</div>
                  )}
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 mt-3 w-60 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-4 border-b border-white/5 bg-linear-to-br from-slate-800/50 to-transparent">
                        <p className="text-white font-bold text-sm truncate">{displayName}</p>
                        <p className="text-slate-500 text-[10px] truncate">{currentUser?.email}</p>
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${role === 'admin' ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"}`}>{role}</span>
                      </div>
                      <div className="p-1">
                        <button onClick={() => { navigate(dashboardPath); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/5 rounded-xl transition font-bold"><FaThLarge className="text-blue-500" /> DASHBOARD</button>
                        <button onClick={() => { navigate("/profile-edit"); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/5 rounded-xl transition font-bold"><FaUserEdit className="text-blue-500" /> EDIT PROFILE</button>
                        <div className="h-px bg-white/5 my-1 mx-2"></div>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition font-bold uppercase"><FaSignOutAlt /> SIGN OUT</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* MOBILE TOGGLE (Just for Profile/Logout if needed, Main Nav is at bottom) */}
          {/* <button className="md:hidden text-slate-300 p-1" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button> */}
        </div>
      </div>
    </nav>

    {/* --- MOBILE BOTTOM NAVIGATION --- */}
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#020617]/95 backdrop-blur-xl border-t border-white/10 p-2 flex justify-around items-center z-50 pb-safe">
        {[
            { name: "Home", path: "/", icon: <FaHome size={18} /> },
            { name: "Services", path: "/services", icon: <FaServicestack size={18} /> },
            { name: "About", path: "/about", icon: <FaInfoCircle size={18} /> },
            { name: "Contact", path: "/contact", icon: <FaEnvelopeOpenText size={18} /> }
        ].map((tab) => (
            <Link 
                key={tab.name} 
                to={tab.path} 
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${isActive(tab.path) ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-white'}`}
            >
                {tab.icon}
                <span className="text-[9px] font-bold uppercase tracking-wide">{tab.name}</span>
            </Link>
        ))}
    </div>
    </>
  );
};

export default NavBar;