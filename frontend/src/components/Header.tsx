import React, { useState } from 'react';
import {
  Building2,
  ChevronDown,
  Plus,
  DollarSign,
  AlertTriangle,
  UserPlus,
  Bell,
  Building,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export type UserRole = 'RESIDENCE_MANAGER' | 'BUILDING_MANAGER';

interface HeaderProps {
  selectedResidenceId: string;
  onResidenceChange: (id: string) => void;
  residences: any[];
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onQuickAction: (action: 'PAYMENT' | 'INCIDENT' | 'RESIDENT' | 'EXPENSE' | 'BUILDING' | 'BUILDING_MANAGER') => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedResidenceId,
  onResidenceChange,
  residences,
  currentRole,
  onRoleChange,
  onQuickAction,
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const currentResidence =
    residences.find((r) => r.id === selectedResidenceId) || residences[0];

  return (
    <header className="h-16 px-6 md:px-8 border-b border-stone-200 bg-white/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 select-none shadow-2xs">
      {/* Left: Active Residence Selector & Role Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 hover:border-stone-400 transition cursor-pointer">
          <Building2 className="h-4 w-4 text-zinc-900" />
          <select
            value={selectedResidenceId}
            onChange={(e) => onResidenceChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-zinc-900 focus:outline-none cursor-pointer pr-1"
          >
            {residences.map((res) => (
              <option key={res.id} value={res.id} className="text-zinc-900">
                {res.name} ({res.commune || res.city || 'Alger'})
              </option>
            ))}
          </select>
        </div>

        {/* Role Switcher Pills */}
        <div className="hidden lg:flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200">
          <button
            onClick={() => onRoleChange('RESIDENCE_MANAGER')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              currentRole === 'RESIDENCE_MANAGER'
                ? 'bg-zinc-950 text-white shadow-2xs'
                : 'text-stone-600 hover:text-zinc-950'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Gestionnaire Résidence</span>
          </button>

          <button
            onClick={() => onRoleChange('BUILDING_MANAGER')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              currentRole === 'BUILDING_MANAGER'
                ? 'bg-zinc-950 text-white shadow-2xs'
                : 'text-stone-600 hover:text-zinc-950'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Gestionnaire Bâtiment</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 font-semibold">
          <span>•</span>
          <span>{currentResidence?.totalApartments || currentResidence?.units || 480} Logements</span>
        </div>
      </div>

      {/* Right Controls: Quick Actions, Role Dropdown (Mobile), Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Mobile Role Toggle */}
        <div className="lg:hidden">
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="bg-stone-100 border border-stone-300 text-xs font-semibold text-zinc-900 rounded-xl px-2.5 py-1.5"
          >
            <option value="RESIDENCE_MANAGER">Rôle: Résidence</option>
            <option value="BUILDING_MANAGER">Rôle: Bâtiment</option>
          </select>
        </div>

        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl pro-button-primary text-white text-xs font-bold transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Action Rapide</span>
            <ChevronDown className="h-3 w-3 opacity-80" />
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-stone-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Role-specific Quick Actions */}
              {currentRole === 'RESIDENCE_MANAGER' ? (
                <>
                  <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase">
                    Actions Gestionnaire Résidence
                  </div>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction('BUILDING');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-900 hover:bg-stone-100 transition"
                  >
                    <Building className="h-4 w-4 text-zinc-950" />
                    <span>Ajouter un Bâtiment (Bloc)</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction('BUILDING_MANAGER');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-900 hover:bg-stone-100 transition"
                  >
                    <UserPlus className="h-4 w-4 text-zinc-950" />
                    <span>Nommer Gestionnaire Bâtiment</span>
                  </button>
                  <div className="my-1 border-t border-stone-100" />
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction('PAYMENT');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-900 hover:bg-stone-100 transition"
                  >
                    <DollarSign className="h-4 w-4 text-zinc-950" />
                    <span>Encaisser un Paiement</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction('EXPENSE');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-900 hover:bg-stone-100 transition"
                  >
                    <DollarSign className="h-4 w-4 text-zinc-950" />
                    <span>Saisir une Dépense</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase">
                    Actions Gestionnaire Bâtiment
                  </div>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction('RESIDENT');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-900 hover:bg-stone-100 transition"
                  >
                    <UserPlus className="h-4 w-4 text-zinc-950" />
                    <span>Inscrire un Résident</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction('INCIDENT');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-900 hover:bg-stone-100 transition"
                  >
                    <AlertTriangle className="h-4 w-4 text-zinc-950" />
                    <span>Signaler Panne / Incident</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowQuickMenu(false);
                      onQuickAction('PAYMENT');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-900 hover:bg-stone-100 transition"
                  >
                    <DollarSign className="h-4 w-4 text-zinc-950" />
                    <span>Encaisser Charges Logement</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <button className="h-9 w-9 rounded-xl bg-stone-100 border border-stone-200 hover:border-stone-400 flex items-center justify-center text-stone-600 hover:text-black transition relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-zinc-950" />
        </button>

        {/* Manager User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
          <div className="h-8 w-8 rounded-xl bg-zinc-950 flex items-center justify-center text-xs font-black text-white shadow-2xs">
            {currentRole === 'RESIDENCE_MANAGER' ? 'RM' : 'BM'}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-zinc-900 leading-none">
              {currentRole === 'RESIDENCE_MANAGER' ? 'Abdelhadi M.' : 'Mourad Taguine'}
            </p>
            <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
              {currentRole === 'RESIDENCE_MANAGER' ? 'Gestionnaire Résidence' : 'Gestionnaire Bâtiment (A1)'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
