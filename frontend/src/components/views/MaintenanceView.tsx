import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  Cpu,
  Plus,
} from 'lucide-react';

interface MaintenanceViewProps {
  incidents: any[];
  equipment: any[];
  onOpenIncidentModal: () => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  incidents,
  equipment,
  onOpenIncidentModal,
}) => {
  const [subTab, setSubTab] = useState<'incidents' | 'equipment'>('incidents');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-zinc-800" />
            <span>Maintenance, Pannes & Équipements</span>
          </h1>
          <p className="text-xs text-stone-500">
            Gestion des pannes signalées, tickets d'intervention et suivi technique des ascenseurs & surpresseurs
          </p>
        </div>

        <button
          onClick={onOpenIncidentModal}
          className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Signaler un Incident</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setSubTab('incidents')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition ${
            subTab === 'incidents'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Pannes & Incidents Signalés ({incidents.length})</span>
        </button>

        <button
          onClick={() => setSubTab('equipment')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition ${
            subTab === 'equipment'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Parc Équipements ({equipment.length})</span>
        </button>
      </div>

      {/* 1. INCIDENTS LIST */}
      {subTab === 'incidents' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="p-5 rounded-2xl pro-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
                    {inc.priority === 'CRITICAL'
                      ? 'Critique'
                      : inc.priority === 'HIGH'
                      ? 'Haute Priorité'
                      : 'Normale'}
                  </span>
                  <span className="text-[11px] text-stone-400">{inc.date}</span>
                </div>

                <h3 className="text-sm font-bold text-zinc-950 mt-2 leading-snug">{inc.title}</h3>

                <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Localisation :</span>
                    <span className="font-semibold text-zinc-900">
                      {inc.building} — {inc.apartment}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Signalé par :</span>
                    <span className="font-medium text-zinc-900">{inc.reporter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Catégorie :</span>
                    <span className="text-zinc-900 font-semibold">{inc.type}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[11px] font-medium text-stone-700">
                  {inc.status === 'RESOLVED'
                    ? '✓ Résolu'
                    : inc.status === 'IN_PROGRESS'
                    ? '● En cours de dépannage'
                    : '○ En attente intervention'}
                </span>
                <button className="pro-button-secondary px-3 py-1.5 rounded-xl text-xs font-semibold transition">
                  Traiter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. EQUIPMENT REGISTRY */}
      {subTab === 'equipment' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {equipment.map((eq) => (
            <div
              key={eq.id}
              className="p-5 rounded-2xl pro-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                    {eq.type}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
                    {eq.status === 'OPERATIONAL' ? 'En Service' : 'Hors Service'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-950 mt-2">{eq.name}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{eq.brand}</p>

                <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Dernier contrôle :</span>
                    <span className="font-medium text-zinc-900">{eq.lastMaintenance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Prochain entretien :</span>
                    <span className="font-semibold text-zinc-900">{eq.nextMaintenance}</span>
                  </div>
                  <div className="pt-1.5 border-t border-stone-200 text-[11px] text-stone-500">
                    <span>Prestataire : {eq.provider}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex justify-end">
                <button className="pro-button-secondary px-3 py-1.5 rounded-xl text-xs font-semibold transition">
                  Planifier Visite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
