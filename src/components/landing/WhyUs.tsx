import React from 'react';
import { ShieldCheck, Clock, Zap, Heart } from 'lucide-react';

export const WhyUs = () => {
  return (
    <section className="py-24 lg:py-32 bg-[#f5f8fc] relative">
      {/* Subtle Grid Texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#0359a7 1px, transparent 1px), linear-gradient(to right, #0359a7 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h2 className="font-inter font-bold text-5xl tracking-tight text-black">Pourquoi nous choisir</h2>
          <p className="font-poppins font-light text-lg text-[#6b7280] mt-3">Ce qui fait de DentalCare le choix numéro un pour votre sourire.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Tile 1: Extreme Durability */}
          <div className="col-span-1 md:col-span-2 lg:row-span-2 bg-primary rounded-[24px] p-8 lg:p-11 flex flex-col justify-between min-h-[380px] relative overflow-hidden group hover:scale-[1.01] hover:shadow-[0_20px_60px_rgba(3,89,167,0.3)] transition-all duration-400">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center mix-blend-overlay opacity-15"></div>
            {/* Decor */}
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[3px] border-r-[3px] border-accent rounded-br-[24px] transform translate-x-4 translate-y-4"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-[14px] flex items-center justify-center mb-6 backdrop-blur-sm">
                <ShieldCheck className="text-white w-8 h-8" strokeWidth={1.5} />
              </div>
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="font-inter font-semibold text-2xl text-white mb-3">Hygiène irréprochable</h3>
              <p className="font-poppins font-light text-base text-white/80 leading-[1.65]">
                Conçu pour durer dans toutes les conditions. Nos protocoles d'hygiène et de stérilisation dépassent les normes les plus strictes pour assurer votre sécurité à chaque visite.
              </p>
            </div>
          </div>

          {/* Tile 2: Weather Resistance */}
          <div className="col-span-1 md:col-span-2 lg:row-span-1 bg-white border border-[#e2e8f0] rounded-[20px] p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:border-primary hover:shadow-[0_8px_32px_rgba(3,89,167,0.12)] hover:-translate-y-[3px] transition-all duration-300">
            <div className="w-14 h-14 shrink-0 bg-primary/10 rounded-[14px] flex items-center justify-center">
              <Heart className="text-primary w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-inter font-semibold text-xl text-black mb-2">Confort et écoute</h3>
              <p className="font-poppins font-light text-sm text-[#4a5568] leading-[1.65]">
                Une expérience rassurante et agréable, avec une prise en charge de la douleur optimale.
              </p>
            </div>
          </div>

          {/* Tile 3: Fast Installation */}
          <div className="col-span-1 lg:row-span-1 bg-primary/10 rounded-[20px] p-8 flex flex-col justify-between group hover:bg-primary/20 hover:-translate-y-[3px] transition-all duration-300">
            <Clock className="text-primary mb-6 w-8 h-8" strokeWidth={1.5} />
            <div>
              <h3 className="font-inter font-semibold text-xl text-black mb-2">Prise en charge rapide</h3>
              <p className="font-poppins font-light text-sm text-[#4a5568] leading-[1.65]">
                Des processus optimisés pour réduire votre temps d'attente en clinique.
              </p>
            </div>
          </div>

          {/* Tile 4: Innovation */}
          <div className="col-span-1 lg:row-span-1 bg-white border border-[#e2e8f0] rounded-[20px] p-8 flex flex-col justify-between group hover:border-primary hover:-translate-y-[3px] transition-all duration-300">
            <Zap className="text-accent mb-6 w-8 h-8" strokeWidth={1.5} />
            <div>
              <h3 className="font-inter font-semibold text-xl text-black mb-2">Innovation</h3>
              <p className="font-poppins font-light text-sm text-[#4a5568] leading-[1.65]">
                Équipements de pointe et technologies 3D pour des soins ultra-précis.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
