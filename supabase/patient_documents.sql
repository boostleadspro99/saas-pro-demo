-- Script pour relier les fichiers aux patients dans la base de données
-- À exécuter dans l'éditeur SQL de votre tableau de bord Supabase

-- 1. Création de la table des documents patients
CREATE TABLE IF NOT EXISTS patient_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL, -- Chemin relatif dans le bucket Supabase Storage (ex: patients/ID/file.pdf)
    file_name TEXT NOT NULL, -- Nom d'affichage du fichier
    file_type TEXT,          -- Type de fichier (ex: 'pdf', 'image', 'radio')
    category TEXT,           -- Catégorie (ex: 'Radiographie', 'Ordonnance', 'Contrat')
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ajout du trigger pour la mise à jour automatique de updated_at
CREATE TRIGGER update_patient_documents_updated_at 
BEFORE UPDATE ON patient_documents 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Index pour optimiser les recherches par patient
CREATE INDEX IF NOT EXISTS idx_patient_documents_patient_id ON patient_documents(patient_id);

-- 4. Politiques de sécurité (RLS)
ALTER TABLE patient_documents ENABLE ROW LEVEL SECURITY;

-- Accès complet pour les utilisateurs authentifiés (Personnel médical)
CREATE POLICY "Personnel médical - Accès complet aux documents" 
ON patient_documents 
FOR ALL TO authenticated 
USING (true) 
WITH CHECK (true);

-- Commentaire de sécurité : Ne jamais stocker l'URL publique complète (qui expire ou change)
-- Toujours stocker uniquement le 'file_path' et générer l'URL dynamiquement côté client.
