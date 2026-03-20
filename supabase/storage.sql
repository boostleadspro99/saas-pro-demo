-- Script de sécurisation avancée des buckets de stockage Supabase
-- À exécuter dans l'éditeur SQL de votre tableau de bord Supabase

-- 1. Mise à jour/Création des buckets avec configuration stricte
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('public-assets', 'public-assets', true, 5242880, '{"image/*", "application/pdf"}'), -- 5MB limit
  ('patients-documents', 'patients-documents', false, 10485760, '{"application/pdf", "image/*"}'), -- 10MB limit
  ('avatars', 'avatars', false, 2097152, '{"image/*"}'), -- 2MB limit
  ('uploads', 'uploads', false, 10485760, NULL)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Suppression des anciennes politiques pour repartir sur une base saine
DROP POLICY IF EXISTS "Public Assets Access" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Avatar Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Patient Documents Access" ON storage.objects;
DROP POLICY IF EXISTS "Uploads Access" ON storage.objects;

-- 3. Nouvelles politiques de sécurité (RLS)

-- Bucket: public-assets
-- Lecture : Tout le monde (Public)
-- Écriture : Uniquement les administrateurs (simulé ici par le rôle 'authenticated')
CREATE POLICY "Public Assets - Lecture Publique" ON storage.objects
  FOR SELECT USING (bucket_id = 'public-assets');

CREATE POLICY "Public Assets - Gestion Admin" ON storage.objects
  FOR ALL TO authenticated USING (bucket_id = 'public-assets');

-- Bucket: avatars
-- Lecture : Uniquement les utilisateurs connectés
-- Écriture : Uniquement l'utilisateur pour son propre dossier /avatars/{uid}/*
CREATE POLICY "Avatars - Lecture Connectée" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'avatars');

CREATE POLICY "Avatars - Gestion Personnelle" ON storage.objects
  FOR ALL TO authenticated 
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Bucket: patients-documents
-- Accès : Strictement réservé aux utilisateurs authentifiés (Personnel médical/admin)
CREATE POLICY "Patients Documents - Accès Restreint" ON storage.objects
  FOR ALL TO authenticated 
  USING (bucket_id = 'patients-documents')
  WITH CHECK (bucket_id = 'patients-documents');

-- Bucket: uploads
-- Accès : Uniquement les utilisateurs authentifiés
CREATE POLICY "Uploads - Accès Limité" ON storage.objects
  FOR ALL TO authenticated 
  USING (bucket_id = 'uploads')
  WITH CHECK (bucket_id = 'uploads');

-- 4. Sécurité par défaut : Bloquer tout ce qui n'est pas explicitement autorisé
-- (Supabase Storage applique déjà un 'deny all' par défaut si aucune politique ne correspond)
