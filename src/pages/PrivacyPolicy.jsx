import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShieldAlt, FaUserLock, FaDatabase, FaServer, FaEnvelope, FaLock } from 'react-icons/fa';

const PrivacyPolicy = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans relative overflow-hidden">
      
      {/* --- Ambient Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">
        
        {/* Navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                <FaArrowLeft className="text-xs" />
            </div>
            <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Main Content Card */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl"
        >
          
          {/* Header */}
          <motion.div variants={itemVariants} className="border-b border-white/10 pb-8 mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <FaShieldAlt size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-400">
               Last updated: <span className="text-white font-mono bg-white/5 px-2 py-1 rounded text-sm">{new Date().toLocaleDateString()}</span>
            </p>
          </motion.div>
          
          <div className="space-y-10 text-sm md:text-base leading-relaxed">
            
            {/* Section 1 */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-blue-500">01.</span> Introduction
              </h2>
              <p className="text-slate-400">
                Welcome to GSH Services. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you as to how we look after your personal data when you visit our website 
                (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>
            </motion.section>

            {/* Section 2 */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                 <span className="text-purple-500">02.</span> Data We Collect
              </h2>
              <p className="text-slate-400 mb-4">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 flex gap-4">
                      <div className="mt-1 text-emerald-400"><FaUserLock /></div>
                      <div>
                          <strong className="text-white block mb-1">Identity Data</strong>
                          <span className="text-slate-500 text-xs">First name, last name, username or similar identifier.</span>
                      </div>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 flex gap-4">
                      <div className="mt-1 text-amber-400"><FaEnvelope /></div>
                      <div>
                          <strong className="text-white block mb-1">Contact Data</strong>
                          <span className="text-slate-500 text-xs">Billing address, email address and telephone numbers.</span>
                      </div>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 flex gap-4 md:col-span-2">
                      <div className="mt-1 text-cyan-400"><FaServer /></div>
                      <div>
                          <strong className="text-white block mb-1">Technical Data</strong>
                          <span className="text-slate-500 text-xs">Internet protocol (IP) address, login data, browser type and version, time zone setting, operating system and platform.</span>
                      </div>
                  </div>
              </div>
            </motion.section>

            {/* Section 3 */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-emerald-500">03.</span> How We Use Your Data
              </h2>
              <p className="text-slate-400 mb-3">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="space-y-3 pl-2 border-l-2 border-slate-800 ml-2">
                 <li className="pl-4 text-slate-400">Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                 <li className="pl-4 text-slate-400">Where it is necessary for our legitimate interests (or those of a third party).</li>
                 <li className="pl-4 text-slate-400">Where we need to comply with a legal or regulatory obligation.</li>
              </ul>
            </motion.section>

            {/* Section 4 */}
            <motion.section variants={itemVariants}>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                 <span className="text-pink-500">04.</span> Data Security
              </h2>
              <div className="flex gap-4 items-start bg-blue-500/5 p-5 rounded-xl border border-blue-500/10">
                 <FaLock className="text-blue-400 text-xl mt-1 shrink-0" />
                 <p className="text-slate-400 text-sm">
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                 </p>
              </div>
            </motion.section>

            {/* Section 5 */}
            <motion.section variants={itemVariants} className="pt-6 border-t border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-slate-400">
                If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:support@gshservices.com" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">support@gshservices.com</a>.
              </p>
            </motion.section>

          </div>
        </motion.div>
        
        <div className="mt-8 text-center text-slate-600 text-xs">
            © {new Date().getFullYear()} GSH Services. All rights reserved.
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;