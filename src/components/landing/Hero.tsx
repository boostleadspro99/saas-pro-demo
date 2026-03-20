import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export const Hero = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
      counters.forEach(counter => {
        const updateCount = () => {
          const target = +(counter.getAttribute('data-target') || 0);
          const count = +counter.innerHTML;
          const inc = target / speed;

          if (count < target) {
            counter.innerHTML = Math.ceil(count + inc).toString();
            setTimeout(updateCount, 15);
          } else {
            counter.innerHTML = target.toString();
          }
        };
        updateCount();
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[700px] flex items-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80')" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary-dark/60"></div>

      {/* Content */}
      <div className="lg:px-20 lg:pt-2 w-full max-w-7xl z-10 mx-auto pt-20 px-6 relative flex flex-col items-center text-center">
        <div className="max-w-4xl flex flex-col items-center">
          <div className="inline-flex uppercase text-xs font-medium text-white tracking-[0.15em] font-poppins bg-primary/30 border-primary/50 border rounded-full mb-8 pt-1.5 pr-4 pb-1.5 pl-4 backdrop-blur-md items-center">
            Cabinet dentaire d'excellence
          </div>
          
          <h1 className="font-inter font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight text-white mb-8 max-w-3xl">
            <span className="block animate-slide-up-1">Un sourire sain commence</span>
            <span className="block animate-slide-up-2 relative inline-block mt-2">
              par des soins de qualité.
              <span className="absolute -bottom-2 left-0 h-[3px] bg-accent animate-expand-line"></span>
            </span>
          </h1>
          
          <p className="font-poppins text-white/90 text-lg md:text-xl max-w-2xl mb-10 animate-slide-up-3 font-light">
            Découvrez une approche moderne de la dentisterie, alliant technologie de pointe et confort absolu pour révéler votre plus beau sourire.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link to="/book" className="animate-slide-up-btn-1 inline-flex items-center justify-center hover:bg-primary-light hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgba(3,89,167,0.6)] transition-all duration-300 text-base font-semibold text-white font-inter bg-primary rounded-[10px] pt-4 pr-9 pb-4 pl-9 shadow-[0_8px_32px_rgba(3,89,167,0.5)] w-full sm:w-auto">
              Prendre rendez-vous
            </Link>
            <a href="#services" className="animate-slide-up-btn-2 inline-flex items-center justify-center border-[1.5px] hover:bg-white/20 hover:border-white transition-all duration-300 text-base font-semibold text-white font-inter bg-white/10 border-white/50 rounded-[10px] pt-4 pr-9 pb-4 pl-9 backdrop-blur-md w-full sm:w-auto">
              Nos Services
            </a>
          </div>
        </div>
      </div>

      {/* Floating Stat Strip */}
      <div ref={statsRef} className="absolute bottom-0 w-full bg-white/10 backdrop-blur-[20px] border-t border-white/20 px-6 lg:px-20 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:flex md:items-center md:justify-between gap-y-6 md:gap-y-0 md:divide-x divide-white/20 text-center md:text-left">
          <div className="flex-1 md:px-8 md:first:pl-0">
            <div className="font-inter font-extrabold text-3xl md:text-4xl text-white mb-1"><span className="counter" data-target="15">0</span>+</div>
            <div className="font-poppins font-normal text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/70">Années d'expérience</div>
          </div>
          <div className="flex-1 md:px-8">
            <div className="font-inter font-extrabold text-3xl md:text-4xl text-white mb-1"><span className="counter" data-target="1200">0</span>+</div>
            <div className="font-poppins font-normal text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/70">Patients traités</div>
          </div>
          <div className="flex-1 md:px-8">
            <div className="font-inter font-extrabold text-3xl md:text-4xl text-white mb-1"><span className="counter" data-target="98">0</span>%</div>
            <div className="font-poppins font-normal text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/70">Satisfaction</div>
          </div>
          <div className="flex-1 md:px-8 md:last:pr-0">
            <div className="text-3xl md:text-4xl font-extrabold text-white font-inter mb-1"><span className="counter" data-target="5">0</span>/5</div>
            <div className="font-poppins font-normal text-[10px] md:text-xs uppercase tracking-[0.15em] text-white/70">Avis clients</div>
          </div>
        </div>
      </div>
    </section>
  );
};
