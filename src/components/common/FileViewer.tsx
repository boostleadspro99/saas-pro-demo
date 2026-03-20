import React from 'react';
import { useFileUrl } from '../../hooks/useFileUrl';
import { FileText, Image as ImageIcon, ExternalLink, Loader2, AlertCircle, Download } from 'lucide-react';

interface FileViewerProps {
  bucket: string;
  path: string | null;
  fileName?: string;
  type?: 'image' | 'pdf' | 'other';
  className?: string;
}

export const FileViewer: React.FC<FileViewerProps> = ({ 
  bucket, 
  path, 
  fileName = 'Fichier', 
  type = 'other',
  className = ''
}) => {
  const { url, isLoading, error } = useFileUrl(bucket, path);

  if (!path) return null;

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 p-4 bg-slate-50 rounded-xl ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-[#002B7F]" />
        <span className="text-slate-500 text-sm">Chargement du fichier...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl text-sm ${className}`}>
        <AlertCircle className="w-5 h-5" />
        <span>Erreur lors de l'affichage du fichier.</span>
      </div>
    );
  }

  if (!url) return null;

  // Affichage spécifique pour les images
  if (type === 'image' || path.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return (
      <div className={`relative group rounded-xl overflow-hidden border border-slate-100 shadow-sm ${className}`}>
        <img 
          src={url} 
          alt={fileName} 
          className="w-full h-auto object-cover max-h-[400px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 bg-white rounded-full text-slate-800 hover:bg-blue-50 transition-colors"
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <a 
            href={url} 
            download={fileName}
            className="p-2 bg-white rounded-full text-slate-800 hover:bg-blue-50 transition-colors"
            title="Télécharger"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>
      </div>
    );
  }

  // Affichage générique pour les autres fichiers (PDF, etc.)
  return (
    <div className={`flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-[#002B7F] transition-colors group ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 rounded-lg text-[#002B7F]">
          {type === 'pdf' || path.endsWith('.pdf') ? (
            <FileText className="w-6 h-6" />
          ) : (
            <ImageIcon className="w-6 h-6" />
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-sm truncate max-w-[200px]">
            {fileName}
          </span>
          <span className="text-xs text-slate-400 uppercase">
            {path.split('.').pop()}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-[#002B7F] hover:bg-blue-50 rounded-lg transition-all"
          title="Ouvrir"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
        <a 
          href={url} 
          download={fileName}
          className="p-2 text-slate-400 hover:text-[#002B7F] hover:bg-blue-50 rounded-lg transition-all"
          title="Télécharger"
        >
          <Download className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};
