import React from 'react';
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
  currentRole?: 'RESIDENCE_MANAGER' | 'BUILDING_MANAGER';
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
  currentRole = 'RESIDENCE_MANAGER',
  badgeCounts = { unpaid: 18, incidents: 3, maintenance: 5, tasks: 4 },
}) => {
  const menuItems: { id: NavTab; label: string; icon: any; badge?: number }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'residences', label: 'Résidences & Bâtiments', icon: Building2 },
    { id: 'residents', label: 'Résidents & Occupants', icon: Users },
    {
      id: 'finances',
      label: 'Finances & Charges',
      icon: Wallet,
      badge: badgeCounts.unpaid,
    },
    {
      id: 'maintenance',
      label: 'Maintenance & Pannes',
      icon: Wrench,
      badge: badgeCounts.incidents,
    },
    {
      id: 'staff',
      label: 'Personnel & Tâches',
      icon: UserCheck,
      badge: badgeCounts.tasks,
    },
    { id: 'announcements', label: 'Annonces & Alertes', icon: Megaphone },
    { id: 'documents', label: 'Documents & Contrats', icon: FolderOpen },
    { id: 'reports', label: 'Rapports & Exports', icon: BarChart3 },
    { id: 'settings', label: 'Configuration & Types', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#fbfaf8] border-r border-stone-200 flex flex-col shrink-0 h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-zinc-950 flex items-center justify-center shadow-xs">
            <Building2 className="h-5 w-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="font-black text-sm tracking-tight text-zinc-950 flex items-center gap-1.5">
              <span>CITÉ CONNECT</span>
            </div>
            <p className="text-[10px] text-stone-500 font-semibold">Portail Syndic Professionnel</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
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
                  ? 'bg-zinc-950 text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:text-zinc-950 hover:bg-stone-200/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive
                      ? 'bg-zinc-800 text-stone-200'
                      : 'bg-stone-200 text-stone-700'
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
      <div className="p-3 border-t border-stone-200 bg-stone-100/40">
        <div className="px-3 py-2 rounded-xl bg-white border border-stone-200 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-7 w-7 rounded-lg bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-900" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-zinc-900 truncate">
                {currentRole === 'RESIDENCE_MANAGER' ? 'Syndic Al-Amel' : 'Mourad Taguine'}
              </p>
              <p className="text-[10px] text-stone-500 font-semibold truncate">
                {currentRole === 'RESIDENCE_MANAGER' ? 'Gestionnaire Résidence' : 'Chef de Bâtiment (A1)'}
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-stone-100 text-stone-700 border border-stone-200 px-1.5 py-0.5 rounded font-mono font-bold">
            {currentRole === 'RESIDENCE_MANAGER' ? 'R-MGR' : 'B-MGR'}
          </span>
        </div>
      </div>
    </aside>
  );
};
