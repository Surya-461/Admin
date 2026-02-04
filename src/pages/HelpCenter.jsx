import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaBook, 
  FaUserCog, 
  FaShieldAlt, 
  FaHeadset, 
  FaChevronDown, 
  FaChevronUp,
  FaCreditCard,
  FaTruck
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const HelpCenter = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by going to the Login page and clicking on 'Forgot Password'. Follow the instructions sent to your email."
    },
    {
      question: "How can I change my subscription plan?",
      answer: "Navigate to your Dashboard, click on 'Settings', and select 'Billing'. You can upgrade or downgrade your plan from there."
    },
    {
      question: "Where can I view my purchase history?",
      answer: "Your purchase history is available in the 'Orders' section of your user dashboard. You can download invoices from there as well."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption (SSL) and trusted payment gateways (Stripe/Razorpay) to ensure your data is completely safe."
    }
  ];

  const categories = [
    { icon: FaBook, color: "text-blue-400", bg: "bg-blue-500/20", hoverBg: "group-hover:bg-blue-500", title: "Getting Started", desc: "Learn the basics of setting up your store and configuring your account." },
    { icon: FaUserCog, color: "text-purple-400", bg: "bg-purple-500/20", hoverBg: "group-hover:bg-purple-500", title: "Account Settings", desc: "Managing your profile, changing passwords, and role settings." },
    { icon: FaShieldAlt, color: "text-emerald-400", bg: "bg-emerald-500/20", hoverBg: "group-hover:bg-emerald-500", title: "Security & Privacy", desc: "Information on how we protect your data and privacy policies." },
    { icon: FaCreditCard, color: "text-pink-400", bg: "bg-pink-500/20", hoverBg: "group-hover:bg-pink-500", title: "Billing & Plans", desc: "Understand your invoices, subscription tiers, and payment methods." },
    { icon: FaTruck, color: "text-amber-400", bg: "bg-amber-500/20", hoverBg: "group-hover:bg-amber-500", title: "Orders & Shipping", desc: "Track your shipments and manage return requests." },
    { icon: FaHeadset, color: "text-cyan-400", bg: "bg-cyan-500/20", hoverBg: "group-hover:bg-cyan-500", title: "Technical Support", desc: "Troubleshooting common issues and error messages." },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden">
      
      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10">
        
        {/* Hero Search Section */}
        <div className="bg-slate-900/50 backdrop-blur-md border-b border-white/5 py-24 px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              How can we help you?
            </h1>
            <div className="max-w-2xl mx-auto relative mt-8 group">
              <FaSearch className="absolute left-5 top-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search for answers, topics, or keywords..." 
                className="w-full bg-slate-950/80 border border-white/20 rounded-full py-4 pl-14 pr-6 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all shadow-xl shadow-blue-900/5"
              />
            </div>
            <p className="text-slate-500 mt-4 text-sm">Popular: Reset Password, Billing, API Keys</p>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">Browse Categories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-slate-900/40 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Updated: bg-gradient-to-br -> bg-linear-to-br */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className={`w-14 h-14 ${cat.bg} rounded-xl flex items-center justify-center mb-6 ${cat.hoverBg} transition-colors duration-300`}>
                  <cat.icon className={`${cat.color} text-2xl group-hover:text-white transition-colors duration-300`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{cat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <div className="flex items-center gap-4 mb-8 justify-center">
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-slate-200">{faq.question}</span>
                  {activeAccordion === index ? <FaChevronUp className="text-blue-400" /> : <FaChevronDown className="text-slate-500" />}
                </button>
                <AnimatePresence>
                  {activeAccordion === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-slate-400 text-sm leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="bg-linear-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden group">
            {/* Animated Glow in CTA */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl">
                 <FaHeadset className="text-3xl text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">Still need help?</h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">Our support team is available 24/7. If you couldn't find your answer above, feel free to reach out to us directly.</p>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold py-3.5 px-8 rounded-full hover:bg-blue-50 hover:scale-105 transition-all shadow-lg shadow-blue-900/20">
                {/* Updated: rotate-[-90deg] -> -rotate-90 */}
                Contact Support <FaChevronDown className="-rotate-90 text-xs" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpCenter;