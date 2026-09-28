import React from 'react';
import { FolderOpen, FileText, Download, Plus, Search, Shield } from 'lucide-react';

interface DocumentsViewProps {
  documents: any[];
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ documents }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-indigo-400" />
            <span>Documents & Contrats de la Résidence</span>
          </h1>
          <p className="text-xs text-slate-400">
            Stockage centralisé : règlements de copropriété, PV d’assemblées générales, contrats d’ascenseurs
          </p>
        </div>

        <button className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20">
          <Plus className="h-4 w-4" />
          <span>Déposer un Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {doc.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{doc.size}</span>
              </div>

              <div className="flex items-start gap-3 mt-3">
                <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-red-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white leading-snug">{doc.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">Ajouté le {doc.date}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5">
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
