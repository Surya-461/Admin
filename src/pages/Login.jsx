import { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaEye, FaEyeSlash, FaEnvelope, FaLock, FaGoogle, FaPhone, FaArrowLeft 
} from "react-icons/fa";

// --- Elegant Input Component ---
const InputField = ({ icon: Icon, type, placeholder, value, setValue, required = true, toggleIcon, onToggle }) => (
  <div className="space-y-1 group">
    <div className="relative flex items-center">
      <div className="absolute left-4 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none">
        <Icon size={18} />
      </div>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        required={required}
        className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-slate-600 focus:border-blue-500 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-medium shadow-inner"
      />
      {toggleIcon && (
        <button 
            type="button"
            onClick={onToggle}
            className="absolute right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
        >
            {toggleIcon}
        </button>
      )}
    </div>
  </div>
);

const Login = () => {
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- HARDCODED ADMIN CREDENTIALS ---
  const ADMIN_EMAIL = "padarthikirankumar8@gmail.com";
  const ADMIN_PHONE = "9392404394";

  // --- STRICT ROUTING LOGIC ---
  const routeUser = async (user) => {
    try {
      // 1. Fetch from adminDetails collection (as requested)
      const docRef = doc(db, "adminDetails", user.uid);
      const docSnap = await getDoc(docRef);

      let isSuperAdmin = false;

      if (docSnap.exists()) {
        const data = docSnap.data();
        // 2. Check if details match the HARDCODED CREDENTIALS
        if (data.email === ADMIN_EMAIL || data.mobile === ADMIN_PHONE) {
            isSuperAdmin = true;
        }
      }

      // 3. Navigate based on the match
      if (isSuperAdmin) {
        toast.success("Welcome, Super Admin!");
        setTimeout(() => navigate("/admin-dashboard"), 1000);
      } else {
        // "Other Details" -> Buyer Dashboard
        toast.success("Login Successful!");
        setTimeout(() => navigate("/buyer-dashboard"), 1000);
      }
      
    } catch (error) {
      console.error("Routing Error:", error);
      toast.error("Error fetching user profile.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Verifying credentials...");

    try {
      let loginEmail = identifier.trim();
      const isPhone = /^\d+$/.test(loginEmail) && loginEmail.length > 6;

      // Mobile Lookup Logic
      if (isPhone) {
        // ✅ Check ONLY in adminDetails collection as requested
        const q = query(collection(db, "adminDetails"), where("mobile", "==", loginEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Mobile number not found in records.");
        } else {
            loginEmail = querySnapshot.docs[0].data().email;
        }
      }

      // Auth
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      
      toast.dismiss(toastId); 
      await routeUser(userCredential.user);

    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      let errorMessage = "Login Failed";
      if (err.code === 'auth/invalid-credential') errorMessage = "Invalid Email or Password.";
      else if (err.message) errorMessage = err.message.replace("Firebase: ", "");
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const toastId = toast.loading("Connecting to Google...");
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      toast.dismiss(toastId);
      
      // Pass the user object to the routing logic
      await routeUser(result.user);
      
    } catch (err) {
      console.error("Google Login Error:", err);
      toast.dismiss(toastId);
      toast.error("Google Login Cancelled or Failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden font-sans">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-100 h-100 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* --- Main Card --- */}
      <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-10 relative z-10 transition-all hover:border-white/20">
        
        <Link to="/" className="absolute top-8 left-8 text-slate-500 hover:text-white transition-colors">
            <FaArrowLeft />
        </Link>

        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <InputField 
            icon={identifier && /^\d+$/.test(identifier) ? FaPhone : FaEnvelope} 
            type="text" 
            placeholder="Email Address or Mobile" 
            value={identifier} 
            setValue={setIdentifier} 
          />

          <div>
            <InputField 
                icon={FaLock} 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                setValue={setPassword} 
                toggleIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
                onToggle={() => setShowPassword(!showPassword)}
            />
            <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium">
                Forgot Password?
                </Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-600/20 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
                <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing In...</span>
                </>
            ) : "Sign In"}
          </button>
        </form>

        <div className="my-8 flex items-center justify-center space-x-3 text-slate-500 text-xs font-medium uppercase">
          <span className="h-px w-full bg-slate-800"></span>
          <span>Or continue with</span>
          <span className="h-px w-full bg-slate-800"></span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white text-sm font-semibold transition-all flex items-center justify-center gap-3 group"
        >
          <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" />
          <span>Google</span>
        </button>

        <div className="mt-8 text-center text-sm text-slate-400">
          Don't have an account? 
          <Link to="/signup" className="text-blue-400 font-bold ml-1.5 hover:text-blue-300 transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;