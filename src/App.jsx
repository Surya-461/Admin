import React, { useEffect, Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase'; 
import { setUser, logoutUser } from './redux/userSlice'; 

// Non-Lazy Imports (Layouts & Critical UI)
import NavBar from './components/ui/NavBar';
import Footer from './components/ui/Footer';
import VortexLoader from './pages/VortexLoader'; // Ensure this matches your file path

// --- Lazy Load Pages ---
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const FAQ = lazy(() => import('./pages/FAQ'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const AdminDashboard = lazy(() => import('./dashboards/AdminDashboard')); 
const BuyerDashboard = lazy(() => import('./dashboards/BuyerDashboard'));
const ProfileEdit = lazy(() => import('./pages/ProfileEdit'));
const SubscriptionDetails = lazy(() => import('./pages/SubscriptionDetails'));
const Payment = lazy(() => import('./pages/Payment'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // 🔒 HARDCODED ADMIN CREDENTIALS
  const ADMIN_EMAIL = "harigudipati66@gmail.com";
  const ADMIN_PHONE = "9347659938";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Fetch User Details from Firestore
          const docRef = doc(db, "adminDetails", user.uid);
          const docSnap = await getDoc(docRef);
          
          let firestoreData = {};
          let userRole = 'buyer';

          if (docSnap.exists()) {
            firestoreData = docSnap.data();
            
            // 2. CHECK IF ADMIN (Email OR Phone)
            if (
              user.email === ADMIN_EMAIL || 
              (firestoreData.mobile && firestoreData.mobile === ADMIN_PHONE)
            ) {
              userRole = 'admin';
            }
          } else {
            // Fallback: Check email even if firestore doc is missing
            if (user.email === ADMIN_EMAIL) {
               userRole = 'admin';
            }
          }

          // 3. Dispatch to Global Redux Store
          dispatch(setUser({
            currentUser: { uid: user.uid, email: user.email },
            userData: firestoreData, 
            role: userRole
          }));

        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        dispatch(logoutUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <NavBar /> 
      
      {/* Suspense wraps the Routes. 
        While any lazy component is loading, <VortexLoader /> is displayed.
      */}
      <Suspense fallback={<VortexLoader />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/services' element={<Services />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          
          {/* Auth Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path='/profile-edit' element={<ProfileEdit/>}/>
          
          {/* Dashboard Routes */}
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route path='/buyer-dashboard' element={<BuyerDashboard />} />
          <Route path="/subscription-details" element={<SubscriptionDetails />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Legal & Help */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </Suspense>

      <Footer /> 
    </>
  );
}

export default App;