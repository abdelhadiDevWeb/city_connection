import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  Cpu,
  Plus,
  CheckCircle2,
  Clock,
  Phone,
  ShieldCheck,
  Droplets,
  Zap,
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
  const [subTab, setSubTab] = useState<'incidents' | 'equipment' | 'interventions'>('incidents');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Wrench className="h-5 w-5 text-amber-400" />
            <span>Maintenance, Pannes & Équipements</span>
          </h1>
          <p className="text-xs text-slate-400">
            Gestion des pannes signalées, tickets d'intervention et suivi technique des ascenseurs & surpresseurs
          </p>
        </div>

        <button
          onClick={onOpenIncidentModal}
          className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-amber-600/20"
        >
          <Plus className="h-4 w-4" />
          <span>Signaler un Incident</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setSubTab('incidents')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            subTab === 'incidents'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Pannes & Incidents Signalés ({incidents.length})</span>
        </button>

        <button
          onClick={() => setSubTab('equipment')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            subTab === 'equipment'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
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
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      inc.priority === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : inc.priority === 'HIGH'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}
                  >
                    {inc.priority === 'CRITICAL'
                      ? 'Critique'
                      : inc.priority === 'HIGH'
                      ? 'Haute Priorité'
                      : 'Normale'}
                  </span>
                  <span className="text-[11px] text-slate-500">{inc.date}</span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2 leading-snug">{inc.title}</h3>

                <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Localisation :</span>
                    <span className="font-semibold text-slate-200">
                      {inc.building} — {inc.apartment}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Signalé par :</span>
                    <span className="font-semibold text-slate-200">{inc.reporter}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Catégorie :</span>
                    <span className="text-blue-400 font-bold">{inc.type}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold ${
                    inc.status === 'RESOLVED'
                      ? 'text-emerald-400'
                      : inc.status === 'IN_PROGRESS'
                      ? 'text-blue-400'
                      : 'text-amber-400'
                  }`}
                >
                  {inc.status === 'RESOLVED'
                    ? '✓ Résolu'
                    : inc.status === 'IN_PROGRESS'
                    ? '● En cours de dépannage'
                    : '○ En attente intervention'}
                </span>
                <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition">
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
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                    {eq.type}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      eq.status === 'OPERATIONAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {eq.status === 'OPERATIONAL' ? 'En Service' : 'Hors Service'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-2">{eq.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{eq.brand}</p>

                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dernier contrôle :</span>
                    <span className="font-semibold text-slate-200">{eq.lastMaintenance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prochain entretien :</span>
                    <span className="font-bold text-amber-400">{eq.nextMaintenance}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 text-[11px] text-slate-400">
                    <span>Prestataire : {eq.provider}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition">
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
