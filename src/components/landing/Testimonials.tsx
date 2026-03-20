import React from 'react';

const testimonials = [
  {
    name: 'Amine El Amrani',
    role: 'Patient depuis 2 ans',
    text: 'Une expérience incroyable. Le cabinet est ultra moderne et le Dr. Mansouri est d’une douceur remarquable. Je recommande vivement pour l’implantologie.',
    rating: 5,
    img: 'https://i.pravatar.cc/100?img=12',
  },
  {
    name: 'Sonia Benjelloun',
    role: 'Orthodontie Adulte',
    text: 'J’ai enfin sauté le pas pour mon alignement dentaire. Le suivi est impeccable et les résultats sont déjà visibles après seulement 3 mois.',
    rating: 5,
    img: 'https://i.pravatar.cc/100?img=25',
  },
  {
    name: 'Mehdi Tazi',
    role: 'Soins Esthétiques',
    text: 'Le blanchiment dentaire a changé ma confiance en moi. Le personnel est accueillant et le cadre est digne d’un hôtel 5 étoiles.',
    rating: 5,
    img: 'https://i.pravatar.cc/100?img=33',
  },
];

export const Testimonials = () => {
  return (
    <section id="temoignages" className="py-24 lg:py-32 bg-[#f5f8fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block bg-primary/10 text-primary font-poppins font-semibold text-xs uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full mb-5">
            Témoignages
          </div>
          <h2 className="font-inter font-bold text-4xl lg:text-5xl tracking-tight text-black mb-6">
            Ce que disent nos patients
          </h2>
          <p className="font-poppins font-light text-lg text-[#6b7280]">
            Découvrez les expériences de ceux qui nous ont fait confiance pour transformer leur sourire.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-[24px] p-8 border border-[#e2e8f0] shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(3,89,167,0.08)] transition-all duration-300 flex flex-col">
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
              </div>
              <p className="font-poppins font-light text-[#4a5568] leading-relaxed mb-8 flex-grow">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-[#f1f5f9]">
                <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/10" referrerPolicy="no-referrer" />
                <div>
                  <div className="font-inter font-semibold text-black">{testimonial.name}</div>
                  <div className="font-poppins font-normal text-sm text-[#6b7280]">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
