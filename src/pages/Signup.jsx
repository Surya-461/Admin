import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth"; 
import { setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaCamera, FaGlobe, FaBuilding,
  FaStore, FaArrowLeft, FaEye, FaEyeSlash 
} from "react-icons/fa";

// --- Elegant Input Component ---
const InputField = ({ icon: Icon, type, placeholder, value, setValue, required = true, fullWidth = false }) => (
  <div className={`relative group ${fullWidth ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors z-10 pointer-events-none">
      <Icon />
    </div>
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} 
      onChange={(e) => setValue(e.target.value)} 
      required={required}
      className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-slate-600 focus:border-blue-500 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium shadow-inner"
    />
  </div>
);

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [storeName, setStoreName] = useState(""); 
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState(""); 
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(""); 
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) return toast.error("Image too large (Max 800KB)");
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    const toastId = toast.loading("Creating account...");

    try {
      // 1. Check for Existing Mobile
      const mobileQuery = query(collection(db, "adminDetails"), where("mobile", "==", mobile));
      const mobileSnapshot = await getDocs(mobileQuery);
      if (!mobileSnapshot.empty) throw new Error("Mobile number already registered.");

      // 2. Create Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Generate Store ID (One-time generation)
      const generatedStoreId = `STR-${Date.now().toString(36).toUpperCase()}`;

      // 4. Save to Firestore (The ONLY time adminDetails is created)
      await setDoc(doc(db, "adminDetails", user.uid), {
        firstName, lastName, storeName, email, mobile,
        address, city, pincode, country,
        storeId: generatedStoreId,
        profileImage: image, 
        
        // ✅ CRITICAL: Default Status
        subscriptionStatus: 'inactive', 
        plan: null,
        createdAt: new Date(),
      });

      await signOut(auth);
      toast.success("Account created! Please Login.", { id: toastId });
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.error(err);
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 font-sans">
      <Toaster position="top-center" />
      <div className="w-full max-w-2xl bg-slate-900/60 border border-white/10 rounded-3xl p-8">
        {/* CSS Fix: Removed 'block' to resolve conflict with 'flex' */}
        <Link to="/login" className="text-slate-500 hover:text-white mb-6 flex items-center gap-2 transition-colors">
            <FaArrowLeft/> Back to Login
        </Link>
        
        <h2 className="text-3xl font-bold text-white text-center mb-8">Create Admin Account</h2>
        
        <form onSubmit={handleSignup} className="space-y-6">
           <div className="flex justify-center mb-6">
            <div className="relative group">
                <div className="w-24 h-24 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-800">
                    {image ? <img src={image} className="w-full h-full object-cover" alt="Profile" /> : <div className="w-full h-full flex items-center justify-center text-slate-500"><FaCamera size={24} /></div>}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition-colors">
                    <FaCamera size={12} className="text-white"/>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField icon={FaUser} type="text" placeholder="First Name" value={firstName} setValue={setFirstName} />
            <InputField icon={FaUser} type="text" placeholder="Last Name" value={lastName} setValue={setLastName} />
            <InputField icon={FaStore} type="text" placeholder="Store Name" value={storeName} setValue={setStoreName} fullWidth />
            <InputField icon={FaEnvelope} type="email" placeholder="Email" value={email} setValue={setEmail} />
            <InputField icon={FaPhone} type="tel" placeholder="Mobile" value={mobile} setValue={setMobile} />
            <InputField icon={FaMapMarkerAlt} type="text" placeholder="Address" value={address} setValue={setAddress} fullWidth />
            <InputField icon={FaBuilding} type="text" placeholder="City" value={city} setValue={setCity} />
            <InputField icon={FaMapMarkerAlt} type="text" placeholder="Pincode" value={pincode} setValue={setPincode} />
            <InputField icon={FaGlobe} type="text" placeholder="Country" value={country} setValue={setCountry} fullWidth />
            
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10"><FaLock/></div>
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3.5 pl-11 text-white" required/>
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">{showPassword ? <FaEyeSlash/> : <FaEye/>}</button>
            </div>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10"><FaLock/></div>
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3.5 pl-11 text-white" required/>
                <button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">{showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl mt-4 transition-all">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Signup;