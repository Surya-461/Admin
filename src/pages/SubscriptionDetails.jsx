import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const SubscriptionDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan;

  // Added storeId to state
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', storeName: '', storeId: '',
    email: '', mobile: '', address: '', city: '', pincode: '', country: '',
  });

  useEffect(() => {
    if (!selectedPlan) {
      toast.error("No plan selected");
      navigate('/services');
    }
  }, [selectedPlan, navigate]);

  // Auto-fill User Data & Store ID
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const docRef = doc(db, "adminDetails", auth.currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              storeName: data.storeName || '',
              storeId: data.storeId || '', // ✅ FETCH STORE ID
              email: auth.currentUser.email,
              mobile: data.mobile || '',
              address: data.address || '',
              city: data.city || '',
              pincode: data.pincode || '',
              country: data.country || '',
            });
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.storeName || !formData.mobile) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Navigate to Payment Page with ALL Data (including storeId)
    navigate('/payment', {
      state: {
        ...formData,
        plan: selectedPlan,
        uid: auth.currentUser.uid
      }
    });
  };

  if (!selectedPlan) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4 flex justify-center items-center">
      <Toaster position="top-right" />
      <div className="max-w-6xl w-full grid lg:grid-cols-3 gap-8">

        {/* Summary Card */}
        <div className="lg:col-span-1 bg-slate-900 border border-white/10 rounded-2xl p-6 h-fit sticky top-24">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="relative rounded-xl overflow-hidden mb-4 border border-white/5">
            <img src={selectedPlan.image} alt="Plan" className="w-full h-32 object-cover opacity-70" />
            <div className="absolute bottom-0 left-0 p-3 bg-linear-to-t from-black to-transparent w-full">
              <p className="font-bold text-white">{selectedPlan.duration}</p>
            </div>
          </div>
          <div className="flex justify-between items-center font-bold text-xl">
            <span>Total</span><span>{selectedPlan.price}</span>
          </div>
        </div>

        {/* Details Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Confirm Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <InputGroup label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
              <InputGroup label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs text-slate-400 font-bold uppercase ml-1">Email (Locked)</label>
                <input type="text" value={formData.email} disabled className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-slate-500 cursor-not-allowed" />
              </div>
              <InputGroup label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91..." />
            </div>

            <InputGroup label="Store Name" name="storeName" value={formData.storeName} onChange={handleChange} placeholder="My Shop" />

            <div className="grid md:grid-cols-2 gap-4">
              <InputGroup label="City" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
              <InputGroup label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" />
            </div>

            <button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
              Proceed to Payment <FaArrowRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs text-slate-400 font-bold uppercase ml-1">{label}</label>
    <input name={name} value={value} onChange={onChange} placeholder={placeholder} required className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white focus:border-blue-500 outline-none" />
  </div>
);

export default SubscriptionDetails;