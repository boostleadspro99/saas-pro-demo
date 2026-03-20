import React from 'react';
import { motion } from 'motion/react';
import { Linkedin, Twitter, Mail } from 'lucide-react';

export const Team = () => {
  return (
    <section id="equipe" className="py-32 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=1000" 
                alt="Dr. Sarah Mansouri" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Experience Badge */}
            <div className="absolute -top-6 -left-6 z-20 bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
              <div className="text-3xl font-bold text-secondary mb-1 tracking-tighter">15+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ans d'expertise</div>
            </div>
          </motion.div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-6">
              Praticien Principal
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 tracking-tighter">
              Une expertise humaine <br />
              <span className="text-secondary">au service de votre santé.</span>
            </h2>
            <p className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Dr. Sarah Mansouri</p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Diplômée des plus grandes facultés et passionnée par l'innovation dentaire, le Dr. Mansouri dirige le cabinet avec une vision claire : offrir des soins d'excellence tout en garantissant un confort absolu à chaque patient.
            </p>
            
            <div className="flex items-center gap-4 mb-12">
              {[Linkedin, Twitter, Mail].map((Icon, i) => (
                <button key={i} className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-secondary hover:border-secondary/20 transition-all shadow-sm">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            <div className="p-8 rounded-3xl bg-secondary text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-lg font-medium italic mb-4 opacity-90">
                  "Chaque sourire est unique. Notre mission est de préserver votre capital santé tout en sublimant votre esthétique naturelle."
                </p>
                <p className="text-sm font-bold uppercase tracking-widest opacity-70">— Dr. Sarah Mansouri</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
