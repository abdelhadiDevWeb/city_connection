import React, { useState } from 'react';
import {
  Building2,
  Building,
  Home,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';

interface ResidencesViewProps {
  residences: any[];
  buildings: any[];
  apartments: any[];
  onOpenAddResidence: () => void;
  onOpenAddBuilding: () => void;
  onOpenAddApartment: () => void;
}

export const ResidencesView: React.FC<ResidencesViewProps> = ({
  residences,
  buildings,
  apartments,
  onOpenAddResidence,
  onOpenAddBuilding,
  onOpenAddApartment,
}) => {
  const [activeTab, setActiveTab] = useState<'residences' | 'buildings' | 'apartments'>('buildings');
  const [search, setSearch] = useState('');
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState<string>('ALL');

  const filteredApartments = apartments.filter((a) => {
    const matchesSearch =
      a.number.toLowerCase().includes(search.toLowerCase()) ||
      a.occupantName.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search);
    const matchesBuilding = selectedBuildingFilter === 'ALL' || a.buildingId === selectedBuildingFilter;
    return matchesSearch && matchesBuilding;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* View Header with Sub-tabs and Create button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-400" />
            <span>Patrimoine & Logements</span>
          </h1>
          <p className="text-xs text-slate-400">
            Gestion hiérarchique : Résidence → Bâtiments → Appartements & Quotités
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'residences' && (
            <button
              onClick={onOpenAddResidence}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle Résidence</span>
            </button>
          )}
          {activeTab === 'buildings' && (
            <button
              onClick={onOpenAddBuilding}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouveau Bâtiment</span>
            </button>
          )}
          {activeTab === 'apartments' && (
            <button
              onClick={onOpenAddApartment}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvel Appartement</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('buildings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'buildings'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>Bâtiments & Blocs ({buildings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('apartments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'apartments'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Appartements ({apartments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('residences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'residences'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Portfolio Résidences ({residences.length})</span>
        </button>
      </div>

      {/* Tab Content: 1. BUILDINGS */}
      {activeTab === 'buildings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {buildings.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    {b.name}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      b.elevatorStatus === 'OPERATIONAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : b.elevatorStatus === 'DEGRADED'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {b.elevatorStatus === 'OPERATIONAL'
                      ? 'Ascenseur OK'
                      : b.elevatorStatus === 'DEGRADED'
                      ? 'Ascenseur Bruit'
                      : 'Ascenseur En Panne'}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white mt-1">
                  {b.apartmentsCount} Appartements
                </h3>
                <p className="text-xs text-slate-400">{b.floorsCount} Étages avec ascenseur Otis</p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Occupation :</span>
                    <span className="font-semibold text-slate-200">
                      {b.occupiedApartments} / {b.apartmentsCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taux Recouvrement :</span>
                    <span
                      className={`font-bold ${
                        b.collectionRate >= 80 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {b.collectionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Impayés du bloc :</span>
                    <span className="font-mono font-bold text-rose-400">
                      {b.unpaidAmount.toLocaleString()} DZD
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Concierge : Amine B.</span>
                <button
                  onClick={() => {
                    setSelectedBuildingFilter(b.id);
                    setActiveTab('apartments');
                  }}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Voir Logements</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: 2. APARTMENTS */}
      {activeTab === 'apartments' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher apt, résident, tél..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 shrink-0">Filtrer par bloc :</span>
              <select
                value={selectedBuildingFilter}
                onChange={(e) => setSelectedBuildingFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
              >
                <option value="ALL">Tous les Bâtiments</option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Apartments Table */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                  <th className="py-3 px-4">Logement</th>
                  <th className="py-3 px-4">Bâtiment</th>
                  <th className="py-3 px-4">Étage / Type</th>
                  <th className="py-3 px-4">Occupant Actuel</th>
                  <th className="py-3 px-4">Téléphone</th>
                  <th className="py-3 px-4">Charge Mensuelle</th>
                  <th className="py-3 px-4">Solde Actuel</th>
                  <th className="py-3 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApartments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-black text-white flex items-center gap-2">
                      <span className="h-6 w-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">
                        {apt.number}
                      </span>
                      <span>Apt {apt.number}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-300">{apt.buildingName}</td>
                    <td className="py-3 px-4 text-slate-400">
                      Étage {apt.floor} • <span className="text-slate-200 font-bold">{apt.type}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-200">{apt.occupantName}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono">{apt.phone}</td>
                    <td className="py-3 px-4 font-bold text-slate-300">
                      {apt.monthlyCharge.toLocaleString()} DZD
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {apt.balance === 0 ? (
                        <span className="text-slate-400">0 DZD</span>
                      ) : apt.balance > 0 ? (
                        <span className="text-emerald-400">+{apt.balance.toLocaleString()} DZD</span>
                      ) : (
                        <span className="text-rose-400">{apt.balance.toLocaleString()} DZD</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          apt.status === 'UP_TO_DATE'
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : apt.status === 'CREDIT'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {apt.status === 'UP_TO_DATE'
                          ? 'À jour'
                          : apt.status === 'CREDIT'
                          ? 'Avance'
                          : 'Impayé'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: 3. RESIDENCES */}
      {activeTab === 'residences' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {residences.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                    {r.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">{r.code}</span>
                </div>

                <h3 className="text-lg font-black text-white mt-2">{r.name}</h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span>
                    {r.commune}, {r.wilaya}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2">{r.address}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Bâtiments</p>
                    <p className="text-base font-black text-white">{r.totalBuildings}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Appartements</p>
                    <p className="text-base font-black text-white">{r.totalApartments}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveTab('buildings')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
                >
                  Accéder à la cité
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
