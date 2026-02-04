import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaFileContract, 
  FaUserCheck, 
  FaBan, 
  FaExclamationTriangle, 
  FaGavel 
} from 'react-icons/fa';

const TermsOfService = () => {
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
        <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-purple-600/10 rounded-full blur-[100px]"></div>
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
                <FaFileContract size={30} />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
            <p className="text-slate-400">
               Effective Date: <span className="text-white font-mono bg-white/5 px-2 py-1 rounded text-sm">{new Date().toLocaleDateString()}</span>
            </p>
          </motion.div>
          
          <div className="space-y-12 text-sm md:text-base leading-relaxed">
            
            {/* Section 1 */}
            <motion.section variants={itemVariants}>
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-blue-500/10 rounded-lg text-blue-400 hidden md:block">
                    <FaGavel />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-blue-500 md:hidden">01.</span> Agreement to Terms
                    </h2>
                    <p className="text-slate-400 bg-slate-950/30 p-4 rounded-xl border border-white/5">
                        By accessing our website and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </div>
              </div>
            </motion.section>

            {/* Section 2 */}
            <motion.section variants={itemVariants}>
               <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-purple-500/10 rounded-lg text-purple-400 hidden md:block">
                    <FaFileContract />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-purple-500 md:hidden">02.</span> Use License
                    </h2>
                    <p className="text-slate-400">
                        Permission is granted to temporarily download one copy of the materials (information or software) on GSH Services' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                    </p>
                </div>
               </div>
            </motion.section>

            {/* Section 3 */}
            <motion.section variants={itemVariants}>
               <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-emerald-500/10 rounded-lg text-emerald-400 hidden md:block">
                    <FaUserCheck />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-emerald-500 md:hidden">03.</span> User Accounts
                    </h2>
                    <p className="text-slate-400 mb-2">
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-500 marker:text-emerald-500">
                        <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                        <li>You agree not to disclose your password to any third party.</li>
                    </ul>
                </div>
               </div>
            </motion.section>

            {/* Section 4 */}
            <motion.section variants={itemVariants}>
               <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-red-500/10 rounded-lg text-red-400 hidden md:block">
                    <FaBan />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-red-500 md:hidden">04.</span> Termination
                    </h2>
                    <p className="text-slate-400">
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                    </p>
                </div>
               </div>
            </motion.section>

            {/* Section 5 */}
            <motion.section variants={itemVariants}>
               <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-amber-500/10 rounded-lg text-amber-400 hidden md:block">
                    <FaExclamationTriangle />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-amber-500 md:hidden">05.</span> Limitation of Liability
                    </h2>
                    <p className="text-slate-400 border-l-2 border-amber-500/50 pl-4">
                        In no event shall GSH Services, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </p>
                </div>
               </div>
            </motion.section>

          </div>
        </motion.div>
        
        <div className="mt-8 text-center text-slate-600 text-xs">
            © {new Date().getFullYear()} GSH Services. All rights reserved. Read our <Link to="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
        </div>

      </div>
    </div>
  );
};

export default TermsOfService;