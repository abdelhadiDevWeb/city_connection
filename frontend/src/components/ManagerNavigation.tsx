import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  Wrench,
  UserCheck,
  Megaphone,
  FolderOpen,
  BarChart3,
  Sliders,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'residences'
  | 'residents'
  | 'finances'
  | 'maintenance'
  | 'staff'
  | 'announcements'
  | 'documents'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  badgeCounts?: {
    unpaid?: number;
    incidents?: number;
    maintenance?: number;
    tasks?: number;
  };
}

export const ManagerSidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  badgeCounts = { unpaid: 18, incidents: 3, maintenance: 5, tasks: 4 },
}) => {
  const menuItems: { id: NavTab; label: string; icon: any; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'residences', label: 'Résidences & Bâtiments', icon: Building2 },
    { id: 'residents', label: 'Résidents & Occupants', icon: Users },
    {
      id: 'finances',
      label: 'Finances & Charges',
      icon: Wallet,
      badge: badgeCounts.unpaid,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
    {
      id: 'maintenance',
      label: 'Maintenance & Pannes',
      icon: Wrench,
      badge: badgeCounts.incidents,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 'staff',
      label: 'Personnel & Tâches',
      icon: UserCheck,
      badge: badgeCounts.tasks,
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    { id: 'announcements', label: 'Annonces & Alertes', icon: Megaphone },
    { id: 'documents', label: 'Documents & Contrats', icon: FolderOpen },
    { id: 'reports', label: 'Rapports & Exports', icon: BarChart3 },
    { id: 'settings', label: 'Configuration & Types', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-slate-800/80 backdrop-blur-xl flex flex-col shrink-0 h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              <span>CITÉ CONNECT</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Gestion Copropriété & AADL</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-300 uppercase">
          Menu Opérationnel
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/20 text-white border border-blue-500/40 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tenancy & Scoped Role Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-200 truncate">Syndic Al-Amel</p>
              <p className="text-[10px] text-emerald-400 font-medium truncate">Gestionnaire Agréé</p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">v2.4</span>
        </div>
      </div>
    </aside>
  );
};
