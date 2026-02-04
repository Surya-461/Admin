import React, { useState, useEffect } from 'react';
import { FaCheck, FaCrown, FaStar, FaShieldAlt } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; 
import { onAuthStateChanged } from 'firebase/auth'; // ✅ Import this
import toast, { Toaster } from 'react-hot-toast';

const Services = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Reliably check Login Status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handlePlanSelection = (plan) => {
    if (loading) return; // Wait for auth check

    if (user) {
      // ✅ FIX: Navigate to 'subscription-details' first.
      // The Payment page needs data (address/mobile) that isn't in auth.currentUser.
      // SubscriptionDetails will fetch that data from Firestore.
      navigate('/subscription-details', { 
        state: { plan } 
      }); 
    } else {
      // 3. Not Logged In
      localStorage.setItem('pendingPlan', JSON.stringify(plan));
      toast.error("Please login to proceed");
      navigate('/login');
    }
  };

  const subscriptionPlans = [
    {
      id: 1,
      duration: "1 Year Access",
      subtitle: "Standard License",
      description: "Perfect for startups testing the waters. Get full access to the GSH Admin Console and POS systems for 12 months.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", 
      price: "₹15,000",
      rawPrice: 15000,
      period: "/year",
      features: ["Full Admin Console Access", "Up to 5 POS Terminals", "Standard Email Support", "Regular Updates"],
      badge: "STARTER",
      badgeColor: "bg-blue-500",
      savings: null
    },
    {
      id: 2,
      duration: "3 Years Access",
      subtitle: "Growth Plan",
      description: "Secure your business operations for the mid-term. Lock in the price and enjoy priority support for 36 months.",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop", 
      price: "₹38,000",
      rawPrice: 38000,
      period: "/3 years",
      features: ["Everything in 1 Year Plan", "Unlimited POS Terminals", "Priority 24/7 Support", "Free Staff Training Session"],
      badge: "MOST POPULAR",
      badgeColor: "bg-purple-600",
      savings: "Save ₹7,000 vs Yearly"
    },
    {
      id: 3,
      duration: "5 Years Access",
      subtitle: "Enterprise Suite",
      description: "Maximum value for established businesses. A long-term partnership with dedicated account management and lowest cost per year.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop", 
      price: "₹55,000",
      rawPrice: 55000,
      period: "/5 years",
      features: ["Everything in 3 Year Plan", "Dedicated Account Manager", "Custom Feature Development", "Lifetime Price Lock"],
      badge: "BEST VALUE",
      badgeColor: "bg-emerald-600",
      savings: "Save ₹20,000 vs Yearly"
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-white py-20 px-4 font-sans relative overflow-hidden">
      
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-100 h-100 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center mb-16 animate-[fadeUp_0.8s_ease-out]">
          <h2 className="text-blue-500 font-bold tracking-wider uppercase mb-3 text-sm">Simple Pricing</h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
             One App, <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">Flexible Plans</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Get the complete <strong>GSH Management Suite</strong>. No hidden modules. 
            Simply choose the license duration that fits your budget and business goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan, index) => (
            <div 
                key={plan.id} 
                className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 group flex flex-col relative transform hover:-translate-y-2 animate-[fadeUp_0.6s_ease-out_both]"
                style={{ animationDelay: `${index * 150}ms` }}
            >
              
              {plan.savings && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-slate-950 text-[10px] font-bold px-3 py-1.5 rounded-bl-xl z-20 shadow-lg uppercase tracking-wider">
                  {plan.savings}
                </div>
              )}

              <div className="h-56 overflow-hidden relative">
                <div className={`absolute top-4 left-4 ${plan.badgeColor} backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 text-white z-10 uppercase tracking-wide shadow-lg`}>
                  {plan.badge}
                </div>
                <img 
                  src={plan.image} 
                  alt={plan.duration} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-[0.7] group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
              </div>

              <div className="p-8 flex-1 flex flex-col relative -mt-12">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{plan.duration}</h3>
                    <p className="text-slate-400 text-sm font-medium">{plan.subtitle}</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/5 backdrop-blur-sm">
                    {plan.id === 1 && <FaShieldAlt className="text-slate-400 text-xl" />}
                    {plan.id === 2 && <FaStar className="text-yellow-400 text-xl" />}
                    {plan.id === 3 && <FaCrown className="text-emerald-400 text-xl" />}
                  </div>
                </div>

                <p className="text-slate-400 text-sm mb-6 mt-3 leading-relaxed border-b border-white/5 pb-6">
                  {plan.description}
                </p>

                <div className="mb-8 text-center">
                  <div className="inline-flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white tracking-tight">{plan.price}</span>
                    <span className="text-slate-500 text-sm font-medium">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 group/item">
                      <div className={`mt-0.5 p-0.5 rounded-full ${plan.id === 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'} group-hover:scale-110 transition-transform`}>
                          <FaCheck size={10} /> 
                      </div>
                      <span className="leading-tight group-hover/item:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handlePlanSelection(plan)}
                  className={`w-full py-4 font-bold text-sm uppercase tracking-wide rounded-xl transition-all duration-300 transform active:scale-[0.98] relative overflow-hidden group/btn ${
                  plan.id === 2 
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40' 
                    : 'bg-white text-slate-950 hover:bg-slate-200'
                }`}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative z-10">Choose {plan.duration.split(' ')[0]} Year Plan</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;