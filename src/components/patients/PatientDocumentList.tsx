import React, { useEffect, useState } from 'react';
import { getPatientDocuments, deletePatientDocument } from '../../lib/patients';
import { PatientDocument } from '../../types';
import { FileViewer } from '../common/FileViewer';
import { FileText, Trash2, Loader2, AlertCircle, FilePlus } from 'lucide-react';

interface PatientDocumentListProps {
  patientId: string;
  refreshTrigger?: number;
}

export const PatientDocumentList: React.FC<PatientDocumentListProps> = ({ 
  patientId,
  refreshTrigger = 0
}) => {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await getPatientDocuments(patientId);
      setDocuments(docs);
    } catch (err) {
      setError("Impossible de charger les documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [patientId, refreshTrigger]);

  const handleDelete = async (docId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) return;

    try {
      await deletePatientDocument(docId);
      setDocuments(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#002B7F]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <FilePlus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Aucun document pour ce patient.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <FileText className="w-5 h-5 text-[#002B7F]" />
        Documents du patient ({documents.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="relative group">
            <FileViewer 
              bucket="patients-documents" 
              path={doc.file_path} 
              fileName={doc.file_name}
            />
            <button
              onClick={() => handleDelete(doc.id)}
              className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
