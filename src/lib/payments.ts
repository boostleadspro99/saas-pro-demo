import { supabase } from './supabase';
import { Payment, PaymentStatus } from '../types';

// Helper to format payment data from DB (handles both old and new schema)
const formatPayment = (payment: any): Payment => {
  return {
    ...payment,
    date: payment.date || (payment.created_at ? payment.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
    method: payment.method || 'Carte Bancaire',
    description: payment.description || 'Paiement',
  } as Payment;
};

export const getPayments = async (): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Supabase error fetching payments:', error);
    throw new Error(`Erreur lors de la récupération des paiements: ${error.message}`);
  }
  return (data || []).map(formatPayment);
};

export const getPatientPayments = async (patientId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Supabase error fetching payments for patient ${patientId}:`, error);
    throw new Error(`Erreur lors de la récupération des paiements: ${error.message}`);
  }
  return (data || []).map(formatPayment);
};

export const createPayment = async (
  paymentData: Omit<Payment, 'id' | 'created_at'>
): Promise<Payment> => {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select()
    .single();
    
  if (error) {
    console.error('Supabase error creating payment:', error);
    throw new Error(`Erreur lors de la création du paiement: ${error.message}`);
  }
  return formatPayment(data);
};

export const updatePaymentStatus = async (id: string, status: PaymentStatus): Promise<void> => {
  const { error } = await supabase
    .from('payments')
    .update({ status })
    .eq('id', id);
    
  if (error) {
    console.error(`Supabase error updating payment ${id}:`, error);
    throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
  }
};
