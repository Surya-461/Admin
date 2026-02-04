import React, { useState, useRef } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaChevronDown, FaPaperPlane } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore';

const Contact = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // --- EmailJS Configuration ---
  const SERVICE_ID = "service_brysr3x";
  const TEMPLATE_ID = "template_4dsa0lb";
  const PUBLIC_KEY = "dcoKRc6bEwZdTKrGH";

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(formRef.current);
      const data = Object.fromEntries(formData.entries());

      // Save to Firestore
      await addDoc(collection(db, "contact_messages"), {
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        createdAt: new Date(),
        status: 'unread'
      });

      // Send Email via EmailJS
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);

      toast.success("Message sent successfully!");
      e.target.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { question: "How long does it take to deploy?", answer: "Deployment is instant. Once you subscribe, your credentials are sent to your email immediately." },
    { question: "Can I upgrade my plan later?", answer: "Yes! You can upgrade from the Starter plan to Growth or Enterprise at any time from your dashboard." },
    { question: "Do you offer custom integrations?", answer: "Absolutely. Our Enterprise plan includes dedicated API support for connecting with your existing tools." }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
        {/* Abstract Background Blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white">
          Get in <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">Touch</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
           Have questions about deployment? Need a custom plan? <br className="hidden md:block"/> Our team is ready to help you scale your retail business.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* --- LEFT COLUMN: Contact Info --- */}
          <div className="space-y-6 lg:col-span-1">
            <ContactCard 
              icon={FaEnvelope} 
              title="Chat with us" 
              info="support@gshservices.com" 
              subInfo="We reply within 2 hours"
              color="blue"
              href="mailto:support@gshservices.com"
            />
            <ContactCard 
              icon={FaPhone} 
              title="Call Support" 
              info="+91 63031 25585" 
              subInfo="Mon-Fri, 9am to 6pm IST"
              color="emerald"
              href="tel:+916303125585"
            />
            <ContactCard 
              icon={FaMapMarkerAlt} 
              title="Visit HQ" 
              info="123 Tech Park, Hitech City" 
              subInfo="Hyderabad, Telangana, 500081"
              color="purple"
            />

            {/* Social Links */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
               <SocialBtn icon={FaTwitter} />
               <SocialBtn icon={FaLinkedin} />
               <SocialBtn icon={FaGithub} />
               <SocialBtn icon={FaInstagram} />
            </div>
          </div>

          {/* --- RIGHT COLUMN: Contact Form --- */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

               <form ref={formRef} onSubmit={handleSendEmail} className="relative z-10 space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
                    <p className="text-slate-400 text-sm">Fill out the form below and we'll get back to you shortly.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup label="First Name" name="first_name" placeholder="John" />
                    <InputGroup label="Last Name" name="last_name" placeholder="Doe" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <InputGroup label="Email Address" name="email" type="email" placeholder="john@company.com" />
                     <InputGroup label="Phone Number" name="phone" type="tel" placeholder="+91 98765 43210" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Subject</label>
                    <div className="relative">
                      <select name="subject" className="w-full bg-slate-950/50 border border-slate-700 hover:border-slate-600 rounded-xl p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition appearance-none cursor-pointer">
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Sales & Pricing">Sales & Pricing</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Partnership">Partnership</option>
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={12}/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Message</label>
                    <textarea 
                      name="message" 
                      required 
                      rows="4" 
                      placeholder="Tell us how we can help..." 
                      className="w-full bg-slate-950/50 border border-slate-700 hover:border-slate-600 rounded-xl p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FaPaperPlane size={14} />
                      </>
                    )}
                  </button>
               </form>
            </div>
          </div>
        </div>

        {/* --- MAP SECTION --- */}
        <div className="mt-20 h-96 w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
           {/* Overlay to darken map slightly until hover */}
           <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 pointer-events-none z-10"></div>
           <iframe 
             title="GSH Office Location"
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.453308967523!2d78.375833!3d17.443056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dc8c5d69df%3A0x19688eb5c550c0!2sHITEC%20City%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
             width="100%" 
             height="100%" 
             style={{border:0, filter: 'grayscale(100%) invert(92%) contrast(83%)'}} 
             className="group-hover:filter-none transition-all duration-700"
             allowFullScreen="" 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
           ></iframe>
        </div>

        {/* --- FAQ SECTION --- */}
        <div className="mt-24 max-w-3xl mx-auto">
           <h2 className="text-3xl font-bold text-center mb-2 text-white">Frequently Asked Questions</h2>
           <p className="text-center text-slate-400 mb-10">Everything you need to know about the product and billing.</p>
           
           <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
                   <button 
                    onClick={() => toggleFaq(idx)} 
                    className="w-full flex justify-between items-center p-6 text-left outline-none"
                   >
                      <span className="font-semibold text-lg text-slate-200">{faq.question}</span>
                      <div className={`p-2 rounded-full bg-slate-800 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 bg-blue-600 text-white' : 'text-slate-400'}`}>
                        <FaChevronDown size={14} />
                      </div>
                   </button>
                   <div 
                    className={`grid transition-all duration-300 ease-in-out ${openFaq === idx ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'}`}
                   >
                      <div className="overflow-hidden px-6">
                        <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

// --- Helper Components ---

const InputGroup = ({ label, name, type = "text", placeholder }) => (
  <div>
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">{label}</label>
    <input 
      name={name} 
      required 
      type={type} 
      placeholder={placeholder} 
      className="w-full bg-slate-950/50 border border-slate-700 hover:border-slate-600 rounded-xl p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition placeholder-slate-600" 
    />
  </div>
);

const ContactCard = ({ icon: Icon, title, info, subInfo, color, href }) => {
  const colors = {
    blue: "text-blue-400 bg-blue-500/10 group-hover:bg-blue-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20",
    purple: "text-purple-400 bg-purple-500/10 group-hover:bg-purple-500/20"
  };

  const Content = () => (
    <div className="flex items-start gap-5">
       <div className={`p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 ${colors[color]}`}>
          <Icon size={22} />
       </div>
       <div>
          <h3 className="font-bold text-lg text-white mb-0.5">{title}</h3>
          <p className="text-slate-300 font-medium">{info}</p>
          {subInfo && <p className="text-slate-500 text-xs mt-1">{subInfo}</p>}
       </div>
    </div>
  );

  const wrapperClasses = "block w-full bg-slate-900/50 backdrop-blur border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all duration-300 group hover:-translate-y-1";

  return href ? (
    <a href={href} className={wrapperClasses}><Content /></a>
  ) : (
    <div className={wrapperClasses}><Content /></div>
  );
};

const SocialBtn = ({ icon: Icon }) => (
  <a href="#" className="w-11 h-11 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 shadow-lg">
     <Icon size={18} />
  </a>
);

export default Contact;