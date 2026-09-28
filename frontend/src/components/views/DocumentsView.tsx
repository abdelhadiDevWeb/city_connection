import React from 'react';
import { FolderOpen, FileText, Download, Plus } from 'lucide-react';

interface DocumentsViewProps {
  documents: any[];
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ documents }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-zinc-800" />
            <span>Documents & Contrats de la Résidence</span>
          </h1>
          <p className="text-xs text-stone-500">
            Stockage centralisé : règlements de copropriété, PV d’assemblées générales, contrats d’ascenseurs
          </p>
        </div>

        <button className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Déposer un Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl pro-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2.5 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
                  {doc.category}
                </span>
                <span className="text-xs font-mono text-stone-400">{doc.size}</span>
              </div>

              <div className="flex items-start gap-3 mt-3.5">
                <div className="h-10 w-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 text-zinc-900">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-950 leading-snug">{doc.title}</h3>
                  <p className="text-[11px] text-stone-400 mt-1">Ajouté le {doc.date}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-200 flex justify-end">
              <button className="pro-button-secondary px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
