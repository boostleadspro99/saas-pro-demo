import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFaqs, FAQ } from '../lib/faq';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isFallback?: boolean;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Bonjour ! Je suis l\'assistant virtuel du cabinet. Comment puis-je vous aider ? (Ex: horaires, tarifs, services)',
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFaqs().then(setFaqs);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Process response
    setTimeout(() => {
      const lowerInput = userMsg.text.toLowerCase();
      
      // Medical advice check
      const medicalKeywords = ['douleur', 'mal', 'saigne', 'gonflé', 'urgence', 'abcès', 'médicament', 'antibiotique', 'dent de sagesse', 'carie'];
      const isMedical = medicalKeywords.some(kw => lowerInput.includes(kw));
      
      if (isMedical) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: 'Je ne peux pas donner de conseils médicaux précis. Pour toute urgence ou problème médical, veuillez nous contacter directement ou prendre rendez-vous pour une consultation.',
          sender: 'bot',
          isFallback: true
        }]);
        return;
      }

      // Find matching FAQ
      let bestMatch: FAQ | null = null;
      let maxMatches = 0;

      for (const faq of faqs) {
        const matches = faq.keywords.filter(kw => lowerInput.includes(kw.toLowerCase())).length;
        if (matches > maxMatches) {
          maxMatches = matches;
          bestMatch = faq;
        }
      }

      if (bestMatch && maxMatches > 0) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: bestMatch.answer,
          sender: 'bot'
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: 'Je ne suis pas sûr de comprendre. Souhaitez-vous prendre rendez-vous ou parler à notre équipe ?',
          sender: 'bot',
          isFallback: true
        }]);
      }
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[320px] sm:w-[380px] mb-4 overflow-hidden flex flex-col h-[500px] max-h-[80vh] animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* Header */}
          <div className="bg-secondary p-4 flex items-center justify-between text-white shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Assistant DentalCare</h3>
                <p className="text-secondary-light text-xs">Répond instantanément</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-secondary-light hover:text-white transition-colors p-1 hover:bg-white/10 rounded-md">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.sender === 'user' 
                    ? 'bg-secondary text-white rounded-tr-sm shadow-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
                
                {msg.isFallback && (
                  <div className="mt-3 flex flex-col gap-2 w-full max-w-[85%] animate-in fade-in slide-in-from-top-2 duration-300">
                    <Link 
                      to="/book" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-secondary/20 text-secondary rounded-xl text-sm font-medium hover:bg-secondary/5 transition-colors shadow-sm"
                    >
                      <Calendar className="h-4 w-4" />
                      Prendre rendez-vous
                    </Link>
                    <a 
                      href="https://wa.me/1234567890" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#128C7E] transition-colors shadow-sm"
                    >
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full p-1 pr-1.5 focus-within:ring-2 focus-within:ring-secondary/20 focus-within:border-secondary transition-all">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-slate-700 placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-secondary text-white rounded-full hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300 bg-secondary text-white p-4 rounded-full shadow-lg hover:bg-secondary-dark hover:shadow-xl hover:-translate-y-1 flex items-center justify-center group`}
      >
        <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
