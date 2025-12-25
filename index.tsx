import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Wind, Sparkles, Scissors, Flower2, Menu, X, Phone, 
  MapPin, MessageCircle, Star, Send, Loader2,
  Instagram, Facebook
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const CONTACT = { phone: '0767-071518', whatsapp: '212767071518', address: 'Avenue de Jabel Tazzaka, Rabat' };

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([{role: 'bot', text: "Welcome to MD SPA Rabat. How can I help you today?"}]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => setScrolled(window.scrollY > 50));
  }, []);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!query.trim() || loading) return;
    const msg = query; setQuery(''); setLoading(true);
    setMessages(p => [...p, {role: 'user', text: msg}]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: msg,
        config: { systemInstruction: "You are MD SPA Concierge. Be elegant. Recommend Hammam, Nails, or Waxing. Brief responses." }
      });
      setMessages(p => [...p, {role: 'bot', text: res.text || "Please call " + CONTACT.phone}]);
    } catch {
      setMessages(p => [...p, {role: 'bot', text: "Call us at " + CONTACT.phone}]);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen">
      <nav className={`fixed w-full z-50 p-6 flex justify-between items-center transition-all ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <span className="text-2xl font-serif font-bold tracking-tighter">MD <span className="text-spa-gold">SPA</span></span>
        <a href="#contact" className="bg-spa-gold text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">Book</a>
      </nav>

      <section className="relative h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">
        <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover animate-zoom" />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 space-y-4 px-6">
          <h1 className="text-6xl font-serif italic">Sublime Serenity</h1>
          <p className="opacity-80 uppercase tracking-[0.4em] text-[10px]">Rabat's Finest Sanctuary</p>
        </div>
      </section>

      <section className="py-20 px-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {t: 'Hammam', i: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800'},
          {t: 'Nails', i: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800'},
          {t: 'Sculpting', i: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800'}
        ].map(s => (
          <div key={s.t} className="h-96 rounded-[2rem] overflow-hidden relative shadow-lg">
            <img src={s.i} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 flex flex-col justify-end p-8 text-white">
              <h3 className="text-2xl font-serif">{s.t}</h3>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} className="text-[10px] uppercase font-bold tracking-widest mt-2 border-b w-fit border-spa-gold">Reserve</a>
            </div>
          </div>
        ))}
      </section>

      <section id="contact" className="py-20 bg-white text-center space-y-4">
        <h2 className="text-4xl font-serif text-spa-gold italic">Connect</h2>
        <p className="text-2xl font-serif">{CONTACT.phone}</p>
        <p className="text-[10px] uppercase opacity-40">{CONTACT.address}</p>
      </section>

      <div className="fixed bottom-6 left-6 z-50">
        <a href={`https://wa.me/${CONTACT.whatsapp}`} className="bg-[#25D366] text-white p-4 rounded-full shadow-xl flex"><MessageCircle/></a>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        {aiOpen ? (
          <div className="bg-white rounded-[2rem] shadow-2xl w-[80vw] md:w-80 overflow-hidden border">
            <div className="bg-spa-charcoal p-4 text-white flex justify-between"><span className="font-serif italic">Concierge</span><button onClick={()=>setAiOpen(false)}><X size={18}/></button></div>
            <div className="h-60 overflow-y-auto p-4 space-y-3 bg-spa-sand/30 text-[11px]">
              {messages.map((m,i)=>(<div key={i} className={`p-3 rounded-xl ${m.role==='user'?'bg-spa-gold text-white ml-auto':'bg-white border mr-auto'} max-w-[90%]`}>{m.text}</div>))}
              {loading && <Loader2 className="animate-spin text-spa-gold mx-auto"/>}
            </div>
            <form onSubmit={handleAsk} className="p-3 border-t flex gap-2"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="How can I help?" className="flex-1 bg-spa-sand px-4 py-2 rounded-full text-[10px] outline-none"/><button type="submit" className="bg-spa-gold text-white p-2 rounded-full"><Send size={14}/></button></form>
          </div>
        ) : (
          <button onClick={()=>setAiOpen(true)} className="bg-spa-charcoal text-spa-gold p-4 rounded-full shadow-xl flex items-center gap-2 font-bold text-[9px] tracking-widest uppercase"><Star size={14} fill="currentColor"/> Advice</button>
        )}
      </div>

      <footer className="bg-spa-charcoal py-10 text-white/20 text-[8px] text-center tracking-widest">© 2024 MD SPA RABAT</footer>
    </div>
  );
};
createRoot(document.getElementById('root')!).render(<App />);
