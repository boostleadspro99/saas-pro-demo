import { supabase } from './supabase';
import { Appointment, AppointmentStatus } from '../types';

// Helper to format appointment data from DB (handles both old and new schema)
const formatAppointment = (apt: any): Appointment => {
  let date = apt.date;
  let time = apt.time;
  
  // If time is missing but date is a full timestamp (old schema)
  if (!time && date && date.includes('T')) {
    try {
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        date = d.toISOString().split('T')[0];
        time = d.toISOString().split('T')[1].substring(0, 5);
      }
    } catch (e) {
      // Ignore
    }
  }
  
  return {
    ...apt,
    date: date || new Date().toISOString().split('T')[0],
    time: time || '00:00',
    name: apt.name || 'Patient Inconnu',
    phone: apt.phone || '',
  } as Appointment;
};

export const getAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true });
    
  if (error) {
    console.error('Supabase error fetching appointments:', error);
    throw new Error(`Erreur lors de la récupération des rendez-vous: ${error.message}`);
  }
  
  return (data || []).map(formatAppointment);
};

export const createAppointment = async (
  appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select()
    .single();
    
  if (error) {
    console.error('Supabase error creating appointment:', error);
    throw new Error(`Erreur lors de la création du rendez-vous: ${error.message}`);
  }
  return formatAppointment(data);
};

export const updateAppointment = async (
  id: string, 
  updates: Partial<Omit<Appointment, 'id' | 'created_at'>>
): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Supabase error updating appointment ${id}:`, error);
    throw new Error(`Erreur lors de la mise à jour du rendez-vous: ${error.message}`);
  }
  return formatAppointment(data);
};

export const getPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('date', { ascending: false });
    
  if (error) {
    console.error(`Supabase error fetching appointments for patient ${patientId}:`, error);
    throw new Error(`Erreur lors de la récupération des rendez-vous: ${error.message}`);
  }
  return (data || []).map(formatAppointment);
};

export const updateAppointmentStatus = async (id: string, status: AppointmentStatus): Promise<void> => {
  await updateAppointment(id, { status });
};
