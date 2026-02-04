import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; 
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice"; 
import toast, { Toaster } from "react-hot-toast";
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaCamera, FaSave, FaArrowLeft, FaBuilding, FaGlobe, FaStore, FaIdBadge 
} from "react-icons/fa";

// --- Elegant Input Component ---
const EditInput = ({ icon: Icon, label, type = "text", value, onChange, disabled = false, required = false, fullWidth = false }) => (
  <div className={`flex flex-col gap-2 ${fullWidth ? 'md:col-span-2' : ''}`}>
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    <div className={`relative group flex items-center bg-slate-950/50 border border-slate-700/60 rounded-xl px-4 py-3.5 focus-within:border-blue-500 focus-within:bg-slate-900/80 transition-all duration-300 shadow-inner ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-900/30' : ''}`}>
      <span className="text-slate-500 mr-3 text-lg group-focus-within:text-blue-400 transition-colors duration-300">
        <Icon />
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-medium text-sm min-w-0 ${disabled ? 'text-slate-400' : ''}`}
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
      {disabled && <FaLock className="text-slate-600 text-xs ml-2" />}
    </div>
  </div>
);

// --- Small Lock Icon for Disabled Fields ---
const FaLock = ({ className }) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className={className} xmlns="http://www.w3.org/2000/svg"><path d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"></path></svg>
);

const ProfileEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentUser, userData, role } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "", // Added email to state
    storeName: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    country: "",
  });
  const [image, setImage] = useState("");

  // 1. Load Data
  useEffect(() => {
    const populateData = (data) => {
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || currentUser?.email || "", // Fallback to auth email
        storeName: data.storeName || "",
        mobile: data.mobile || "",
        address: data.address || "",
        city: data.city || "",
        pincode: data.pincode || "",
        country: data.country || "",
      });
      setImage(data.profileImage || "");
    };

    if (userData) {
      populateData(userData);
    } else if (currentUser) {
      const fetchUser = async () => {
        try {
          const docRef = doc(db, "adminDetails", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) populateData(docSnap.data());
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Could not load profile data");
        }
      };
      fetchUser();
    }
  }, [currentUser, userData]);

  // 2. Handle Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) return toast.error("Image too large (Max 800KB)");
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result); 
      reader.readAsDataURL(file);
    }
  };

  // 3. Handle Submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating profile...");

    try {
      if (!currentUser) throw new Error("No user logged in");

      const userRef = doc(db, "adminDetails", currentUser.uid);
      const updatedData = { ...formData, profileImage: image, updatedAt: new Date() };

      await updateDoc(userRef, updatedData);

      dispatch(setUser({ 
        currentUser, 
        userData: { ...userData, ...updatedData }, 
        role: role || 'admin' 
      }));

      toast.success("Profile updated successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center p-4 md:p-8 font-sans bg-slate-950 relative overflow-x-hidden">
      
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <Toaster position="top-center" />
      
      <div className="w-full max-w-5xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="group p-3 bg-slate-900/50 rounded-full hover:bg-blue-600 border border-white/10 transition-all text-white shadow-lg"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Edit Profile</h1>
            <p className="text-slate-400 text-sm">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          
          {/* LEFT COLUMN: Profile Card (Sticky) */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-8 flex flex-col gap-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
              
              {/* Decorative gradient behind image */}
              <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-blue-600/20 to-transparent"></div>

              {/* Image Upload */}
              <div className="relative group mb-6 z-10">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl bg-slate-800 relative">
                  {image ? (
                    <img src={image} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <FaUser className="text-5xl" />
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="text-white text-xs font-bold">Change</span>
                  </div>
                </div>
                
                <label className="absolute bottom-2 right-2 bg-blue-600 p-3 rounded-full text-white cursor-pointer hover:bg-blue-500 hover:scale-110 transition-all shadow-lg border-4 border-slate-900 z-20">
                  <FaCamera size={16} />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {formData.firstName || "User"} {formData.lastName}
                  </h2>
                  <p className="text-slate-400 text-sm mb-6 flex items-center justify-center gap-2">
                     <FaEnvelope className="text-slate-600"/> {formData.email}
                  </p>
                  
                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-emerald-400 text-xs font-bold tracking-wide uppercase">Active Store</span>
                  </div>
                  
                  {/* Store ID */}
                  <div className="mt-4 pt-4 border-t border-white/5 w-full">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Store Identifier</p>
                      <p className="font-mono text-blue-400 font-bold tracking-widest">{userData?.storeId || "PENDING"}</p>
                  </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleUpdate} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl flex flex-col gap-8">
              
              {/* Section 1: Store Details */}
              <div className="space-y-4">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><FaStore /></div>
                    <h3 className="text-lg font-bold text-white">Store Information</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <EditInput 
                        fullWidth
                        icon={FaStore} 
                        label="Store Name" 
                        value={formData.storeName} 
                        onChange={(e) => setFormData({...formData, storeName: e.target.value})} 
                        required
                    />
                 </div>
              </div>

              <div className="h-px bg-white/5"></div>

              {/* Section 2: Personal Details */}
              <div className="space-y-4">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><FaIdBadge /></div>
                    <h3 className="text-lg font-bold text-white">Personal Details</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <EditInput 
                        icon={FaUser} 
                        label="First Name" 
                        value={formData.firstName} 
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                        required
                    />
                    <EditInput 
                        icon={FaUser} 
                        label="Last Name" 
                        value={formData.lastName} 
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                    />
                    <EditInput 
                        icon={FaPhone} 
                        label="Mobile Number" 
                        value={formData.mobile} 
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})} 
                        required
                    />
                 </div>
              </div>

              <div className="h-px bg-white/5"></div>

              {/* Section 3: Location */}
              <div className="space-y-4">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><FaMapMarkerAlt /></div>
                    <h3 className="text-lg font-bold text-white">Location</h3>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <EditInput 
                        fullWidth
                        icon={FaMapMarkerAlt} 
                        label="Address Line" 
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})} 
                    />
                    <EditInput 
                        icon={FaBuilding} 
                        label="City / District" 
                        value={formData.city} 
                        onChange={(e) => setFormData({...formData, city: e.target.value})} 
                    />
                    <EditInput 
                        icon={FaMapMarkerAlt} 
                        label="Pincode / Zip" 
                        value={formData.pincode} 
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})} 
                    />
                    <EditInput 
                        icon={FaGlobe} 
                        label="Country" 
                        value={formData.country} 
                        onChange={(e) => setFormData({...formData, country: e.target.value})} 
                    />
                 </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-2 border-t border-white/10">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-linear-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-lg shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Profile Changes
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;