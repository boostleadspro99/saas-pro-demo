import React from 'react';

export const About = () => {
  return (
    <section id="about" className="py-24 lg:py-32 relative bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-col lg:flex-row gap-16 items-center relative z-10">
        {/* Left Column */}
        <div className="lg:w-[55%]">
          <div className="inline-block bg-primary/10 text-primary font-poppins font-semibold text-xs uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full mb-5">
            Le Standard DentalCare
          </div>
          <h2 className="font-inter font-bold text-4xl lg:text-5xl leading-[1.1] tracking-tight text-black mb-6">
            Expertise, Confort, et <span className="relative inline-block">Sourires Durables<span className="absolute bottom-1 left-0 w-full h-[3px] bg-primary"></span></span>
          </h2>
          <p className="font-poppins font-light text-lg text-[#4a5568] leading-relaxed mb-12">
            DentalCare est un nom de confiance dans les solutions dentaires, offrant des soins de haute qualité tels que l'implantologie, l'esthétique et l'orthodontie. Nous menons l'industrie avec des traitements centrés sur le patient, des technologies de pointe et une qualité exceptionnelle dans chaque sourire que nous restaurons. Notre mission est de créer un avenir sain en offrant des soins dentaires qui allient expertise, innovation et élégance.
          </p>

          {/* 2x2 Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f5f8fc] border border-[#e2e8f0] rounded-[16px] p-6 group hover:border-primary hover:shadow-[0_4px_16px_rgba(3,89,167,0.1)] hover:-translate-y-1 transition-all duration-300">
              <div className="font-inter font-extrabold text-3xl text-primary mb-1">15+</div>
              <div className="font-poppins font-normal text-xs uppercase tracking-[0.15em] text-[#6b7280]">Années d'expérience</div>
            </div>
            <div className="bg-[#f5f8fc] border border-[#e2e8f0] rounded-[16px] p-6 group hover:border-primary hover:shadow-[0_4px_16px_rgba(3,89,167,0.1)] hover:-translate-y-1 transition-all duration-300">
              <div className="font-inter font-extrabold text-3xl text-primary mb-1">1200+</div>
              <div className="font-poppins font-normal text-xs uppercase tracking-[0.15em] text-[#6b7280]">Patients traités</div>
            </div>
            <div className="bg-[#f5f8fc] border border-[#e2e8f0] rounded-[16px] p-6 group hover:border-primary hover:shadow-[0_4px_16px_rgba(3,89,167,0.1)] hover:-translate-y-1 transition-all duration-300">
              <div className="font-inter font-extrabold text-3xl text-primary mb-1">98%</div>
              <div className="font-poppins font-normal text-xs uppercase tracking-[0.15em] text-[#6b7280]">Satisfaction</div>
            </div>
            <div className="bg-[#f5f8fc] border border-[#e2e8f0] rounded-[16px] p-6 group hover:border-primary hover:shadow-[0_4px_16px_rgba(3,89,167,0.1)] hover:-translate-y-1 transition-all duration-300">
              <div className="font-inter font-extrabold text-3xl text-primary mb-1">4.9/5</div>
              <div className="font-poppins font-normal text-xs uppercase tracking-[0.15em] text-[#6b7280]">Avis clients</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-[45%] relative">
          <div className="rounded-[24px] overflow-hidden border border-primary shadow-[0_20px_60px_rgba(3,89,167,0.15)] h-[520px]">
            <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Dentiste au travail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          {/* Floating Badge */}
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md border border-primary/20 rounded-[14px] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.1)] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span className="font-poppins font-semibold text-sm text-primary">Qualité Certifiée</span>
          </div>
        </div>
      </div>
    </section>
  );
};
