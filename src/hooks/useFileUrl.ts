import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook pour récupérer l'URL d'un fichier (publique ou signée)
 * @param bucket Nom du bucket
 * @param path Chemin du fichier dans le bucket
 * @param expiresIn Durée de validité de l'URL signée en secondes (défaut 1h)
 */
export const useFileUrl = (
  bucket: string,
  path: string | null,
  expiresIn: number = 3600
) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setUrl(null);
      return;
    }

    const fetchUrl = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (bucket === 'public-assets') {
          // Pour les buckets publics, on récupère l'URL directement
          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          setUrl(data.publicUrl);
        } else {
          // Pour les buckets privés, on génère une URL signée
          const { data, error: signedError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

          if (signedError) throw signedError;
          setUrl(data.signedUrl);
        }
      } catch (err: any) {
        const msg = err.message || "Erreur lors de la récupération de l'URL du fichier.";
        setError(msg);
        console.error("File URL Error:", msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrl();
  }, [bucket, path, expiresIn]);

  return { url, isLoading, error };
};
