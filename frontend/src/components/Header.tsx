import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Plus,
  Bell,
  Search,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  UserPlus,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  selectedResidenceId: string;
  onResidenceChange: (id: string) => void;
  residences: { id: string; name: string; type: string; wilaya: string }[];
  onQuickAction: (action: 'PAYMENT' | 'INCIDENT' | 'RESIDENT' | 'EXPENSE') => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedResidenceId,
  onResidenceChange,
  residences,
  onQuickAction,
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const activeResidence = residences.find((r) => r.id === selectedResidenceId) || residences[0];

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Context: Residence Selector & Period */}
      <div className="flex items-center gap-4">
        {/* Residence Dropdown Switcher */}
        <div className="relative">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer">
            <Building2 className="h-4 w-4 text-blue-400" />
            <select
              value={selectedResidenceId}
              onChange={(e) => onResidenceChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-100 outline-none cursor-pointer pr-2"
            >
              {residences.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200">
                  {r.name} ({r.type} - {r.wilaya})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Current Period Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-semibold">Mars 2026</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold">
            En cours
          </span>
        </div>
      </div>

      {/* Right Controls: Quick Actions, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Action Rapide</span>
            <ChevronDown className="h-3 w-3 opacity-80" />
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('PAYMENT');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-emerald-400 transition"
              >
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <span>Enregistrer un Paiement</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('INCIDENT');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition"
              >
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Signaler un Incident</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('RESIDENT');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-blue-400 transition"
              >
                <UserPlus className="h-4 w-4 text-blue-400" />
                <span>Ajouter un Résident</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('EXPENSE');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-purple-400 transition"
              >
                <DollarSign className="h-4 w-4 text-purple-400" />
                <span>Saisir une Dépense</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <button className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
        </button>

        {/* Manager User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-md shadow-blue-500/20">
            AM
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-slate-200 leading-none">Abdelhadi M.</p>
            <p className="text-[10px] text-slate-500 font-medium">Administrateur Principal</p>
          </div>
        </div>
      </div>
    </header>
  );
};
