import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Wind, Sparkles, Scissors, Flower2, Menu, X, Phone, 
  MapPin, MessageCircle, Star, Send, Loader2,
  Instagram, Facebook
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- CONFIGURATION ---
const CONTACT_INFO = {
  phone: '0767-071518',
  phoneClean: '+212767071518',
  whatsapp: '212767071518',
  address: 'Avenue de Jabel Tazzaka, Rabat 10000, Morocco',
  googleMapsUrl: 'https://www.google.com/maps/search/MD+SPA+Rabat+Avenue+de+Jabel+Tazzaka'
};

const SERVICES = [
  { id: '1', title: 'Massage & Hammam', icon: <Wind size={24} />, img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200', desc: 'A traditional Moroccan steam journey of purification and peace.' },
  { id: '2', title: 'Precision Waxing', icon: <Scissors size={24} />, img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1200', desc: 'Expert hair removal services designed for smooth, glowing skin.' },
  { id: '3', title: 'Nail Artistry', icon: <Sparkles size={24} />, img: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=1200', desc: 'Bespoke manicure and pedicure rituals using premium care.' },
  { id: '4', title: 'Body Sculpting', icon: <Flower2 size={24} />, img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200', desc: 'Advanced body care blending holistic and modern beauty tech.' }
];

const OPENING_HOURS = [
  { day: 'Monday', open: '10:00', close: '22:00' },
  { day: 'Tuesday', open: '10:00', close: '22:00' },
  { day: 'Wednesday', open: '10:00', close: '21:00' },
  { day: 'Thursday', open: '10:00', close: '22:00' },
  { day: 'Friday', open: '10:00', close: '22:00' },
  { day: 'Saturday', open: '10:00', close: '22:00' },
  { day: 'Sunday', open: '10:00', close: '21:30' },
];

const isSpaOpen = () => {
  const now = new Date();
  const moroccoTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Casablanca' }));
  const dayName = moroccoTime.toLocaleDateString('en-US', { weekday: 'long' });
  const hr = moroccoTime.getHours();
  const min = moroccoTime.getMinutes();
  const total = hr * 60 + min;
  const today = OPENING_HOURS.find(h => h.day === dayName);
  if (!today) return false;
  const [oH, oM] = today.open.split(':').map(Number);
  const [cH, cM] = today.close.split(':').map(Number);
  return total >= (oH * 60 + oM) && total <= (cH * 60 + cM);
};

// --- APP COMPONENT ---
const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([{role: 'bot', text: "Welcome to MD SPA. How can I guide your relaxation journey today?"}]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!query.trim() || loading) return;
    const userMsg = query;
    setMessages(p => [...p, {role: 'user', text: userMsg}]);
    setQuery('');
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { systemInstruction: "You are the MD SPA Rabat Concierge. Be elegant. Suggest our services (Hammam, Waxing, Nails, Sculpting). Keep it under 40 words." }
      });
      setMessages(p => [...p, {role: 'bot', text: res.text || "Please call us at " + CONTACT_INFO.phone}]);
    } catch {
      setMessages(p => [...p, {role: 'bot', text: "Please call our concierge at " + CONTACT_INFO.phone}]);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-spa-sand font-sans text-spa-charcoal">
      {/* Nav */}
      <nav className={`fixed w-full z-50 transition-all p-6 flex justify-between items-center ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <a href="#" className="text-2xl font-serif font-bold tracking-widest">MD <span className="text-spa-gold">SPA</span></a>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-spa-charcoal"><Menu/></button>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2400" className="absolute inset-0 w-full h-full object-cover animate-zoom" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-white space-y-6">
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold opacity-80">Rabat's Premier Sanctuary</p>
          <h1 className="text-6xl md:text-9xl font-serif italic">Sublime Serenity</h1>
          <a href="#contact" className="inline-block bg-spa-gold text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest mt-6">Book Ritual</a>
        </div>
      </section>

      {/* Services */}
      <section id="rituals" className="py-24 px-6 bg-white space-y-16">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h2 className="text-5xl font-serif italic">The Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map(s => (
              <div key={s.id} className="group relative h-[450px] rounded-[2rem] overflow-hidden shadow-xl">
                <img src={s.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end text-white text-left">
                  <h3 className="text-2xl font-serif mb-2">{s.title}</h3>
                  <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} className="text-[9px] font-bold uppercase tracking-widest border border-white/20 px-6 py-3 rounded-full w-fit hover:bg-white hover:text-spa-charcoal transition-all">Reserve</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hours */}
      <section className="py-24 px-6 bg-spa-sand">
        <div className="max-w-xl mx-auto bg-white p-10 rounded-[3rem] shadow-xl text-center space-y-8">
          <h2 className="text-3xl font-serif">Visiting Hours</h2>
          <div className={`inline-block px-4 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest ${isSpaOpen() ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
            {isSpaOpen() ? '● Open Now' : '○ Currently Closed'}
          </div>
          <div className="space-y-4">
            {OPENING_HOURS.map(h => (
              <div key={h.day} className="flex justify-between py-3 border-b border-spa-sand/50 last:border-0">
                <span className="text-[9px] font-bold uppercase opacity-30 tracking-widest">{h.day}</span>
                <span className="font-serif text-lg">{h.open} — {h.close}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 bg-white text-center space-y-8">
        <h2 className="text-5xl font-serif italic text-spa-gold">Connect</h2>
        <a href={`tel:${CONTACT_INFO.phoneClean}`} className="text-3xl font-serif block">{CONTACT_INFO.phone}</a>
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">{CONTACT_INFO.address}</p>
        <div className="flex justify-center gap-4 pt-4">
          <a href="#" className="p-3 bg-spa-sand rounded-full"><Instagram size={18}/></a>
          <a href="#" className="p-3 bg-spa-sand rounded-full"><Facebook size={18}/></a>
        </div>
      </section>

      {/* WhatsApp Button */}
      <div className="fixed bottom-6 left-6 z-[90]">
        <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex hover:scale-110 transition-transform">
          <MessageCircle size={24} fill="white" />
        </a>
      </div>

      {/* AI Button */}
      <div className="fixed bottom-6 right-6 z-[100]">
        {aiOpen ? (
          <div className="bg-white rounded-[2rem] shadow-2xl w-[85vw] md:w-80 overflow-hidden border flex flex-col">
            <div className="bg-spa-charcoal p-4 text-white flex justify-between items-center">
              <span className="font-serif italic">Concierge</span>
              <button onClick={()=>setAiOpen(false)}><X size={18}/></button>
            </div>
            <div className="h-60 overflow-y-auto p-4 space-y-4 text-[11px] bg-spa-sand/30">
              {messages.map((m,i)=>(
                <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl ${m.role==='user'?'bg-spa-gold text-white':'bg-white border'}`}>{m.text}</div>
                </div>
              ))}
              {loading && <Loader2 className="animate-spin text-spa-gold mx-auto" size={16}/>}
            </div>
            <form onSubmit={handleAsk} className="p-3 bg-white border-t flex gap-2">
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Your mood..." className="flex-1 bg-spa-sand px-4 py-2 rounded-full text-[10px] outline-none" />
              <button type="submit" className="bg-spa-gold text-white p-2 rounded-full"><Send size={14}/></button>
            </form>
          </div>
        ) : (
          <button onClick={()=>setAiOpen(true)} className="bg-spa-charcoal text-white p-4 rounded-full shadow-2xl flex items-center gap-2">
            <Star size={14} fill="#C5A059" className="text-spa-gold"/>
            <span className="text-[9px] font-bold uppercase tracking-widest">Advice</span>
          </button>
        )}
      </div>

      <footer className="bg-spa-charcoal py-10 text-center text-white/20 text-[8px] uppercase tracking-widest">
        <p>© 2024 MD SPA RABAT</p>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
