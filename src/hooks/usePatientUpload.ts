import { useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook pour uploader des fichiers patients de manière sécurisée
 */
export const usePatientUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPatientFile = async (patientId: string, file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      // 1. Structuration du path : dossier par patient + timestamp pour l'unicité
      // Format: {patient_id}/{timestamp}_{nom_du_fichier}
      const timestamp = Date.now();
      const cleanFileName = file.name.replace(/[^\x00-\x7F]/g, "").replace(/\s+/g, "_");
      const filePath = `${patientId}/${timestamp}_${cleanFileName}`;

      // 2. Upload vers le bucket PRIVE 'patients-documents'
      const { data, error: uploadError } = await supabase.storage
        .from('patients-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      return {
        path: data.path,
        fileName: file.name
      };
    } catch (err: any) {
      const msg = err.message || "Erreur lors du téléversement du fichier.";
      setError(msg);
      console.error("Upload Error:", msg);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadPatientFile, isUploading, error };
};
