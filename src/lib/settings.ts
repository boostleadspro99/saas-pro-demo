import { supabase } from './supabase';

export type Settings = {
  id: string;
  cabinet_name: string;
  phone: string;
  email: string;
  address: string;
  whatsapp_link: string;
  google_review_link: string;
  updated_at: string;
};

// Mock settings in case table doesn't exist
let mockSettings: Settings = {
  id: '1',
  cabinet_name: 'DentalCare',
  phone: '01 23 45 67 89',
  email: 'contact@dentalcare.com',
  address: '123 Rue de la Dent, 75000 Paris',
  whatsapp_link: 'https://wa.me/33123456789',
  google_review_link: 'https://g.page/r/example/review',
  updated_at: new Date().toISOString(),
};

export const getSettings = async (): Promise<Settings> => {
  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .select('*')
      .single();
      
    if (error) throw error;
    return data as Settings;
  } catch (err) {
    return mockSettings;
  }
};

export const updateSettings = async (updates: Partial<Settings>): Promise<Settings> => {
  try {
    const { data, error } = await supabase
      .from('clinic_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', '1')
      .select()
      .single();
      
    if (error) throw error;
    return data as Settings;
  } catch (err) {
    mockSettings = { ...mockSettings, ...updates, updated_at: new Date().toISOString() };
    return mockSettings;
  }
};
