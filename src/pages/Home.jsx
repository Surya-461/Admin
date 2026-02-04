import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaLock, FaChartLine, FaCogs, FaMobileAlt, FaCreditCard, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 pt-32 pb-20 overflow-hidden">
        
        {/* Animated Background Glows (Optimized for Mobile) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 md:w-125 md:h-125 bg-blue-600/20 rounded-full blur-[80px] md:blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 md:w-100 md:h-100 bg-purple-600/10 rounded-full blur-[80px] md:blur-[100px] -z-10"></div>

        <div className="animate-fade-in-up max-w-5xl mx-auto z-10 w-full">
            <span className="inline-flex items-center gap-2 py-1 px-3 md:px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] md:text-sm font-bold mb-6 md:mb-8 hover:bg-blue-500/20 transition-colors cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Version 1.0 is Live
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 md:mb-8 tracking-tight leading-[1.15] md:leading-[1.1]">
                Manage Your Store <br className="hidden md:block" />
                <span className="bg-linear-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                    From The Cloud.
                </span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed px-2">
                Get instant access to a powerful <strong>Admin Dashboard</strong> and <strong>User POS App</strong>. 
                Subscribe once, deploy everywhere. No servers to manage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto px-4">
                <Link 
                    to="/services" 
                    className="w-full sm:w-auto px-8 py-3.5 md:py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-base md:text-lg shadow-lg shadow-blue-600/25 transition-all transform hover:-translate-y-1 hover:shadow-blue-600/40"
                >
                    Start Free Trial
                </Link>
                <a
                    href="https://premium-ruby-rho.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-8 py-3.5 md:py-4 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 rounded-xl font-bold text-base md:text-lg text-slate-300 transition-all flex justify-center items-center gap-2 group"
                >
                    Live Demo <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs md:text-sm" />
                </a>
            </div>
        </div>

        {/* --- HERO IMAGE (Mobile: Stacked, Desktop: 3D) --- */}
        <div className="mt-12 md:mt-20 relative w-full max-w-6xl mx-auto px-2 md:px-8 perspective-1000">
            <div className="relative rounded-xl md:rounded-2xl border border-slate-800 p-1 md:p-2 bg-slate-900/50 shadow-2xl backdrop-blur-sm transform md:hover:scale-[1.01] md:hover:-rotate-1 transition-all duration-700 ease-out group">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl md:rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-slate-950 aspect-video">
                    <img
                        src="/Admindashboard.png" 
                        alt="GSH Admin Dashboard Analytics" 
                        className="w-full h-full object-cover object-top"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-white/5 to-transparent pointer-events-none"></div>
                </div>
            </div>
        </div>
      </section>

      {/* --- TRUST BADGES --- */}
      <section className="py-8 md:py-12 border-y border-slate-800/50 bg-slate-950/50 relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 md:mb-8">Trusted by Modern Retailers</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-16 opacity-80 md:opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 text-lg md:text-2xl font-bold text-slate-300"><FaRocket className="text-blue-500"/> Retail<span className="text-white">Pro</span></div>
                <div className="hidden md:block w-px h-8 bg-slate-800"></div>
                <div className="flex items-center gap-2 text-lg md:text-2xl font-bold text-slate-300"><FaCogs className="text-purple-500"/> Shop<span className="text-white">Flow</span></div>
                <div className="hidden md:block w-px h-8 bg-slate-800"></div>
                <div className="flex items-center gap-2 text-lg md:text-2xl font-bold text-slate-300"><FaChartLine className="text-emerald-500"/> Inventory<span className="text-white">X</span></div>
            </div>
        </div>
      </section>

      {/* --- APP SHOWCASE (GRID) --- */}
      <section className="py-16 md:py-24 px-4 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-20">
                <h2 className="text-blue-500 font-bold tracking-wider uppercase mb-2 md:mb-3 text-xs md:text-sm">The Ecosystem</h2>
                <h3 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">Complete Digital Experience</h3>
                <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
                    Your subscription includes a stunning, customer-facing storefront and mobile-ready user apps.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                {/* Reusable Card Component Logic */}
                {[
                    { title: "Landing Page", icon: FaRocket, color: "text-blue-400", img: "/Landing.png" },
                    { title: "User Dashboard", icon: FaMobileAlt, color: "text-purple-400", img: "/Userdashboard.png" },
                    { title: "Smart Cart", icon: FaCogs, color: "text-emerald-400", img: "/Screenshot 2026-01-21 141732.png" },
                    { title: "Payments", icon: FaCreditCard, color: "text-pink-400", img: "/Screenshot 2026-01-21 141822.png" },
                ].map((card, idx) => (
                    <div key={idx} className="group rounded-2xl md:rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg hover:border-blue-500/40 transition-all duration-500 relative">
                        <div className="p-4 md:p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                            <h4 className="text-lg md:text-xl font-bold flex items-center gap-3"><card.icon className={card.color}/> {card.title}</h4>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-slate-700"></div>
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-slate-700"></div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden aspect-video">
                            <img src={card.img} alt={card.title} className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (CARDS) --- */}
      <section className="py-16 md:py-24 px-6 bg-slate-950 relative overflow-hidden">
        <div className="absolute -right-20 top-20 w-64 h-64 md:w-96 md:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 bottom-20 w-64 h-64 md:w-96 md:h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-blue-500 font-bold tracking-wider uppercase mb-2 md:mb-3 text-xs md:text-sm">Workflow</h2>
                <h3 className="text-2xl md:text-5xl font-bold text-white">How It Works</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {[
                    { num: "01", icon: "💳", title: "Subscribe", desc: "Choose the package that fits your store.", color: "text-blue-400", bg: "bg-blue-500/20" },
                    { num: "02", icon: "🔑", title: "Get Credentials", desc: "Receive Admin & User Login IDs via email instantly.", color: "text-emerald-400", bg: "bg-emerald-500/20" },
                    { num: "03", icon: "🚀", title: "Login & Manage", desc: "Start managing inventory, sales, and employees.", color: "text-purple-400", bg: "bg-purple-500/20" }
                ].map((step, idx) => (
                    <div key={idx} className="p-6 md:p-8 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-blue-500/50 transition-all relative group hover:-translate-y-1">
                        <div className="absolute top-4 right-6 text-5xl md:text-6xl font-black text-slate-800/50 -z-10 group-hover:text-white/5 transition-colors select-none">{step.num}</div>
                        <div className={`w-14 h-14 md:w-16 md:h-16 ${step.bg} rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 ${step.color}`}>{step.icon}</div>
                        <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{step.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FEATURES & CONTACT PREVIEW --- */}
      <section className="py-16 md:py-24 px-6 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className="order-2 md:order-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">Support when <br className="hidden md:block"/> <span className="text-blue-500">you need it.</span></h2>
                    <p className="text-slate-400 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">We don't just provide software; we provide a partnership. Our support channels are always open.</p>
                    
                    <div className="space-y-6 md:space-y-8 flex flex-col items-center md:items-start">
                        <div className="flex gap-4 md:gap-5 group items-center md:items-start text-left">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0"><FaChartLine size={20} /></div>
                            <div>
                                <h4 className="text-lg md:text-xl font-bold mb-1">Real-time Analytics</h4>
                                <p className="text-slate-400 text-sm">Track daily sales & profits instantly.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 md:gap-5 group items-center md:items-start text-left">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0"><FaLock size={20} /></div>
                            <div>
                                <h4 className="text-lg md:text-xl font-bold mb-1">Enterprise Security</h4>
                                <p className="text-slate-400 text-sm">Role-based access keeps data safe.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="relative order-1 md:order-2">
                    <div className="absolute -inset-2 bg-linear-to-r from-blue-600 to-emerald-600 rounded-2xl opacity-20 blur-2xl"></div>
                    <img 
                        src="/Screenshot 2026-01-21 141714.png" 
                        alt="Contact Support Page" 
                        className="relative rounded-xl md:rounded-2xl border border-slate-700 shadow-2xl w-full h-auto transform md:rotate-3 hover:rotate-0 transition-all duration-500"
                    />
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA BOTTOM --- */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-5xl mx-auto bg-linear-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 md:w-80 md:h-80 bg-blue-500/20 rounded-full blur-[60px] md:blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 relative z-10">Ready to modernize your store?</h2>
            <p className="text-slate-300 text-sm md:text-lg mb-8 md:mb-10 max-w-xl mx-auto relative z-10">Join hundreds of retailers who have switched to GSH Services.</p>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/services" className="inline-block px-8 py-3.5 md:px-10 md:py-4 bg-white text-slate-950 font-bold text-base md:text-lg rounded-xl hover:bg-blue-50 transition-all shadow-xl">
                    View Pricing
                </Link>
                <Link to="/contact" className="inline-block px-8 py-3.5 md:px-10 md:py-4 bg-transparent border border-white/20 text-white font-bold text-base md:text-lg rounded-xl hover:bg-white/5 transition-all">
                    Contact Sales
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
};

export default Home;