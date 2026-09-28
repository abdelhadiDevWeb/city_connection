import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Mail,
  Home,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

interface ResidentsViewProps {
  onOpenAddResident: () => void;
  apartments: any[];
  residentsList?: any[];
  currentRole?: 'RESIDENCE_MANAGER' | 'BUILDING_MANAGER';
}

const DEFAULT_RESIDENTS = [
  {
    id: 'res-1',
    fullName: 'Krimo Benali',
    type: 'OWNER',
    apartment: 'A1 - Apt 01',
    floor: 0,
    phone: '0550 12 34 56',
    email: 'krimo.benali@gmail.com',
    joinedDate: 'Janvier 2024',
    balance: 0,
    status: 'UP_TO_DATE',
  },
  {
    id: 'res-2',
    fullName: 'Amina Saidi',
    type: 'OWNER',
    apartment: 'A1 - Apt 02',
    floor: 0,
    phone: '0661 98 76 54',
    email: 'amina.saidi@yahoo.fr',
    joinedDate: 'Mars 2024',
    balance: 2000,
    status: 'CREDIT',
  },
  {
    id: 'res-3',
    fullName: 'Youcef Belhadj',
    type: 'TENANT',
    apartment: 'A2 - Apt 04',
    floor: 1,
    phone: '0770 45 67 89',
    email: 'y.belhadj@hotmail.com',
    joinedDate: 'Novembre 2024',
    balance: -8000,
    status: 'DEBT',
  },
  {
    id: 'res-4',
    fullName: 'Farida Meziane',
    type: 'OWNER',
    apartment: 'B1 - Apt 12',
    floor: 3,
    phone: '0662 33 44 55',
    email: 'f.meziane@gmail.com',
    joinedDate: 'Février 2024',
    balance: -6000,
    status: 'DEBT',
  },
  {
    id: 'res-5',
    fullName: 'Rachid Mebarki',
    type: 'TENANT',
    apartment: 'A2 - Apt 08',
    floor: 2,
    phone: '0555 78 90 12',
    email: 'rachid.m@gmail.com',
    joinedDate: 'Juin 2025',
    balance: -4000,
    status: 'DEBT',
  },
];

export const ResidentsView: React.FC<ResidentsViewProps> = ({
  onOpenAddResident,
  residentsList = DEFAULT_RESIDENTS,
  currentRole = 'BUILDING_MANAGER',
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'OWNER' | 'TENANT'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = residentsList.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search) ||
      r.apartment.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || r.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <Users className="h-5 w-5 text-zinc-800" />
            <span>Répertoire des Résidents & Copropriétaires</span>
          </h1>
          <p className="text-xs text-stone-500">
            Fiches des occupants, historique des paiements, réclamations et coordonnées
          </p>
        </div>

        {/* Add Resident Button */}
        {currentRole === 'BUILDING_MANAGER' ? (
          <button
            onClick={onOpenAddResident}
            className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-xs"
          >
            <UserPlus className="h-4 w-4" />
            <span>Inscrire un Résident (Chef Bâtiment)</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddResident}
              className="pro-button-secondary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2"
              title="Action généralement déléguée au Gestionnaire de Bâtiment"
            >
              <UserPlus className="h-4 w-4 text-stone-700" />
              <span>Inscrire un Résident</span>
            </button>
          </div>
        )}
      </div>

      {/* Role Context Notification Bar */}
      <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          {currentRole === 'BUILDING_MANAGER' ? (
            <UserCheck className="h-4 w-4 text-zinc-900 shrink-0" />
          ) : (
            <ShieldCheck className="h-4 w-4 text-zinc-900 shrink-0" />
          )}
          <div>
            <span className="font-semibold text-zinc-950">
              {currentRole === 'BUILDING_MANAGER'
                ? 'Habilitation Gestionnaire de Bâtiment :'
                : 'Supervision Gestionnaire de Résidence :'}
            </span>{' '}
            <span className="text-stone-600">
              {currentRole === 'BUILDING_MANAGER'
                ? 'Vous êtes autorisé à inscrire les nouveaux occupants de vos blocs et tenir à jour leurs coordonnées.'
                : 'L’inscription quotidienne des résidents est prise en charge par les Gestionnaires de Bâtiment désignés.'}
            </span>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 font-bold shrink-0">
          {currentRole === 'BUILDING_MANAGER' ? 'GESTIONNAIRE BÂTIMENT' : 'GESTIONNAIRE RÉSIDENCE'}
        </span>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl pro-card">
        <div className="relative w-full sm:w-72">
          <Search className="h-3.5 w-3.5 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, téléphone, logement..."
            className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-900 placeholder-stone-400 focus:outline-none focus:border-zinc-900"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs transition ${
              filterType === 'ALL'
                ? 'bg-zinc-950 text-white font-semibold shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
            }`}
          >
            Tous ({residentsList.length})
          </button>
          <button
            onClick={() => setFilterType('OWNER')}
            className={`px-3 py-1.5 rounded-xl text-xs transition ${
              filterType === 'OWNER'
                ? 'bg-zinc-950 text-white font-semibold shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
            }`}
          >
            Propriétaires
          </button>
          <button
            onClick={() => setFilterType('TENANT')}
            className={`px-3 py-1.5 rounded-xl text-xs transition ${
              filterType === 'TENANT'
                ? 'bg-zinc-950 text-white font-semibold shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
            }`}
          >
            Locataires
          </button>
        </div>
      </div>

      {/* Residents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="p-5 rounded-2xl pro-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2.5 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
                  {r.type === 'OWNER' ? 'Copropriétaire' : 'Locataire'}
                </span>
                <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                  <Home className="h-3 w-3 text-stone-400" />
                  <span>{r.apartment}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-zinc-950 mt-2">{r.fullName}</h3>

              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-stone-600">
                  <Phone className="h-3.5 w-3.5 text-stone-400" />
                  <a href={`tel:${r.phone}`} className="hover:text-black font-mono">
                    {r.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-stone-500">
                  <Mail className="h-3.5 w-3.5 text-stone-400" />
                  <span>{r.email}</span>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-xs text-stone-500">Situation financière :</span>
                <span className="font-mono font-bold text-xs text-zinc-950">
                  {r.balance === 0
                    ? 'À jour'
                    : r.balance > 0
                    ? `+${r.balance.toLocaleString()} DZD`
                    : `${r.balance.toLocaleString()} DZD`}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[10px] text-stone-400">Depuis {r.joinedDate}</span>
              <a
                href={`tel:${r.phone}`}
                className="pro-button-secondary px-2.5 py-1 rounded-lg text-xs font-semibold transition"
              >
                Appeler
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
