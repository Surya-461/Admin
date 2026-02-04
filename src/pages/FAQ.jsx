import React, { useState } from 'react';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

const FAQItem = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className={`group border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-slate-900/80 border-blue-500/30 shadow-lg shadow-blue-900/10' : 'bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-900/60'}`}>
      <button 
        className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none cursor-pointer"
        onClick={toggle}
      >
        <span className={`font-semibold text-lg transition-colors duration-300 ${isOpen ? 'text-blue-400' : 'text-slate-200 group-hover:text-white'}`}>
          {question}
        </span>
        <span className={`ml-4 shrink-0 p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-blue-500/10 text-blue-400 rotate-180' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300'}`}>
           <FaChevronDown size={14} />
        </span>
      </button>

      {/* Smooth Expansion Animation */}
      <div 
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-0">
             {/* Decorative separator */}
             <div className={`w-full h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent mb-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
             <p className="text-slate-400 leading-relaxed text-sm md:text-base">
               {answer}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  // Using index to track open item (Accordion style: only one open at a time)
  // Set to 0 to have the first item open by default, or null for all closed
  const [openIndex, setOpenIndex] = useState(0); 

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I register a new store?",
      answer: "Click on the 'Sign Up' button in the top right corner. Fill in your personal details and store information. Once submitted, you will be redirected to your dashboard immediately."
    },
    {
      question: "Can I change my store logo later?",
      answer: "Yes, currently this feature is in development for the dashboard settings page. For now, please contact support if you need an urgent update."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and UPI payments. All transactions are secured with industry-standard encryption and processed via secure gateways."
    },
    {
      question: "How do I contact the Super Admin?",
      answer: "If you have critical issues, you can reach out via the Contact Us page form or email support@gshservices.com directly. Our typical response time is under 2 hours."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use Google Firebase for authentication and database storage, ensuring enterprise-grade security, automated backups, and 99.9% uptime for your data."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* --- Header Section --- */}
      <div className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/20">
          <FaQuestionCircle />
          <span>Help Center</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Frequently Asked <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">Questions</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Everything you need to know about GSH Services, billing, and support. Can't find the answer you're looking for? Chat with our team.
        </p>
      </div>

      {/* --- Accordion Section --- */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer} 
              isOpen={openIndex === index}
              toggle={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* --- Bottom Call to Action --- */}
        <div className="mt-16 text-center bg-slate-900/50 border border-white/5 rounded-2xl p-8">
           <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
           <p className="text-slate-400 mb-6">We’re here to help you get the most out of our platform.</p>
           <a href="/contact" className="inline-block px-8 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-blue-50 transition-colors duration-300">
             Contact Support
           </a>
        </div>
      </div>

    </div>
  );
};

export default FAQ;