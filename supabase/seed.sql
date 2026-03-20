-- ==========================================
-- SEED DATA FOR DENTAL CLINIC
-- ==========================================

-- Clean up existing data to avoid conflicts if run multiple times (Optional but recommended for seeding)
-- TRUNCATE TABLE payments, treatment_plans, appointments, patients, lead_activities, leads CASCADE;

-- 1. Insert 5 Leads (Using explicit UUIDs to maintain relationships)
INSERT INTO leads (id, name, phone, email, status, source) VALUES
('11111111-1111-1111-1111-111111111111', 'Jean Dupont', '0601020304', 'jean.dupont@email.com', 'converted', 'website'),
('22222222-2222-2222-2222-222222222222', 'Marie Curie', '0611223344', 'marie.curie@email.com', 'converted', 'referral'),
('33333333-3333-3333-3333-333333333333', 'Lucas Martin', '0699887766', 'lucas.m@email.com', 'qualified', 'google_ads'),
('44444444-4444-4444-4444-444444444444', 'Sophie Bernard', '0655443322', 'sophie.b@email.com', 'contacted', 'facebook'),
('55555555-5555-5555-5555-555555555555', 'Thomas Petit', '0677889900', 'thomas.p@email.com', 'new', 'website');

-- 2. Insert 2 Patients (Created from the 'converted' leads)
INSERT INTO patients (id, lead_id, full_name, phone) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Jean Dupont', '0601020304'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Marie Curie', '0611223344');

-- 3. Insert 3 Appointments (Linked to leads)
INSERT INTO appointments (id, lead_id, date, status) VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days', 'completed'), -- Past appointment
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', NOW() + INTERVAL '1 day', 'scheduled'),  -- Future appointment
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', NOW() + INTERVAL '3 days', 'scheduled');  -- Future appointment

-- 4. Insert 2 Treatment Plans (Linked to patients)
INSERT INTO treatment_plans (id, patient_id, description, total_cost, status) VALUES
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pose de couronne céramique sur molaire', 850.00, 'accepted'),
(gen_random_uuid(), 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Traitement d''orthodontie invisible (Invisalign)', 3500.00, 'proposed');

-- 5. Insert 2 Payments (Linked to patients)
INSERT INTO payments (id, patient_id, amount, status) VALUES
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 400.00, 'completed'), -- Acompte payé
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 450.00, 'pending');   -- Reste à payer
