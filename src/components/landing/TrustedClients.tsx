import React from 'react';

export const TrustedClients = () => {
  return (
    <section className="py-12 bg-white border-b border-[#f1f5f9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 mb-6 text-center">
        <p className="font-poppins font-medium text-sm text-[#94a3b8] uppercase tracking-widest">Ils nous font confiance</p>
      </div>
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16 lg:gap-24 px-8">
          {/* First set */}
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">Invisalign</span>
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">Straumann</span>
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">Nobel Biocare</span>
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">Philips Zoom</span>
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">Ivoclar</span>
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">3M Oral Care</span>
          {/* Duplicated set for seamless loop */}
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">Invisalign</span>
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">Straumann</span>
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">Nobel Biocare</span>
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">Philips Zoom</span>
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">Ivoclar</span>
          <span className="font-inter font-bold text-2xl text-[#cbd5e1] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">3M Oral Care</span>
        </div>
        {/* Gradient Fades */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
};
