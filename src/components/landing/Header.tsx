import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full h-[80px] z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-white/[0.85] backdrop-blur-[24px] backdrop-saturate-[180%] border-primary/[0.12] shadow-[0_4px_24px_rgba(3,89,167,0.08)]' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-20 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-baseline">
          <span className={`font-inter font-extrabold text-3xl tracking-tighter transition-colors duration-300 ${isScrolled ? 'text-primary' : 'text-white'}`}>
            DentalCare
          </span>
          <span className="font-inter font-extrabold text-3xl text-accent">.</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8">
          {['Accueil', 'À propos', 'Services', 'Inspirations'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(' ', '-')}`} 
              className={`nav-link relative font-inter font-medium text-sm transition-colors duration-300 group ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className={`hidden md:flex items-center gap-2 font-inter font-medium text-sm transition-colors duration-300 ${isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white/90 hover:text-white'}`}
            title="Accès Administrateur"
          >
            <LogIn className="w-4 h-4" />
            Admin
          </Link>
          <Link 
            to="/book" 
            className="hidden md:inline-flex items-center justify-center bg-primary text-white px-6 py-2.5 rounded-[10px] font-inter font-medium text-sm shadow-[0_0_0_0_rgba(3,89,167,0.4)] hover:bg-primary-light hover:shadow-[0_0_0_6px_rgba(3,89,167,0.15)] hover:-translate-y-[1px] transition-all duration-200"
          >
            Prendre RDV
          </Link>
          <button 
            className={`md:hidden transition-colors ${isScrolled ? 'text-gray-800' : 'text-white hover:text-gray-300'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-6 md:hidden shadow-xl"
          >
            {['Accueil', 'À propos', 'Services', 'Inspirations'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`} 
                className="text-lg font-inter font-medium text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <Link 
              to="/book" 
              className="bg-primary text-white py-3.5 rounded-[10px] text-center font-inter font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Prendre RDV
            </Link>
            <Link 
              to="/login" 
              className="text-gray-500 py-2 text-center font-inter font-medium flex items-center justify-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn className="w-4 h-4" />
              Accès Admin
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
