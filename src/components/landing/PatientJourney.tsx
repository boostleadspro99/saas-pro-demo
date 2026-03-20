import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Stethoscope, Sparkles } from 'lucide-react';

const steps = [
  {
    title: 'Prise de rendez-vous',
    description: 'Ici commence votre parcours avec une prise de contact simple',
    icon: Calendar,
  },
  {
    title: 'Consultation',
    description: 'Analyse, diagnostic et proposition de traitement',
    icon: Stethoscope,
  },
  {
    title: 'Suivi et résultats',
    description: 'Accompagnement jusqu’au résultat final',
    icon: Sparkles,
  },
];

export const PatientJourney = () => {
  return (
    <section id="parcours" className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-primary mb-6 tracking-tight"
          >
            Votre parcours en 3 étapes
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed"
          >
            Une expérience fluide et transparente, de votre premier clic à votre nouveau sourire.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-12 left-[15%] right-[15%] h-0.5 bg-slate-100 hidden lg:block" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Step Number and Icon */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full bg-white border-2 border-slate-100 shadow-xl flex items-center justify-center text-primary group-hover:border-primary transition-all duration-500">
                    <step.icon className="w-10 h-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
