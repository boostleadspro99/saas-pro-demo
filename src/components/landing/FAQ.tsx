import React from 'react';

const faqs = [
  {
    question: 'Comment prendre rendez-vous ?',
    answer: 'Vous pouvez prendre rendez-vous directement en ligne via notre bouton "Prendre RDV" ou en nous appelant au +212 5 22 00 00 00.',
  },
  {
    question: 'Acceptez-vous les assurances ?',
    answer: 'Oui, nous acceptons la plupart des assurances au Maroc (CNOPS, CNSS, CIMR, Wafa Assurance, RMA, etc.).',
  },
  {
    question: 'Quels sont vos tarifs ?',
    answer: 'Nos tarifs sont transparents et conformes aux standards de qualité premium. Un devis détaillé vous sera remis après votre première consultation.',
  },
  {
    question: 'Proposez-vous des facilités de paiement ?',
    answer: 'Oui, nous proposons des solutions de paiement échelonné pour les traitements longs comme l’orthodontie ou l’implantologie.',
  },
  {
    question: 'Où se situe le cabinet ?',
    answer: 'Le cabinet est situé au cœur de Casablanca, dans le quartier Gauthier, avec un parking facile d’accès.',
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-24 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="font-inter font-bold text-4xl lg:text-5xl tracking-tight text-black mb-6">
            Questions Fréquentes
          </h2>
          <p className="font-poppins font-light text-lg text-[#6b7280]">
            Tout ce que vous devez savoir avant votre première visite.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-[#f5f8fc] rounded-[16px] border border-[#e2e8f0] overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer p-6 font-inter font-semibold text-lg text-black">
                {faq.question}
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-6 pt-0 font-poppins font-light text-[#4a5568] leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
