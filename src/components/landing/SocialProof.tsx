import React from 'react';

export const SocialProof = () => {
  return (
    <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col items-center gap-12">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">
            Reconnu par les leaders de la santé au Maroc
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['CNOPS', 'CNSS', 'CIMR', 'Wafa Assurance', 'RMA'].map((logo) => (
              <span key={logo} className="text-2xl font-black text-slate-900 tracking-tighter">
                {logo}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-12 w-full max-w-4xl mt-12">
            {[
              { label: 'Patients satisfaits', value: '5000+' },
              { label: "Années d'expérience", value: '15+' },
              { label: 'Taux de réussite', value: '99%' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-slate-900 mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
