import React, { useState } from 'react';
import { usePatientUpload } from '../../hooks/usePatientUpload';
import { addPatientDocument } from '../../lib/patients';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PatientFileUploadProps {
  patientId: string;
  onUploadSuccess?: (path: string) => void;
}

export const PatientFileUpload: React.FC<PatientFileUploadProps> = ({ 
  patientId, 
  onUploadSuccess 
}) => {
  const { uploadPatientFile, isUploading, error: uploadError } = usePatientUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadSuccess(false);
      setDbError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !patientId) return;

    const result = await uploadPatientFile(patientId, selectedFile);
    
    if (result) {
      try {
        // Enregistrement de la référence dans la base de données
        await addPatientDocument(
          patientId,
          result.path,
          selectedFile.name,
          selectedFile.type
        );
        
        setUploadSuccess(true);
        setSelectedFile(null);
        if (onUploadSuccess) {
          onUploadSuccess(result.path);
        }
      } catch (err: any) {
        setDbError("Fichier uploadé mais erreur lors de l'enregistrement en base de données.");
        console.error("DB Error:", err);
      }
    }
  };

  const error = uploadError || dbError;

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Ajouter un document patient
      </h3>

      <div className="space-y-4">
        {/* Zone de sélection de fichier */}
        <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-primary transition-colors group">
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-10 h-10 text-slate-400 group-hover:text-primary transition-colors" />
            <p className="text-slate-600 font-medium">
              {selectedFile ? selectedFile.name : "Cliquez ou glissez un fichier ici"}
            </p>
            <p className="text-xs text-slate-400">PDF, JPG, PNG (max. 5MB)</p>
          </div>
        </div>

        {/* Bouton d'upload */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Téléversement en cours...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Uploader le document
            </>
          )}
        </button>

        {/* Messages d'état */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {uploadSuccess && (
          <div className="flex items-center gap-2 p-3 bg-secondary/10 text-secondary rounded-lg text-sm">
            <CheckCircle className="w-4 h-4" />
            Fichier téléversé avec succès !
          </div>
        )}
      </div>
    </div>
  );
};
