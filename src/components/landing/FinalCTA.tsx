import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinalCTA = () => {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
        <div className="bg-primary rounded-[32px] p-10 lg:p-20 relative overflow-hidden text-center">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-white/10 rotate-12 blur-3xl"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[150%] bg-accent/20 -rotate-12 blur-3xl"></div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center mix-blend-overlay opacity-10"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-inter font-bold text-4xl lg:text-6xl tracking-tight text-white mb-6">
              Prêt à transformer votre sourire ?
            </h2>
            <p className="font-poppins font-light text-lg lg:text-xl text-white/80 mb-10">
              Prenez rendez-vous dès aujourd'hui pour une consultation personnalisée. Notre équipe d'experts est là pour vous accompagner vers une santé dentaire optimale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/book" className="w-full sm:w-auto bg-white text-primary font-inter font-semibold text-base px-8 py-4 rounded-full hover:bg-[#f8fafc] hover:shadow-[0_8px_24px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center justify-center gap-2">
                Prendre Rendez-vous <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:+212522000000" className="w-full sm:w-auto bg-transparent border border-white/30 text-white font-inter font-semibold text-base px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center justify-center">
                Appeler le +212 5 22 00 00 00
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
