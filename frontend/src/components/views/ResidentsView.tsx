import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Mail,
  Home,
  Shield,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface ResidentsViewProps {
  onOpenAddResident: () => void;
  apartments: any[];
}

export const ResidentsView: React.FC<ResidentsViewProps> = ({ onOpenAddResident, apartments }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'OWNER' | 'TENANT'>('ALL');
  const [search, setSearch] = useState('');

  const residents = [
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

  const filtered = residents.filter((r) => {
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
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span>Répertoire des Résidents & Copropriétaires</span>
          </h1>
          <p className="text-xs text-slate-400">
            Fiches des occupants, historique des paiements, réclamations et coordonnées
          </p>
        </div>

        <button
          onClick={onOpenAddResident}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <UserPlus className="h-4 w-4" />
          <span>Nouveau Résident</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, téléphone, logement..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tous ({residents.length})
          </button>
          <button
            onClick={() => setFilterType('OWNER')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'OWNER' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Propriétaires
          </button>
          <button
            onClick={() => setFilterType('TENANT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'TENANT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
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
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    r.type === 'OWNER'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {r.type === 'OWNER' ? 'Copropriétaire' : 'Locataire'}
                </span>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Home className="h-3 w-3 text-slate-500" />
                  <span>{r.apartment}</span>
                </span>
              </div>

              <h3 className="text-base font-black text-white mt-2">{r.fullName}</h3>

              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-slate-500" />
                  <a href={`tel:${r.phone}`} className="hover:text-blue-400 font-mono">
                    {r.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  <span>{r.email}</span>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Situation financière :</span>
                <span
                  className={`font-mono font-bold text-xs ${
                    r.balance < 0 ? 'text-rose-400' : r.balance > 0 ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  {r.balance === 0
                    ? 'À jour'
                    : r.balance > 0
                    ? `+${r.balance.toLocaleString()} DZD`
                    : `${r.balance.toLocaleString()} DZD`}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Depuis {r.joinedDate}</span>
              <a
                href={`tel:${r.phone}`}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
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
