import React from 'react';
import {
  AlertTriangle,
  FileText,
  Wrench,
  CheckCircle2,
  Clock,
  Building,
  DollarSign,
  ChevronRight,
  ShieldAlert,
  Zap,
  Droplets,
} from 'lucide-react';
import { NavTab } from '../ManagerNavigation';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenPaymentModal: () => void;
  onOpenIncidentModal: () => void;
  buildings: any[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenPaymentModal,
  onOpenIncidentModal,
  buildings,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl pro-card-elevated">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-semibold text-stone-700 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
            <span>SUPERVISION OPÉRATIONNELLE EN DIRECT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Tableau de Bord Cité Connect
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Que se passe-t-il dans vos résidences en ce moment ? Décisions et actions prioritaires.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPaymentModal}
            className="pro-button-primary px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 active:scale-95"
          >
            <DollarSign className="h-4 w-4" />
            <span>Encaisser Paiement</span>
          </button>
          <button
            onClick={onOpenIncidentModal}
            className="pro-button-secondary px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 active:scale-95"
          >
            <AlertTriangle className="h-4 w-4 text-stone-700" />
            <span>Signaler Incident</span>
          </button>
        </div>
      </div>

      {/* 2. SECTION CRITIQUE: À TRAITER D'URGENCE */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-zinc-800" />
            <span>À Traiter en Priorité</span>
          </h2>
          <span className="text-[11px] text-stone-500">Actions requérant une intervention immédiate</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Unpaid Apartments */}
          <button
            onClick={() => onNavigate('finances')}
            className="p-4 rounded-xl pro-card hover:border-stone-400 text-left transition hover:shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-600">Impayés</span>
              <span className="h-2 w-2 rounded-full bg-red-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-2 group-hover:text-black transition-colors">
              18
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">Appartements en retard</p>
            <div className="text-[10px] text-zinc-800 font-semibold mt-2.5 flex items-center gap-1 group-hover:underline">
              <span>Voir la liste</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>

          {/* Card 2: Overdue Bills */}
          <button
            onClick={() => onNavigate('finances')}
            className="p-4 rounded-xl pro-card hover:border-stone-400 text-left transition hover:shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-600">Factures</span>
              <Clock className="h-3.5 w-3.5 text-stone-700" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-2 group-hover:text-black transition-colors">
              1
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">Sonelgaz en retard</p>
            <div className="text-[10px] text-zinc-800 font-semibold mt-2.5 flex items-center gap-1 group-hover:underline">
              <span>48 500 DZD dû</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>

          {/* Card 3: Broken Equipment */}
          <button
            onClick={() => onNavigate('maintenance')}
            className="p-4 rounded-xl pro-card hover:border-stone-400 text-left transition hover:shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-600">Équipement</span>
              <Wrench className="h-3.5 w-3.5 text-stone-700" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-2 group-hover:text-black transition-colors">
              1
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">Ascenseur Bloc B1 HS</p>
            <div className="text-[10px] text-zinc-800 font-semibold mt-2.5 flex items-center gap-1 group-hover:underline">
              <span>Dépannage en cours</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>

          {/* Card 4: Critical Incidents */}
          <button
            onClick={() => onNavigate('maintenance')}
            className="p-4 rounded-xl pro-card hover:border-stone-400 text-left transition hover:shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-600">Incidents</span>
              <Droplets className="h-3.5 w-3.5 text-stone-700" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-2 group-hover:text-black transition-colors">
              2
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">Fuites d’eau signalées</p>
            <div className="text-[10px] text-zinc-800 font-semibold mt-2.5 flex items-center gap-1 group-hover:underline">
              <span>Bloc A2 & B1</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>

          {/* Card 5: Overdue Tasks */}
          <button
            onClick={() => onNavigate('staff')}
            className="p-4 rounded-xl pro-card hover:border-stone-400 text-left transition hover:shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-600">Tâches</span>
              <Clock className="h-3.5 w-3.5 text-stone-700" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-2 group-hover:text-black transition-colors">
              1
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">Éclairage entrée cité</p>
            <div className="text-[10px] text-zinc-800 font-semibold mt-2.5 flex items-center gap-1 group-hover:underline">
              <span>Assigné à Karim</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>

          {/* Card 6: SEAAL Bill Due */}
          <button
            onClick={() => onNavigate('finances')}
            className="p-4 rounded-xl pro-card hover:border-stone-400 text-left transition hover:shadow-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-600">Échéance</span>
              <FileText className="h-3.5 w-3.5 text-stone-700" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-2 group-hover:text-black transition-colors">
              15 Mars
            </div>
            <p className="text-[10px] text-stone-500 mt-0.5">Facture SEAAL</p>
            <div className="text-[10px] text-zinc-800 font-semibold mt-2.5 flex items-center gap-1 group-hover:underline">
              <span>32 000 DZD</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>
        </div>
      </div>

      {/* 3. FINANCIAL COLLECTION & EXPENSE METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Status */}
        <div className="p-6 rounded-2xl pro-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900">Recouvrement des Charges (Mars 2026)</h3>
            <span className="text-xs font-bold text-zinc-900 px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-200">
              75.0%
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Total Attendu :</span>
              <span className="font-semibold text-zinc-900">960 000 DZD</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Encaissé ce mois :</span>
              <span className="font-bold text-zinc-950">720 000 DZD</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">Restant à Recouvrer :</span>
              <span className="font-semibold text-stone-700">240 000 DZD</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100 rounded-full h-2.5 mt-3 overflow-hidden p-0.5 border border-stone-200">
              <div
                className="bg-zinc-900 h-full rounded-full transition-all duration-500"
                style={{ width: '75%' }}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
            <span>Dette cumulée historique :</span>
            <span className="font-mono font-bold text-zinc-900 text-xs">72 000 DZD</span>
          </div>
        </div>

        {/* Expenses & Cash Outflow */}
        <div className="p-6 rounded-2xl pro-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900">Dépenses Opérationnelles</h3>
            <span className="text-xs font-bold text-zinc-900 px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-200">
              77 500 DZD
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Ascenseurs (Maintenance SARL)</span>
              <span className="font-semibold text-zinc-900">35 000 DZD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Plomberie & Réparation Pompes</span>
              <span className="font-semibold text-zinc-900">28 000 DZD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Fournitures d’Entretien</span>
              <span className="font-semibold text-zinc-900">14 500 DZD</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs text-stone-500">Solde de Trésorerie Actuel :</span>
            <span className="text-sm font-bold text-zinc-950 font-mono">642 500 DZD</span>
          </div>
        </div>

        {/* Equipment & Physical Infrastructure Health */}
        <div className="p-6 rounded-2xl pro-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900">Disponibilité Équipements</h3>
            <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-zinc-800" />
              <span>88% Conforme</span>
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-stone-600">Ascenseurs Opérationnels</span>
                <span className="font-semibold text-zinc-900">3 / 4 (75%)</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                <div className="bg-zinc-800 h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-stone-600">Surpresseurs & Pompes d’Eau</span>
                <span className="font-semibold text-zinc-900">2 / 2 (100%)</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                <div className="bg-zinc-800 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-stone-600">Groupe Électrogène de Secours</span>
                <span className="font-semibold text-zinc-900">Opérationnel</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                <div className="bg-zinc-800 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PERFORMANCE DES BÂTIMENTS */}
      <div className="p-6 rounded-2xl pro-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <Building className="h-4 w-4 text-zinc-800" />
              <span>État des Bâtiments — Cité 1500 Logements</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Comparatif du taux de recouvrement, impayés et état des ascenseurs par bloc
            </p>
          </div>
          <button
            onClick={() => onNavigate('residences')}
            className="text-xs font-semibold text-zinc-900 hover:text-black transition flex items-center gap-1 underline underline-offset-4"
          >
            <span>Gérer les Bâtiments</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[11px] bg-stone-50/60">
                <th className="py-2.5 px-3">Bâtiment</th>
                <th className="py-2.5 px-3">Appartements</th>
                <th className="py-2.5 px-3">Occupation</th>
                <th className="py-2.5 px-3">Taux Recouvrement</th>
                <th className="py-2.5 px-3">Montant Impayé</th>
                <th className="py-2.5 px-3">Ascenseur</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {buildings.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50/80 transition">
                  <td className="py-3 px-3 font-semibold text-zinc-950 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                    <span>{b.name}</span>
                  </td>
                  <td className="py-3 px-3 text-stone-600">{b.apartmentsCount} logts ({b.floorsCount} étages)</td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-zinc-900">
                      {b.occupiedApartments} occupés
                    </span>{' '}
                    <span className="text-[10px] text-stone-400">
                      ({Math.round((b.occupiedApartments / b.apartmentsCount) * 100)}%)
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-950">
                        {b.collectionRate}%
                      </span>
                      <div className="w-16 bg-stone-100 h-1.5 rounded-full overflow-hidden border border-stone-200">
                        <div
                          className="h-full rounded-full bg-zinc-800"
                          style={{ width: `${b.collectionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-zinc-900">
                    {b.unpaidAmount > 0 ? `${b.unpaidAmount.toLocaleString()} DZD` : '0 DZD'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
                      {b.elevatorStatus === 'OPERATIONAL'
                        ? 'En Service'
                        : b.elevatorStatus === 'DEGRADED'
                        ? 'Bruit suspect'
                        : 'Hors Service'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigate('residences')}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-zinc-800 transition text-[11px] font-semibold border border-stone-200"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
