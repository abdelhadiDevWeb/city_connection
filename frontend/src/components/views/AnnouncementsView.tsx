import React, { useState } from 'react';
import { Megaphone, Plus, Bell, Droplets, Wrench, Calendar, AlertTriangle } from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: any[];
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ announcements }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-blue-400" />
            <span>Annonces & Communication Résidents</span>
          </h1>
          <p className="text-xs text-slate-400">
            Diffusion des avis de coupure d'eau, travaux d'ascenseurs, assemblées et rappels de charges
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Publier une Annonce</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    ann.priority === 'URGENT'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}
                >
                  {ann.priority === 'URGENT' ? 'URGENT' : 'Information'}
                </span>
                <span className="text-xs text-slate-400">Cible : {ann.target}</span>
              </div>
              <span className="text-xs text-slate-500">{ann.date}</span>
            </div>

            <h3 className="text-base font-bold text-white mt-2">{ann.title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
              {ann.content}
            </p>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
              <span>Diffusé sur l'Application Mobile Résident & Panneaux d'affichage</span>
              <button className="text-blue-400 hover:text-blue-300 font-bold">Modifier / Retirer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
