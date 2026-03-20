import { supabase } from './supabase';
import { Patient, PatientNote, PatientDocument } from '../types';

// Helper to format patient data from DB (handles both old and new schema)
const formatPatient = (patient: any): Patient => {
  return {
    ...patient,
    name: patient.name || patient.full_name || 'Patient Inconnu',
  } as Patient;
};

export const getPatientDocuments = async (patientId: string): Promise<PatientDocument[]> => {
  const { data, error } = await supabase
    .from('patient_documents')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Supabase error fetching documents for patient ${patientId}:`, error);
    throw new Error(`Erreur lors de la récupération des documents: ${error.message}`);
  }
  return data as PatientDocument[];
};

export const addPatientDocument = async (
  patientId: string,
  filePath: string,
  fileName: string,
  fileType?: string,
  category?: string
): Promise<PatientDocument> => {
  const newDoc = {
    patient_id: patientId,
    file_path: filePath,
    file_name: fileName,
    file_type: fileType,
    category: category,
  };

  const { data, error } = await supabase
    .from('patient_documents')
    .insert([newDoc])
    .select()
    .single();
    
  if (error) {
    console.error('Supabase error adding patient document:', error);
    throw new Error(`Erreur lors de l'ajout du document: ${error.message}`);
  }
  return data as PatientDocument;
};

export const deletePatientDocument = async (documentId: string): Promise<void> => {
  const { error } = await supabase
    .from('patient_documents')
    .delete()
    .eq('id', documentId);
    
  if (error) {
    console.error(`Supabase error deleting document ${documentId}:`, error);
    throw new Error(`Erreur lors de la suppression du document: ${error.message}`);
  }
};

export const getPatientNotes = async (patientId: string): Promise<PatientNote[]> => {
  const { data, error } = await supabase
    .from('patient_notes')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Supabase error fetching notes for patient ${patientId}:`, error);
    throw new Error(`Erreur lors de la récupération des notes: ${error.message}`);
  }
  return data as PatientNote[];
};

export const addPatientNote = async (
  patientId: string, 
  content: string
): Promise<PatientNote> => {
  const newNote = {
    patient_id: patientId,
    content,
  };

  const { data, error } = await supabase
    .from('patient_notes')
    .insert([newNote])
    .select()
    .single();
    
  if (error) {
    console.error('Supabase error adding patient note:', error);
    throw new Error(`Erreur lors de l'ajout de la note: ${error.message}`);
  }
  return data as PatientNote;
};

export const getPatients = async (): Promise<Patient[]> => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Supabase error fetching patients:', error);
    throw new Error(`Erreur lors de la récupération des patients: ${error.message}`);
  }
  return (data || []).map(formatPatient);
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Supabase error fetching patient ${id}:`, error);
    throw new Error(`Erreur lors de la récupération du patient: ${error.message}`);
  }
  return data ? formatPatient(data) : null;
};

export const updatePatient = async (
  id: string, 
  updates: Partial<Omit<Patient, 'id' | 'created_at'>>
): Promise<Patient> => {
  const { data, error } = await supabase
    .from('patients')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Supabase error updating patient ${id}:`, error);
    throw new Error(`Erreur lors de la mise à jour du patient: ${error.message}`);
  }
  return formatPatient(data);
};

export const getPatientByPhone = async (phone: string): Promise<Patient | null> => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();
    
  if (error) {
    console.error(`Supabase error fetching patient by phone ${phone}:`, error);
    throw new Error(`Erreur lors de la recherche du patient: ${error.message}`);
  }
  return data ? formatPatient(data) : null;
};

export const createPatient = async (
  patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>
): Promise<Patient> => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patientData])
    .select()
    .single();
    
  if (error) {
    console.error('Supabase error creating patient:', error);
    throw new Error(`Erreur lors de la création du patient: ${error.message}`);
  }
  return formatPatient(data);
};
