import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialisation du client Supabase
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-anon-key'
);

/**
 * Récupère l'utilisateur actuellement connecté
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return user;
};

/**
 * Connecte un utilisateur avec email et mot de passe
 */
export const signIn = async (email: string, password: string) => {
  if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
    throw new Error("Configuration Supabase manquante. Veuillez vérifier vos variables d'environnement (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY).");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Crée un nouveau compte utilisateur
 */
export const signUp = async (email: string, password: string) => {
  if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
    throw new Error("Configuration Supabase manquante.");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    throw error;
  }
  
  return data;
};

/**
 * Déconnecte l'utilisateur actuel
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};
