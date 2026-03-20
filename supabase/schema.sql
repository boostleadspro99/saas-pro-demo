-- Enable UUID extension (Supabase includes this by default, but it's good practice)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- CLEANUP (Run this to reset the schema)
-- ==========================================
DROP TABLE IF EXISTS lead_activities CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS treatment_plans CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- 1. LEADS TABLE
-- ==========================================
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    status TEXT DEFAULT 'nouveau',
    source TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for development" ON leads FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 2. PATIENTS TABLE
-- ==========================================
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    review_status TEXT DEFAULT 'non_demandé',
    review_request_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for development" ON patients FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 3. APPOINTMENTS TABLE
-- ==========================================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    dentist_id UUID,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'en attente',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for development" ON appointments FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 4. TREATMENT PLANS TABLE
-- ==========================================
CREATE TABLE treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    description TEXT,
    estimated_amount NUMERIC(10, 2),
    status TEXT DEFAULT 'proposé',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for development" ON treatment_plans FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 5. PAYMENTS TABLE
-- ==========================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES treatment_plans(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'complété',
    method TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for development" ON payments FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 6. LEAD ACTIVITIES TABLE
-- ==========================================
CREATE TABLE lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    content TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for development" ON lead_activities FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- TRIGGERS FOR updated_at
-- ==========================================
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_treatment_plans_updated_at BEFORE UPDATE ON treatment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lead_activities_updated_at BEFORE UPDATE ON lead_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- PERFORMANCE INDEXES
-- ==========================================
-- Leads
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);

-- Patients
CREATE INDEX idx_patients_lead_id ON patients(lead_id);

-- Appointments
CREATE INDEX idx_appointments_lead_id ON appointments(lead_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Treatment Plans
CREATE INDEX idx_treatment_plans_patient_id ON treatment_plans(patient_id);

-- Payments
CREATE INDEX idx_payments_patient_id ON payments(patient_id);

-- Lead Activities
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
