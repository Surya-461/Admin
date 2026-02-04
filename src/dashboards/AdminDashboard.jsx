import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, updateDoc, deleteDoc, doc, getDoc, 
  query, orderBy, onSnapshot 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaUsers, FaSearch, FaToggleOn, FaToggleOff, FaEdit, 
  FaTrash, FaEnvelope, FaUserCircle, FaPhone, FaReply, 
  FaCreditCard, FaSpinner, FaChartLine, FaStore, 
  FaCalendarAlt, FaCrown, FaCheck, FaHistory, FaExclamationCircle, FaTimes
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [stores, setStores] = useState([]);
  
  // Structure: { storeId: { latest: {}, history: [{},{}], count: 5 } }
  const [userPayments, setUserPayments] = useState({}); 
  const [subscriptions, setSubscriptions] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [adminName, setAdminName] = useState('Admin'); 
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, revenue: 0 });

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // For Edit
  const [selectedHistory, setSelectedHistory] = useState([]); // For History View
  const [selectedHistoryStoreName, setSelectedHistoryStoreName] = useState('');
  const [formData, setFormData] = useState({});

  // --- 1. Auth Check ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, "adminDetails", user.uid));
        if (docSnap.exists()) setAdminName(docSnap.data().firstName);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Helper: Calculate Expiry ---
  const calculateExpiry = (paymentData) => {
    if (!paymentData || !paymentData.purchasedAt) return null;
    
    const seconds = paymentData.purchasedAt.seconds || new Date(paymentData.purchasedAt).getTime() / 1000;
    const startDate = new Date(seconds * 1000);
    const planName = paymentData.planName || "";

    if (planName.includes("3 Years")) {
      startDate.setFullYear(startDate.getFullYear() + 3);
    } else if (planName.includes("5 Years")) {
      startDate.setFullYear(startDate.getFullYear() + 5);
    } else {
      startDate.setFullYear(startDate.getFullYear() + 1); // Default 1 Year
    }
    
    return startDate;
  };

  // --- 2. Fetch Users & Link Payments ---
  useEffect(() => {
    if (activeTab !== 'users') return;
    setLoading(true);

    // A. Fetch Users
    const unsubUsers = onSnapshot(collection(db, "adminDetails"), (snapshot) => {
      const storeData = [];
      let activeCount = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        storeData.push({ id: doc.id, ...data });
        if (data.subscriptionStatus === 'active') activeCount++;
      });
      setStores(storeData);
      setLoading(false);
      setStats(prev => ({ ...prev, total: storeData.length, active: activeCount, inactive: storeData.length - activeCount }));
    });

    // B. Fetch Payments & Aggregate Data
    const qPayments = query(collection(db, "subscribed_payments"), orderBy("purchasedAt", "desc")); // Newest first
    const unsubPayments = onSnapshot(qPayments, (snapshot) => {
      const paymentAggregator = {}; 
      let totalRevenue = 0;

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        totalRevenue += Number(data.amount || 0);
        
        // Identify User ID (storeId or uid)
        const userId = data.storeId || data.uid;

        if (userId) {
            if (!paymentAggregator[userId]) {
                paymentAggregator[userId] = { latest: null, history: [], count: 0 };
            }
            
            // Add to history array
            paymentAggregator[userId].history.push({ ...data, id: doc.id });
            paymentAggregator[userId].count += 1;
        }
      });

      // Determine latest payment for each user (since we fetched DESC, index 0 is latest)
      Object.keys(paymentAggregator).forEach(userId => {
          paymentAggregator[userId].latest = paymentAggregator[userId].history[0];
      });
      
      setUserPayments(paymentAggregator);
      setStats(prev => ({ ...prev, revenue: totalRevenue }));
    });

    return () => { unsubUsers(); unsubPayments(); }; 
  }, [activeTab]);

  // --- 3. AUTO-DEACTIVATE LOGIC ---
  useEffect(() => {
    if (stores.length > 0 && Object.keys(userPayments).length > 0) {
        stores.forEach(store => {
            const paymentInfo = userPayments[store.storeId] || userPayments[store.id];
            
            if (paymentInfo && paymentInfo.latest) {
                const expiryDate = calculateExpiry(paymentInfo.latest);
                const now = new Date();

                // Check: Is Expired? AND Is currently marked active?
                if (expiryDate < now && store.subscriptionStatus === 'active') {
                    console.log(`Auto-deactivating user: ${store.storeName}`);
                    
                    // Update Database
                    updateDoc(doc(db, "adminDetails", store.id), { 
                        subscriptionStatus: 'inactive' 
                    }).then(() => {
                        toast.error(`Plan Expired: ${store.storeName} has been deactivated.`);
                    }).catch(err => console.error("Auto-deactivate failed", err));
                }
            }
        });
    }
  }, [stores, userPayments]);

  // --- Fetch Other Collections ---
  useEffect(() => {
    if (activeTab !== 'subscriptions') return;
    const q = query(collection(db, "subscribed_payments"), orderBy("purchasedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'messages') return;
    const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [activeTab]);

  // --- Handlers ---
  const toggleSubscription = async (storeId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateDoc(doc(db, "adminDetails", storeId), { subscriptionStatus: newStatus });
      toast.success(`User is now ${newStatus}`);
    } catch (err) { toast.error("Update failed"); }
  };

  const handleDeleteStore = async (storeId) => {
    if(!window.confirm("Delete User? This cannot be undone.")) return;
    try { await deleteDoc(doc(db, "adminDetails", storeId)); toast.success("Deleted"); } 
    catch (error) { toast.error("Failed"); }
  };

  const handleEdit = (store) => {
    setSelectedUser(store.id);
    setFormData({ ...store });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "adminDetails", selectedUser), formData);
      toast.success("Updated!");
      setIsEditModalOpen(false);
    } catch (error) { toast.error("Failed"); }
  };

  const handleViewHistory = (storeId, storeName) => {
     const data = userPayments[storeId];
     if(data && data.history) {
         setSelectedHistory(data.history);
         setSelectedHistoryStoreName(storeName);
         setIsHistoryModalOpen(true);
     } else {
         toast("No purchase history found for this user.");
     }
  };

  const filteredStores = stores.filter(s => 
    s.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.storeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- UI Components ---
  const TabButton = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`group flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 outline-none
        ${activeTab === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
      <Icon className={`text-lg ${activeTab === id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} /> 
      {label}
    </button>
  );

  const StatCard = ({ title, value, colorClass, icon: Icon }) => (
    <div className="relative overflow-hidden p-6 rounded-2xl bg-gray-900 border border-white/5 shadow-xl">
      <div className={`absolute -right-6 -top-6 p-8 opacity-[0.08] rounded-full ${colorClass} bg-current`}></div>
      <div className={`mb-4 inline-flex p-3 rounded-lg bg-gray-800/50 ${colorClass} bg-opacity-10 border border-white/5`}>
        <Icon size={24} className={colorClass} />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-blue-500/30">
      <Toaster position="top-center" toastOptions={{ style: { background: '#1f2937', color: '#fff', borderRadius: '12px', border: '1px solid #374151' } }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-4">
              <span className="p-3 bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-900/40">
                <FaStore className="text-white text-xl"/>
              </span>
              Admin Panel
            </h1>
            <p className="text-gray-400 text-sm font-medium ml-1">
              Logged in as <span className="text-blue-400 font-bold">{adminName}</span>
            </p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide w-full lg:w-auto">
            <TabButton id="users" label="Users" icon={FaUsers} />
            <TabButton id="subscriptions" label="Payments" icon={FaCreditCard} />
            <TabButton id="messages" label="Messages" icon={FaEnvelope} />
          </div>
        </div>

        {/* --- USERS TAB --- */}
        {activeTab === 'users' && (
          <div className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <StatCard title="Total Users" value={stats.total} colorClass="text-blue-400" icon={FaUsers} />
              <StatCard title="Active Subs" value={stats.active} colorClass="text-emerald-400" icon={FaChartLine} />
              <StatCard title="Inactive" value={stats.inactive} colorClass="text-rose-400" icon={FaToggleOff} />
              <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} colorClass="text-amber-400" icon={FaCrown} />
            </div>

            <div className="relative max-w-lg ml-auto group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500 group-focus-within:text-blue-400"/>
              </div>
              <input 
                placeholder="Search by Store Name, Email or Store ID..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="block w-full pl-11 pr-4 py-3.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-200 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-24"><FaSpinner className="animate-spin text-4xl text-blue-500"/></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStores.map(store => {
                  // Get payment info
                  const paymentInfo = userPayments[store.storeId] || userPayments[store.id]; 
                  const latestPayment = paymentInfo?.latest;
                  const count = paymentInfo?.count || 0;
                  
                  const expiryDateObj = calculateExpiry(latestPayment);
                  const expiryDateString = expiryDateObj ? expiryDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
                  const isPlanExpired = expiryDateObj ? new Date() > expiryDateObj : false;

                  return (
                  <div key={store.id} className="group flex flex-col bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all hover:shadow-2xl relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 blur-2xl transition-colors
                      ${store.subscriptionStatus === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

                    <div className="flex justify-between items-start mb-5 relative z-10">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{store.storeName}</h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">ID: <span className="text-gray-400">{store.storeId || store.id.slice(0,8)}</span></p>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1.5
                        ${store.subscriptionStatus === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        {store.subscriptionStatus === 'active' ? <FaCheck/> : <FaExclamationCircle/>}
                        {store.subscriptionStatus}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6 grow relative z-10 border-b border-gray-800 pb-4">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <FaUserCircle className="text-gray-600"/> <span className="truncate">{store.firstName} {store.lastName}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <FaEnvelope className="text-gray-600"/> <span className="truncate">{store.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <FaPhone className="text-gray-600"/> <span>{store.mobile}</span>
                      </div>
                    </div>

                    {/* Subscription Details */}
                    <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-3 mb-5 relative z-10">
                       {latestPayment ? (
                         <div className="flex flex-col gap-2 animate-fade-in">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FaCrown className="text-amber-500 text-xs"/>
                                <span className="text-xs font-bold text-gray-300">{latestPayment.planName}</span>
                              </div>
                              <span className="text-xs font-mono font-medium text-emerald-400">₹{Number(latestPayment.amount).toLocaleString()}</span>
                            </div>
                            
                            {/* --- HISTORY BUTTON --- */}
                            <button 
                                onClick={() => handleViewHistory(store.storeId || store.id, store.storeName)}
                                className="flex items-center gap-1.5 text-[10px] text-blue-400 bg-blue-500/5 px-2 py-1.5 rounded hover:bg-blue-500/10 transition-colors w-full justify-center mt-1"
                            >
                                <FaHistory /> {count} {count === 1 ? 'Purchase' : 'Purchases'} (View History)
                            </button>

                            <div className="w-full h-px bg-gray-800/50 my-1"></div>
                            
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">{isPlanExpired ? "Expired On:" : "Expires On:"}</span>
                              <span className={`flex items-center gap-1.5 font-mono ${isPlanExpired ? 'text-rose-500 font-bold' : 'text-blue-300'}`}>
                                <FaCalendarAlt size={10} />
                                {expiryDateString}
                              </span>
                            </div>
                         </div>
                       ) : (
                         <div className="flex items-center justify-center gap-2 text-xs text-gray-600 py-2">
                           <FaToggleOff/>
                           <span>No Subscription History</span>
                         </div>
                       )}
                    </div>

                    <div className="mt-auto flex items-center justify-between relative z-10">
                      <button 
                        onClick={() => toggleSubscription(store.id, store.subscriptionStatus)} 
                        className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-all
                        ${store.subscriptionStatus === 'active' 
                          ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white' 
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}
                      >
                        {store.subscriptionStatus === 'active' 
                          ? <><FaToggleOff className="text-lg"/> Deactivate</> 
                          : <><FaToggleOn className="text-lg"/> Activate</>}
                      </button>

                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(store)} className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white"><FaEdit/></button>
                        <button onClick={() => handleDeleteStore(store.id)} className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white"><FaTrash/></button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- PAYMENTS TAB --- */}
        {activeTab === 'subscriptions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
             {subscriptions.length === 0 && <div className="col-span-full text-center py-20 text-gray-500">No records.</div>}
            {subscriptions.map(sub => (
              <div key={sub.id} className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all shadow-lg overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-emerald-500/10 to-transparent rounded-bl-[100px] pointer-events-none"></div>
                 <div className="relative z-10">
                   <div className="flex justify-between items-start mb-6">
                     <div>
                       <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
                          <FaCheck className="text-[10px]"/> Verified
                       </p>
                       <h3 className="font-bold text-lg text-white">{sub.planName}</h3>
                     </div>
                     <div className="bg-gray-800 p-2 rounded-lg text-emerald-400"><FaCreditCard/></div>
                   </div>
                   <div className="flex items-baseline gap-1.5 mb-6">
                     <span className="text-3xl font-extrabold text-white tracking-tight">₹{Number(sub.amount).toLocaleString()}</span>
                     <span className="text-gray-500 text-xs font-medium">INR</span>
                   </div>
                   <div className="bg-gray-950/50 rounded-xl p-4 space-y-3 text-xs text-gray-400 border border-gray-800/50">
                      <div className="flex justify-between items-center border-b border-gray-800/50 pb-2">
                        <span className="font-medium text-gray-500">Store ID</span> 
                        <span className="text-blue-300 font-mono">{sub.storeId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Customer</span> 
                        <span className="text-gray-200">{sub.customerName}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-800/50">
                        <span className="font-medium">Transaction Date</span> 
                        <span className="text-gray-200 font-mono">
                           {sub.purchasedAt?.seconds 
                              ? new Date(sub.purchasedAt.seconds * 1000).toLocaleDateString() 
                              : (sub.purchasedAt ? new Date(sub.purchasedAt).toLocaleDateString() : 'N/A')}
                        </span>
                      </div>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* --- MESSAGES TAB --- */}
        {activeTab === 'messages' && (
           <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
             {messages.length === 0 && <div className="text-center py-20 text-gray-500">No messages.</div>}
             {messages.map(msg => (
               <div key={msg.id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 hover:border-gray-700 transition-colors">
                 <div className="shrink-0"><div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center text-xl border border-purple-500/20"><FaEnvelope/></div></div>
                 <div className="grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-white">{msg.subject}</h3>
                        <span className="text-xs text-gray-500 bg-gray-950 px-2 py-1 rounded">{msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString() : 'Now'}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{msg.message}</p>
                    <div className="flex items-center gap-4 text-xs">
                        <span className="text-blue-400 font-medium">{msg.firstName}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400">{msg.email}</span>
                    </div>
                 </div>
                 <div className="flex flex-col justify-center">
                    <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="p-3 bg-blue-600/10 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-lg flex items-center justify-center"><FaReply size={18} /></a>
                 </div>
               </div>
             ))}
           </div>
        )}
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="px-6 py-5 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Edit User</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-white"><FaTimes/></button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
              {[{ label: "First Name", key: "firstName" }, { label: "Store Name", key: "storeName" }, { label: "Store ID", key: "storeId" }, { label: "Mobile", key: "mobile" }].map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase">{field.label}</label>
                  <input value={formData[field.key] || ''} onChange={e => setFormData({...formData, [field.key]: e.target.value})} className="w-full bg-gray-950 p-3 rounded-xl border border-gray-800 text-white focus:border-blue-500 outline-none" />
                </div>
              ))}
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-3 bg-gray-800 rounded-xl text-gray-300 hover:bg-gray-700">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-500">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- HISTORY MODAL --- */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-slide-up">
            <div className="px-6 py-5 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-white">Subscription History</h2>
                    <p className="text-xs text-gray-400 mt-1">For Store: <span className="text-blue-400">{selectedHistoryStoreName}</span></p>
                </div>
                <button onClick={() => setIsHistoryModalOpen(false)} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"><FaTimes/></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                {selectedHistory.length === 0 ? (
                    <p className="text-center text-gray-500">No history available.</p>
                ) : (
                    selectedHistory.map((h, idx) => {
                        const pDate = h.purchasedAt?.seconds ? new Date(h.purchasedAt.seconds * 1000) : new Date(h.purchasedAt);
                        const expDate = calculateExpiry({ purchasedAt: h.purchasedAt, planName: h.planName });
                        const isExp = expDate < new Date();

                        return (
                            <div key={idx} className="bg-slate-950 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-white">{h.planName}</h4>
                                        {isExp ? <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 rounded">Expired</span> : <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 rounded">Active</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 font-mono">TxID: {h.paymentId || 'N/A'}</p>
                                </div>
                                <div className="text-right text-xs space-y-1">
                                    <p className="text-gray-400">Purchased: <span className="text-white">{pDate.toLocaleDateString()}</span></p>
                                    <p className="text-gray-400">Expires: <span className={isExp ? 'text-rose-400' : 'text-blue-300'}>{expDate.toLocaleDateString()}</span></p>
                                    <p className="font-bold text-lg text-emerald-400 mt-1">₹{Number(h.amount).toLocaleString()}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;