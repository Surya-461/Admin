import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaInstagram, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaChevronRight,
  FaHeart
} from 'react-icons/fa';

const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-white/5 py-6 md:pt-20 md:pb-10 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* --- MAIN GRID (HIDDEN ON MOBILE, VISIBLE ON DESKTOP) --- */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* 1. Brand Section */}
          <div className="space-y-6 pr-4">
            <Link to="/" onClick={scrollToTop} className="inline-block">
                <h2 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                GSH Services
                </h2>
            </Link>
            <p className="text-sm leading-7 text-slate-400 max-w-xs">
              Empowering your business with top-tier digital solutions.
            </p>
            <div className="flex gap-3 pt-2">
              <SocialLink href="https://www.facebook.com/share/17kmocoqxD/" icon={FaFacebookF} color="blue" />
              <SocialLink href="https://github.com/GSH524" icon={FaTwitter} color="sky" />
              <SocialLink href="https://www.linkedin.com/in/srihari-gudipati-0410a925a/" icon={FaLinkedinIn} color="indigo" />
              <SocialLink href="https://www.instagram.com/_srihari_7___?igsh=MXRxY3NkcTlzZ2t1NA==" icon={FaInstagram} color="pink" />
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/" label="Home" onClick={scrollToTop} />
              <FooterLink to="/about" label="About Us" onClick={scrollToTop} />
              <FooterLink to="/services" label="Services" onClick={scrollToTop} />
              <FooterLink to="/contact" label="Contact" onClick={scrollToTop} />
            </ul>
          </div>

          {/* 3. Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Support
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/privacy-policy" label="Privacy Policy" onClick={scrollToTop} />
              <FooterLink to="/terms" label="Terms of Service" onClick={scrollToTop} />
              <FooterLink to="/faq" label="FAQ" onClick={scrollToTop} />
              <FooterLink to="/help" label="Help Center" onClick={scrollToTop} />
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4 group">
                <div className="mt-1 w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-blue-500 shrink-0">
                    <FaMapMarkerAlt size={12} />
                </div>
                <span>Hyderabad, India</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-blue-500 shrink-0">
                    <FaPhoneAlt size={12} />
                </div>
                <span>+91 9347659937</span>
              </li>
              <li className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-blue-500 shrink-0">
                    <FaEnvelope size={12} />
                </div>
                <span>support@gshservices.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* --- FOOTER BOTTOM (VISIBLE ON ALL SCREENS) --- */}
        <div className="md:border-t border-white/5 md:pt-8 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-xs tracking-wide">
          
          {/* Copyright - Visible on Mobile & Desktop */}
          <p className="text-slate-500 text-center md:text-left font-medium">
            &copy; {new Date().getFullYear()} <span className="text-slate-300 font-semibold">GSH Services</span>. All rights reserved.
          </p>
          
          {/* Designed By - Now Visible on Mobile too (Removed 'hidden') */}
          <p className="flex items-center gap-1 text-slate-500">
            Designed with <FaHeart className="text-red-500/80 animate-pulse" size={10} /> by <span className="text-slate-300 font-medium">Srihari</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

// --- Helper Components ---

const FooterLink = ({ to, label, onClick }) => (
  <li>
    <Link 
      to={to} 
      onClick={onClick} 
      className="group flex items-center gap-2 text-sm hover:text-blue-400 transition-all duration-300 transform hover:translate-x-1"
    >
      <FaChevronRight className="text-[10px] text-slate-600 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 duration-300" />
      {label}
    </Link>
  </li>
);

const SocialLink = ({ href, icon: Icon, color }) => {
    const hoverClasses = {
        blue: "hover:bg-blue-600 hover:border-blue-600",
        sky: "hover:bg-sky-500 hover:border-sky-500",
        indigo: "hover:bg-indigo-600 hover:border-indigo-600",
        pink: "hover:bg-pink-600 hover:border-pink-600",
    };

    return (
        <a 
            href={href} 
            target="_blank"
            rel="noreferrer"
            className={`w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 ${hoverClasses[color]}`}
        >
            <Icon size={14} />
        </a>
    );
};

export default Footer;