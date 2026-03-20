export type User = {
  id: string;
  email: string;
  role: 'admin' | 'dentist' | 'receptionist' | 'patient';
  created_at: string;
};

export type AppointmentStatus = 'en attente' | 'confirmé' | 'visité' | 'annulé';

export type Appointment = {
  id: string;
  patient_id?: string;
  lead_id?: string;
  dentist_id?: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
};

export type Patient = {
  id: string;
  lead_id?: string;
  name: string;
  phone: string;
  email?: string;
  review_status?: 'non_demandé' | 'envoyé' | 'reçu';
  review_request_date?: string;
  created_at: string;
  updated_at?: string;
};

export type PaymentStatus = 'payé' | 'en attente' | 'annulé';

export type Payment = {
  id: string;
  patient_id: string;
  plan_id?: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  method: 'carte' | 'espèces' | 'virement';
  description?: string;
  created_at: string;
};

export type PatientNote = {
  id: string;
  patient_id: string;
  content: string;
  created_at: string;
  created_by?: string;
};

export type PlanStatus = 'proposé' | 'accepté' | 'refusé';

export type TreatmentPlan = {
  id: string;
  patient_id: string;
  description: string;
  estimated_amount: number;
  status: PlanStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
};

export type LeadStatus = 'nouveau' | 'contacté' | 'rdv pris' | 'visité' | 'plan proposé' | 'accepté' | 'refusé';

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  status: LeadStatus;
  reason?: string;
  created_at: string;
  updated_at?: string;
};

export type LeadActivity = {
  id: string;
  lead_id: string;
  type: 'note' | 'call' | 'whatsapp' | 'appointment' | 'email';
  content: string;
  created_at: string;
  created_by?: string;
};

export type MessageTemplate = {
  id: string;
  name: string;
  type: 'whatsapp' | 'email';
  subject?: string;
  content: string;
};

export type PatientDocument = {
  id: string;
  patient_id: string;
  file_path: string;
  file_name: string;
  file_type?: string;
  category?: string;
  created_at: string;
  updated_at?: string;
};
