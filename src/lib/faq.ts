import { supabase } from './supabase';

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
};

// Mock FAQs for fallback
const mockFaqs: FAQ[] = [
  {
    id: '1',
    question: 'Quels sont vos tarifs ?',
    answer: 'Nos tarifs varient selon les soins. Une consultation de base est à partir de 50€. Un devis précis vous sera remis après examen clinique.',
    keywords: ['prix', 'tarif', 'coût', 'combien', 'paye', 'payer']
  },
  {
    id: '2',
    question: 'Quels services proposez-vous ?',
    answer: 'Nous proposons des soins dentaires généraux, de l\'orthodontie, des implants, du blanchiment dentaire et des soins esthétiques.',
    keywords: ['service', 'soin', 'propose', 'faites', 'orthodontie', 'implant', 'blanchiment', 'prestation']
  },
  {
    id: '3',
    question: 'Quels sont vos horaires d\'ouverture ?',
    answer: 'Le cabinet est ouvert du lundi au vendredi de 9h00 à 19h00, et le samedi de 9h00 à 13h00.',
    keywords: ['horaire', 'heure', 'ouvert', 'fermé', 'quand', 'jour']
  }
];

export const getFaqs = async (): Promise<FAQ[]> => {
  try {
    const { data, error } = await supabase
      .from('faq_items')
      .select('*');
      
    if (error) throw error;
    return data && data.length > 0 ? data as FAQ[] : mockFaqs;
  } catch (err) {
    return mockFaqs;
  }
};
