import React, { useState } from 'react';
import { Megaphone, Plus } from 'lucide-react';

interface AnnouncementsViewProps {
  announcements: any[];
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ announcements }) => {
  const [, setShowModal] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-zinc-800" />
            <span>Annonces & Communication Résidents</span>
          </h1>
          <p className="text-xs text-stone-500">
            Diffusion des avis de coupure d'eau, travaux d'ascenseurs, assemblées et rappels de charges
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Publier une Annonce</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-5 rounded-2xl pro-card"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
                  {ann.priority === 'URGENT' ? 'Urgent' : 'Information'}
                </span>
                <span className="text-xs text-stone-500">Cible : {ann.target}</span>
              </div>
              <span className="text-xs text-stone-400">{ann.date}</span>
            </div>

            <h3 className="text-base font-bold text-zinc-950 mt-2">{ann.title}</h3>
            <p className="text-xs text-stone-700 mt-2.5 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200">
              {ann.content}
            </p>

            <div className="mt-4 flex items-center justify-between text-[11px] text-stone-400">
              <span>Diffusé sur l'Application Mobile Résident & Panneaux d'affichage</span>
              <button className="text-zinc-800 hover:text-black font-semibold underline underline-offset-4">
                Modifier / Retirer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
