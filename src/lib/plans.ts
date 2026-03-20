import { supabase } from './supabase';
import { TreatmentPlan, PlanStatus } from '../types';

export const getAllPlans = async (): Promise<TreatmentPlan[]> => {
  const { data, error } = await supabase
    .from('treatment_plans')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Supabase error fetching plans:', error);
    throw new Error(`Erreur lors de la récupération des plans: ${error.message}`);
  }
  return data as TreatmentPlan[];
};

export const getPatientPlans = async (patientId: string): Promise<TreatmentPlan[]> => {
  const { data, error } = await supabase
    .from('treatment_plans')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Supabase error fetching plans for patient ${patientId}:`, error);
    throw new Error(`Erreur lors de la récupération des plans: ${error.message}`);
  }
  return data as TreatmentPlan[];
};

export const createPlan = async (
  planData: Omit<TreatmentPlan, 'id' | 'created_at' | 'updated_at'>
): Promise<TreatmentPlan> => {
  const { data, error } = await supabase
    .from('treatment_plans')
    .insert([planData])
    .select()
    .single();
    
  if (error) {
    console.error('Supabase error creating plan:', error);
    throw new Error(`Erreur lors de la création du plan: ${error.message}`);
  }
  return data as TreatmentPlan;
};

export const updatePlanStatus = async (id: string, status: PlanStatus): Promise<void> => {
  const { error } = await supabase
    .from('treatment_plans')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
    
  if (error) {
    console.error(`Supabase error updating plan ${id}:`, error);
    throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
  }
};

export const updatePlanNote = async (id: string, notes: string): Promise<void> => {
  const { error } = await supabase
    .from('treatment_plans')
    .update({ notes, updated_at: new Date().toISOString() })
    .eq('id', id);
    
  if (error) {
    console.error(`Supabase error updating plan note ${id}:`, error);
    throw new Error(`Erreur lors de la mise à jour de la note: ${error.message}`);
  }
};
