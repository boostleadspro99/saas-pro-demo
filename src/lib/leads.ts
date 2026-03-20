import { supabase } from './supabase';
import { logActivity } from './activity';
import { Lead, LeadActivity, LeadStatus } from '../types';

// Helper to format lead data from DB (handles both old and new schema)
const formatLead = (lead: any): Lead => {
  return {
    ...lead,
    name: lead.name || lead.full_name || 'Lead Inconnu',
    reason: lead.reason || 'Non spécifié',
    status: lead.status || 'nouveau',
    source: lead.source || 'Autre',
  } as Lead;
};

export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Supabase error fetching leads:', error);
    throw new Error(`Erreur lors de la récupération des leads: ${error.message}`);
  }
  return (data || []).map(formatLead);
};

export const getLeadById = async (id: string): Promise<Lead | null> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Supabase error fetching lead ${id}:`, error);
    throw new Error(`Erreur lors de la récupération du lead: ${error.message}`);
  }
  return data ? formatLead(data) : null;
};

export const updateLeadStatus = async (id: string, status: LeadStatus): Promise<void> => {
  const { error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
    
  if (error) {
    console.error(`Supabase error updating lead ${id}:`, error);
    throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
  }
};

export const getLeadActivities = async (leadId: string): Promise<LeadActivity[]> => {
  const { data, error } = await supabase
    .from('lead_activities')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error(`Supabase error fetching activities for lead ${leadId}:`, error);
    throw new Error(`Erreur lors de la récupération des activités: ${error.message}`);
  }
  return data as LeadActivity[];
};

export const createLead = async (
  leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>
): Promise<Lead> => {
  const { data, error } = await supabase
    .from('leads')
    .insert([leadData])
    .select()
    .single();
    
  if (error) {
    console.error('Supabase error creating lead:', error);
    throw new Error(`Erreur lors de la création du lead: ${error.message}`);
  }
  return formatLead(data);
};

export const addLeadActivity = async (
  leadId: string, 
  type: LeadActivity['type'], 
  content: string
): Promise<LeadActivity> => {
  const newActivity = {
    lead_id: leadId,
    type,
    content,
  };

  const { data, error } = await supabase
    .from('lead_activities')
    .insert([newActivity])
    .select()
    .single();
    
  if (error) {
    console.error('Supabase error adding lead activity:', error);
    throw new Error(`Erreur lors de l'ajout de l'activité: ${error.message}`);
  }
  
  // Log global activity
  try {
    await logActivity(content, { lead_id: leadId });
  } catch (e) {
    console.warn('Failed to log global activity:', e);
  }
  
  return data as LeadActivity;
};
