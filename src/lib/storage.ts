import { supabase } from './supabase';

/**
 * Types de buckets disponibles
 */
export type BucketName = 'public-assets' | 'patients-documents' | 'avatars' | 'uploads';

/**
 * Upload d'un fichier vers un bucket spécifique
 */
export const uploadFile = async (
  bucket: BucketName,
  path: string,
  file: File | Blob
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error(`Erreur d'upload vers ${bucket}:`, error.message);
    throw error;
  }

  return data;
};

/**
 * Récupère l'URL publique d'un fichier (uniquement pour les buckets publics)
 */
export const getPublicUrl = (bucket: BucketName, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Récupère une URL signée pour un fichier privé
 */
export const getSignedUrl = async (
  bucket: BucketName,
  path: string,
  expiresIn: number = 3600
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error(`Erreur lors de la création de l'URL signée pour ${bucket}:`, error.message);
    throw error;
  }

  return data.signedUrl;
};

/**
 * Supprime un fichier d'un bucket
 */
export const deleteFile = async (bucket: BucketName, path: string) => {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error(`Erreur lors de la suppression du fichier dans ${bucket}:`, error.message);
    throw error;
  }

  return data;
};

/**
 * Liste les fichiers d'un dossier dans un bucket
 */
export const listFiles = async (bucket: BucketName, path: string = '') => {
  const { data, error } = await supabase.storage.from(bucket).list(path, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    console.error(`Erreur lors du listage des fichiers dans ${bucket}:`, error.message);
    throw error;
  }

  return data;
};
