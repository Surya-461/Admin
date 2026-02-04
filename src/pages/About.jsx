import React from 'react';
import { FaLightbulb, FaHandshake, FaShieldAlt, FaRocket, FaUsers, FaCode, FaCheckCircle } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 px-6 overflow-hidden">
        {/* Abstract Background Elements - Fixed: w-125/h-125 and w-75/h-75 */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-blue-600/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-75 h-75 bg-purple-600/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="relative z-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8 shadow-lg shadow-blue-900/10">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Innovating Since 2024
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight text-white leading-[1.1]">
              Future of <br />
              {/* Fixed: bg-linear-to-r */}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-blue-500 to-purple-500">
                Retail Management
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg lg:text-xl leading-relaxed mb-8 max-w-lg">
              GSH Services democratizes enterprise-grade technology for businesses of all sizes. Powerful POS systems, simplified.
            </p>

            <div className="pl-6 border-l-2 border-blue-500/50">
              <p className="text-slate-300 italic text-lg leading-relaxed">
                "We strip away the complexity so you can focus on selling. No servers, just pure efficiency."
              </p>
            </div>
          </div>
          
          {/* Image/Visual */}
          <div className="relative group order-1 lg:order-2">
            {/* Fixed: bg-linear-to-r */}
            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl opacity-30 blur-xl group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
               <img 
                 src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop" 
                 alt="Modern Retail Interface" 
                 className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-105 opacity-90 hover:opacity-100"
               />
               {/* Floating Badge */}
               <div className="absolute bottom-6 left-6 bg-slate-950/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-full text-green-400">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">System Status</p>
                      <p className="text-sm font-bold text-white">100% Operational</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="relative z-20 -mt-8 px-4">
        <div className="max-w-6xl mx-auto bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl p-8 lg:p-12 shadow-2xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x lg:divide-white/5">
             <StatBox number="500+" label="Active Stores" delay="0" />
             <StatBox number="1M+" label="Transactions" delay="100" />
             <StatBox number="99.9%" label="Uptime" delay="200" />
             <StatBox number="24/7" label="Support" delay="300" />
          </div>
        </div>
      </section>

      {/* --- MISSION & VISION --- */}
      <section className="py-24 lg:py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-3">Our Purpose</h2>
             <h3 className="text-3xl lg:text-5xl font-bold text-white">Driving Digital Transformation</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <FeatureCard 
              icon={FaRocket}
              title="Our Mission"
              desc="To empower retailers of all sizes with affordable, scalable, and intelligent technology. We believe that managing a store should be intuitive, not intimidating."
              theme="blue"
            />
            <FeatureCard 
              icon={FaLightbulb}
              title="Our Vision"
              desc="To become the global standard for cloud-based retail management. We envision a world where a small boutique has access to the same tools as a global giant."
              theme="purple"
            />
          </div>
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="py-24 px-6 bg-slate-900/50 border-y border-white/5">
         <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">Core Values</h2>
              <p className="text-slate-400 text-lg">The principles that guide every line of code we write and every decision we make.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
               <ValueCard 
                 icon={FaUsers} 
                 title="Customer Obsessed" 
                 desc="We don't build features for us; we build them for you. Every update is driven by user feedback."
                 color="blue"
               />
               <ValueCard 
                 icon={FaShieldAlt} 
                 title="Uncompromised Security" 
                 desc="Your data is your business. We treat it with military-grade encryption and strict access protocols."
                 color="emerald"
               />
               <ValueCard 
                 icon={FaHandshake} 
                 title="Radical Transparency" 
                 desc="No hidden fees. No locked data. We believe in building trust through honest business practices."
                 color="purple"
               />
            </div>
         </div>
      </section>

      {/* --- TECH STACK --- */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
           <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-12 text-center">
             
             {/* Background Grid Pattern */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
             
             <div className="relative z-10">
               {/* Fixed: bg-linear-to-br */}
               <div className="w-20 h-20 mx-auto bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 flex items-center justify-center mb-8 shadow-xl">
                 <FaCode size={32} className="text-blue-400"/>
               </div>
               
               <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white">Built on Modern Architecture</h2>
               <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                 GSH Services isn't legacy software wrapped in a website. It's a true <strong>Single Page Application (SPA)</strong> built with React, powered by Firebase's real-time NoSQL database.
               </p>

               <div className="flex flex-wrap justify-center gap-3">
                  {['React.js', 'Firebase Auth', 'Cloud Firestore', 'Tailwind CSS'].map((tech) => (
                    <span key={tech} className="px-5 py-2.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded-lg border border-white/5 text-sm font-mono transition-colors cursor-default">
                      {tech}
                    </span>
                  ))}
               </div>
             </div>
           </div>
        </div>
      </section>

    </div>
  );
};

// --- Helper Components ---

const StatBox = ({ number, label }) => (
  <div className="text-center group p-4">
    {/* Fixed: bg-linear-to-b */}
    <h3 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-b from-white to-slate-400 mb-2 group-hover:from-blue-400 group-hover:to-blue-600 transition-all duration-300">
      {number}
    </h3>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, theme }) => {
  const styles = {
    blue: "group-hover:border-blue-500/30 text-blue-400 bg-blue-500/10",
    purple: "group-hover:border-purple-500/30 text-purple-400 bg-purple-500/10"
  };

  return (
    <div className={`bg-slate-900 border border-white/5 rounded-3xl p-8 lg:p-12 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden ${styles[theme].split(' ')[0]}`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-3xl transition-colors ${styles[theme].split(' ').slice(1).join(' ')}`}>
        <Icon />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
};

const ValueCard = ({ icon: Icon, title, desc, color }) => {
  // Explicit mapping to avoid dynamic class issues in Tailwind JIT
  const colorVariants = {
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "group-hover:border-blue-500/50",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "group-hover:border-emerald-500/50",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "group-hover:border-purple-500/50",
    }
  };

  const theme = colorVariants[color] || colorVariants.blue;

  return (
    <div className={`bg-slate-950 p-8 rounded-2xl border border-white/5 ${theme.border} transition-all duration-300 group hover:bg-slate-900/50`}>
       <div className={`w-12 h-12 ${theme.bg} rounded-xl flex items-center justify-center ${theme.text} mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} />
       </div>
       <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
       <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

export default About;