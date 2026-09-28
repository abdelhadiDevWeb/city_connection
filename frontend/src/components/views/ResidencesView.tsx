import React, { useState } from 'react';
import {
  Building2,
  Building,
  Home,
  Plus,
  Search,
  MapPin,
  ChevronRight,
  Layers,
  UserCheck,
  Phone,
  Mail,
  ShieldAlert,
} from 'lucide-react';

interface ResidencesViewProps {
  residences: any[];
  buildings: any[];
  apartments: any[];
  buildingManagers?: any[];
  currentRole?: 'RESIDENCE_MANAGER' | 'BUILDING_MANAGER';
  onOpenAddResidence: () => void;
  onOpenAddBuilding: () => void;
  onOpenAddApartment: () => void;
  onOpenAddBuildingManager?: () => void;
}

export const ResidencesView: React.FC<ResidencesViewProps> = ({
  residences,
  buildings,
  apartments,
  buildingManagers = [],
  currentRole = 'RESIDENCE_MANAGER',
  onOpenAddResidence,
  onOpenAddBuilding,
  onOpenAddApartment,
  onOpenAddBuildingManager,
}) => {
  const [activeTab, setActiveTab] = useState<'buildings' | 'apartments' | 'managers' | 'residences'>('buildings');
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
      {/* View Header with Sub-tabs and Role-based Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-zinc-800" />
            <span>Patrimoine, Bâtiments & Gestionnaires</span>
          </h1>
          <p className="text-xs text-stone-500">
            Structure organisationnelle : Résidence → Bâtiments → Gestionnaires de Bâtiment → Appartements
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Action: Add Residence (Only Residence Manager) */}
          {activeTab === 'residences' && currentRole === 'RESIDENCE_MANAGER' && (
            <button
              onClick={onOpenAddResidence}
              className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle Résidence</span>
            </button>
          )}

          {/* Action: Add Building (Only Residence Manager) */}
          {activeTab === 'buildings' && (
            currentRole === 'RESIDENCE_MANAGER' ? (
              <button
                onClick={onOpenAddBuilding}
                className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Nouveau Bâtiment (Bloc)</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 text-[11px] font-medium flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Ajout réservé au Gestionnaire Résidence</span>
              </div>
            )
          )}

          {/* Action: Add Building Manager (Only Residence Manager) */}
          {activeTab === 'managers' && (
            currentRole === 'RESIDENCE_MANAGER' ? (
              <button
                onClick={onOpenAddBuildingManager}
                className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Nommer Gestionnaire Bâtiment</span>
              </button>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 text-[11px] font-medium flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Gestion réservée au Gestionnaire Résidence</span>
              </div>
            )
          )}

          {activeTab === 'apartments' && (
            <button
              onClick={onOpenAddApartment}
              className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvel Appartement</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('buildings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition shrink-0 ${
            activeTab === 'buildings'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
          }`}
        >
          <Building className="h-4 w-4" />
          <span>Bâtiments & Blocs ({buildings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('managers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition shrink-0 ${
            activeTab === 'managers'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Gestionnaires de Bâtiment ({buildingManagers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('apartments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition shrink-0 ${
            activeTab === 'apartments'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Appartements ({apartments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('residences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition shrink-0 ${
            activeTab === 'residences'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Portfolio Résidences ({residences.length})</span>
        </button>
      </div>

      {/* Tab Content: 1. BUILDINGS */}
      {activeTab === 'buildings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {buildings.map((b) => {
            const manager = buildingManagers.find(
              (m) => m.assignedBuildingId === b.id || m.assignedBuildingName === b.name
            );

            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl pro-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      {b.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
                      {b.elevatorStatus === 'OPERATIONAL'
                        ? 'Ascenseur OK'
                        : b.elevatorStatus === 'DEGRADED'
                        ? 'Ascenseur Bruit'
                        : 'Ascenseur En Panne'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-950 mt-1">
                    {b.apartmentsCount} Appartements
                  </h3>
                  <p className="text-xs text-stone-500">{b.floorsCount} Étages avec ascenseur Otis</p>

                  {/* Assigned Building Manager Pill */}
                  <div className="mt-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="text-[10px] text-stone-500 font-semibold uppercase">
                      Gestionnaire du Bâtiment
                    </div>
                    <div className="text-xs font-bold text-zinc-950 mt-0.5 flex items-center justify-between">
                      <span>{manager ? manager.fullName : 'Non affecté'}</span>
                      {manager && (
                        <span className="text-[10px] font-normal text-stone-500 font-mono">
                          {manager.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Occupation :</span>
                      <span className="font-semibold text-zinc-900">
                        {b.occupiedApartments} / {b.apartmentsCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Taux Recouvrement :</span>
                      <span className="font-semibold text-zinc-950">
                        {b.collectionRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Impayés du bloc :</span>
                      <span className="font-mono font-bold text-zinc-950">
                        {b.unpaidAmount.toLocaleString()} DZD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    {b.openIssuesCount > 0 ? `${b.openIssuesCount} panne active` : 'Aucun incident'}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedBuildingFilter(b.id);
                      setActiveTab('apartments');
                    }}
                    className="text-xs font-semibold text-zinc-900 hover:text-black flex items-center gap-1 underline underline-offset-4"
                  >
                    <span>Voir Logements</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: 2. BUILDING MANAGERS (GESTIONNAIRES DE BÂTIMENT) */}
      {activeTab === 'managers' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl pro-card flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                <UserCheck className="h-5 w-5 text-zinc-900" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-950">
                  Rôle : Gestionnaires de Bâtiment (Chefs de Blocs)
                </h3>
                <p className="text-xs text-stone-500">
                  Les gestionnaires de bâtiment sont désignés par le Gestionnaire de Résidence pour inscrire les résidents et superviser leur bloc.
                </p>
              </div>
            </div>

            {currentRole === 'RESIDENCE_MANAGER' && (
              <button
                onClick={onOpenAddBuildingManager}
                className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Nommer un Gestionnaire</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {buildingManagers.map((mgr) => (
              <div
                key={mgr.id}
                className="p-5 rounded-2xl pro-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
                      Gestionnaire Bâtiment
                    </span>
                    <span className="text-xs font-semibold text-zinc-950 flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-stone-500" />
                      <span>{mgr.assignedBuildingName}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-950 mt-2">{mgr.fullName}</h3>

                  <div className="mt-3 space-y-1.5 text-xs text-stone-500">
                    <div className="flex items-center gap-2 text-stone-700">
                      <Phone className="h-3.5 w-3.5 text-stone-400" />
                      <a href={`tel:${mgr.phone}`} className="hover:text-black font-mono">
                        {mgr.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-stone-400" />
                      <span>{mgr.email}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Logements supervisés :</span>
                      <span className="font-semibold text-zinc-900">{mgr.managedApartmentsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Résidents enregistrés :</span>
                      <span className="font-semibold text-zinc-900">{mgr.managedResidentsCount}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-stone-200">
                      <span className="text-stone-500">Statut :</span>
                      <span className="text-[11px] font-semibold text-zinc-900">Actif & Habilité</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-stone-400">Affecté en {mgr.assignedAt}</span>
                  <a
                    href={`tel:${mgr.phone}`}
                    className="pro-button-secondary px-2.5 py-1 rounded-lg text-xs font-semibold transition"
                  >
                    Contacter
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: 3. APARTMENTS */}
      {activeTab === 'apartments' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl pro-card">
            <div className="relative w-full sm:w-72">
              <Search className="h-3.5 w-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher apt, résident, tél..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-900 placeholder-stone-400 focus:outline-none focus:border-zinc-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-stone-500 shrink-0">Filtrer par bloc :</span>
              <select
                value={selectedBuildingFilter}
                onChange={(e) => setSelectedBuildingFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 text-xs font-medium text-zinc-900 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
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
          <div className="rounded-2xl pro-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[11px] bg-stone-50/60">
                  <th className="py-2.5 px-4">Logement</th>
                  <th className="py-2.5 px-4">Bâtiment</th>
                  <th className="py-2.5 px-4">Étage / Type</th>
                  <th className="py-2.5 px-4">Occupant Actuel</th>
                  <th className="py-2.5 px-4">Téléphone</th>
                  <th className="py-2.5 px-4">Charge Mensuelle</th>
                  <th className="py-2.5 px-4">Solde Actuel</th>
                  <th className="py-2.5 px-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredApartments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4 font-bold text-zinc-950 flex items-center gap-2">
                      <span className="h-6 w-6 rounded-lg bg-stone-100 border border-stone-200 text-zinc-900 flex items-center justify-center text-[10px] font-semibold">
                        {apt.number}
                      </span>
                      <span>Apt {apt.number}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-700">{apt.buildingName}</td>
                    <td className="py-3 px-4 text-stone-500">
                      Étage {apt.floor} • <span className="text-zinc-900 font-semibold">{apt.type}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-zinc-950">{apt.occupantName}</td>
                    <td className="py-3 px-4 text-stone-500 font-mono">{apt.phone}</td>
                    <td className="py-3 px-4 font-semibold text-zinc-900">
                      {apt.monthlyCharge.toLocaleString()} DZD
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                      {apt.balance === 0 ? (
                        <span className="text-stone-400">0 DZD</span>
                      ) : (
                        <span>{apt.balance.toLocaleString()} DZD</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
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

      {/* Tab Content: 4. RESIDENCES */}
      {activeTab === 'residences' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {residences.map((r) => (
            <div
              key={r.id}
              className="p-6 rounded-2xl pro-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 border border-stone-200 font-medium">
                    {r.type}
                  </span>
                  <span className="text-xs font-mono font-semibold text-stone-500">{r.code}</span>
                </div>

                <h3 className="text-lg font-bold text-zinc-950 mt-2">{r.name}</h3>

                <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                  <span>
                    {r.commune}, {r.wilaya}
                  </span>
                </div>

                <p className="text-xs text-stone-500 mt-2">{r.address}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-200">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <p className="text-[10px] text-stone-500 font-semibold uppercase">Bâtiments</p>
                    <p className="text-base font-bold text-zinc-950">{r.totalBuildings}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <p className="text-[10px] text-stone-500 font-semibold uppercase">Appartements</p>
                    <p className="text-base font-bold text-zinc-950">{r.totalApartments}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setActiveTab('buildings')}
                  className="pro-button-secondary px-3 py-1.5 rounded-xl text-xs font-semibold transition"
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
