import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Services = () => {
  return (
    <section id="services" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-28">
          <div className="inline-block bg-primary/10 text-primary font-poppins font-semibold text-xs uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full mb-5">
            Nos Services
          </div>
          <h2 className="font-inter font-bold text-4xl lg:text-5xl tracking-tight text-black mb-6">
            Des solutions dentaires pour chaque besoin
          </h2>
          <p className="font-poppins font-light text-lg text-[#6b7280]">
            Des soins préventifs aux restaurations complexes, nous offrons une gamme complète de services pour préserver et sublimer votre sourire.
          </p>
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
          
          {/* Product 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-inter font-bold text-xl">01</div>
                <h3 className="font-inter font-bold text-3xl text-black">Implantologie</h3>
              </div>
              <p className="font-poppins font-light text-lg text-[#4a5568] leading-relaxed mb-8">
                Retrouvez le confort et l'esthétique de vos dents naturelles avec nos solutions d'implants dentaires de haute précision. Une technologie de pointe pour des résultats durables et un sourire confiant.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="font-poppins font-normal text-[#4a5568]">Matériaux biocompatibles de première qualité</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="font-poppins font-normal text-[#4a5568]">Planification 3D pour une précision chirurgicale</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="font-poppins font-normal text-[#4a5568]">Restauration complète de la fonction masticatoire</span>
                </li>
              </ul>
              <button className="group inline-flex items-center gap-2 font-poppins font-medium text-primary hover:text-accent transition-colors">
                En savoir plus <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[32px] transform translate-x-4 translate-y-4 -z-10"></div>
              <div className="rounded-[32px] overflow-hidden border border-[#e2e8f0] shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Implantologie" className="w-full h-auto object-cover aspect-[4/3]" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>

          {/* Product 2 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-accent/5 rounded-[32px] transform -translate-x-4 translate-y-4 -z-10"></div>
              <div className="rounded-[32px] overflow-hidden border border-[#e2e8f0] shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Esthétique Dentaire" className="w-full h-auto object-cover aspect-[4/3]" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-inter font-bold text-xl">02</div>
                <h3 className="font-inter font-bold text-3xl text-black">Esthétique Dentaire</h3>
              </div>
              <p className="font-poppins font-light text-lg text-[#4a5568] leading-relaxed mb-8">
                Sublimez votre sourire avec nos traitements esthétiques sur mesure. Du blanchiment professionnel aux facettes en céramique, nous créons l'harmonie parfaite pour votre visage.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="font-poppins font-normal text-[#4a5568]">Blanchiment dentaire sûr et efficace</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="font-poppins font-normal text-[#4a5568]">Facettes en céramique ultra-fines</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="font-poppins font-normal text-[#4a5568]">Design du sourire personnalisé (Digital Smile Design)</span>
                </li>
              </ul>
              <button className="group inline-flex items-center gap-2 font-poppins font-medium text-accent hover:text-primary transition-colors">
                En savoir plus <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Product 3 */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-inter font-bold text-xl">03</div>
                <h3 className="font-inter font-bold text-3xl text-black">Orthodontie Invisible</h3>
              </div>
              <p className="font-poppins font-light text-lg text-[#4a5568] leading-relaxed mb-8">
                Alignez vos dents en toute discrétion grâce à nos gouttières transparentes sur mesure. Un traitement confortable, amovible et pratiquement invisible pour un sourire parfaitement aligné.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="font-poppins font-normal text-[#4a5568]">Gouttières transparentes et confortables</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="font-poppins font-normal text-[#4a5568]">Suivi numérique de la progression</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="font-poppins font-normal text-[#4a5568]">Résultats prévisibles et rapides</span>
                </li>
              </ul>
              <button className="group inline-flex items-center gap-2 font-poppins font-medium text-primary hover:text-accent transition-colors">
                En savoir plus <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[32px] transform translate-x-4 translate-y-4 -z-10"></div>
              <div className="rounded-[32px] overflow-hidden border border-[#e2e8f0] shadow-[0_20px_40px_rgba(0,0,0,0.05)]">
                <img src="https://images.unsplash.com/photo-1598256989800-efa4fd51071d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Orthodontie Invisible" className="w-full h-auto object-cover aspect-[4/3]" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
