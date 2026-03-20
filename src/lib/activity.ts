import { supabase } from './supabase';

export type Activity = {
  id: string;
  lead_id?: string;
  patient_id?: string;
  action: string;
  created_at: string;
  created_by?: string;
};

export const logActivity = async (
  action: string,
  target: { lead_id?: string; patient_id?: string }
) => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.email || 'Système';

    const { error } = await supabase
      .from('lead_activities')
      .insert([
        {
          ...target,
          action,
          created_by: userId,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) throw error;
  } catch (err) {
    console.error('Erreur lors de la journalisation de l\'activité:', err);
  }
};
