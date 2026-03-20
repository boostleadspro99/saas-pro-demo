import React from 'react';
import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { TrustedClients } from '../components/landing/TrustedClients';
import { About } from '../components/landing/About';
import { Services } from '../components/landing/Services';
import { WhyUs } from '../components/landing/WhyUs';
import { Testimonials } from '../components/landing/Testimonials';
import { FAQ } from '../components/landing/FAQ';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-secondary/20 selection:text-secondary-dark">
      <Header />
      <main>
        <Hero />
        <TrustedClients />
        <About />
        <Services />
        <WhyUs />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
