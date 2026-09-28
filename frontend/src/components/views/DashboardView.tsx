import React from 'react';
import {
  AlertTriangle,
  FileText,
  Wrench,
  CheckCircle2,
  Clock,
  TrendingUp,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Zap,
  Droplets,
  DollarSign,
  ChevronRight,
  PhoneCall,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 border border-slate-800/80 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[11px] font-bold text-blue-400 mb-2">
            <Zap className="h-3 w-3" />
            <span>SUPERVISION OPÉRATIONNELLE EN DIRECT</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Tableau de Bord Cité Connect
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Que se passe-t-il dans vos résidences en ce moment ? Décisions et actions prioritaires.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPaymentModal}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20 flex items-center gap-2 active:scale-95"
          >
            <DollarSign className="h-4 w-4" />
            <span>Encaisser Paiement</span>
          </button>
          <button
            onClick={onOpenIncidentModal}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 active:scale-95"
          >
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span>Signaler Incident</span>
          </button>
        </div>
      </div>

      {/* 2. SECTION CRITIQUE: ⚠️ À TRAITER D'URGENCE (Section 3 Requirement) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            <span>À Traiter en Priorité</span>
          </h2>
          <span className="text-[11px] text-slate-500">Actions requérant une intervention immédiate</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Unpaid Apartments */}
          <button
            onClick={() => onNavigate('finances')}
            className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 hover:border-rose-500/60 text-left transition hover:shadow-lg hover:shadow-rose-500/10 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-400">Impayés</span>
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <div className="text-2xl font-black text-rose-200 mt-2 group-hover:scale-105 transition-transform">
              18
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Appartements en retard</p>
            <div className="text-[10px] text-rose-400 font-semibold mt-2 flex items-center gap-1">
              <span>Voir la liste</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>

          {/* Card 2: Overdue Bills */}
          <button
            onClick={() => onNavigate('finances')}
            className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-500/60 text-left transition hover:shadow-lg hover:shadow-amber-500/10 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400">Factures</span>
              <Clock className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-200 mt-2 group-hover:scale-105 transition-transform">
              1
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Sonelgaz en retard</p>
            <div className="text-[10px] text-amber-400 font-semibold mt-2 flex items-center gap-1">
              <span>48 500 DZD dû</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>

          {/* Card 3: Broken Equipment */}
          <button
            onClick={() => onNavigate('maintenance')}
            className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 hover:border-red-500/60 text-left transition hover:shadow-lg hover:shadow-red-500/10 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-red-400">Équipement</span>
              <Wrench className="h-3.5 w-3.5 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-200 mt-2 group-hover:scale-105 transition-transform">
              1
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Ascenseur Bloc B1 HS</p>
            <div className="text-[10px] text-red-400 font-semibold mt-2 flex items-center gap-1">
              <span>Dépannage en cours</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>

          {/* Card 4: Critical Incidents */}
          <button
            onClick={() => onNavigate('maintenance')}
            className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 hover:border-purple-500/60 text-left transition hover:shadow-lg hover:shadow-purple-500/10 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-400">Incidents</span>
              <Droplets className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-200 mt-2 group-hover:scale-105 transition-transform">
              2
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Fuites d’eau signalées</p>
            <div className="text-[10px] text-purple-400 font-semibold mt-2 flex items-center gap-1">
              <span>Bloc A2 & B1</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>

          {/* Card 5: Overdue Tasks */}
          <button
            onClick={() => onNavigate('staff')}
            className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 hover:border-blue-500/60 text-left transition hover:shadow-lg hover:shadow-blue-500/10 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-400">Tâches</span>
              <Clock className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-200 mt-2 group-hover:scale-105 transition-transform">
              1
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Éclairage entrée cité</p>
            <div className="text-[10px] text-blue-400 font-semibold mt-2 flex items-center gap-1">
              <span>Assigné à Karim</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>

          {/* Card 6: SEAAL Bill Due */}
          <button
            onClick={() => onNavigate('finances')}
            className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-500/60 text-left transition hover:shadow-lg hover:shadow-cyan-500/10 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-400">Échéance</span>
              <FileText className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-200 mt-2 group-hover:scale-105 transition-transform">
              15 Mars
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Facture SEAAL</p>
            <div className="text-[10px] text-cyan-400 font-semibold mt-2 flex items-center gap-1">
              <span>32 000 DZD</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </button>
        </div>
      </div>

      {/* 3. FINANCIAL COLLECTION & EXPENSE METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Status */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Recouvrement des Charges (Mars 2026)</h3>
            <span className="text-xs font-black text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              75.0%
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total Attendu :</span>
              <span className="font-bold text-white">960 000 DZD</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Encaissé ce mois :</span>
              <span className="font-bold text-emerald-400">720 000 DZD</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Restant à Recouvrer :</span>
              <span className="font-bold text-rose-400">240 000 DZD</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-3 mt-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: '75%' }}
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Dette cumulée historique :</span>
            <span className="font-mono font-bold text-rose-400 text-xs">72 000 DZD</span>
          </div>
        </div>

        {/* Expenses & Cash Outflow */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Dépenses Opérationnelles</h3>
            <span className="text-xs font-bold text-purple-400 px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
              77 500 DZD
            </span>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Ascenseurs (Maintenance SARL)</span>
              <span className="font-bold text-slate-200">35 000 DZD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Plomberie & Réparation Pompes</span>
              <span className="font-bold text-slate-200">28 000 DZD</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Fournitures d’Entretien</span>
              <span className="font-bold text-slate-200">14 500 DZD</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Solde de Trésorerie Actuel :</span>
            <span className="text-sm font-black text-emerald-400 font-mono">642 500 DZD</span>
          </div>
        </div>

        {/* Equipment & Physical Infrastructure Health */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Disponibilité Équipements</h3>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>88% Conforme</span>
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Ascenseurs Opérationnels</span>
                <span className="font-bold text-white">3 / 4 (75%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Surpresseurs & Pompes d’Eau</span>
                <span className="font-bold text-emerald-400">2 / 2 (100%)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Groupe Électrogène de Secours</span>
                <span className="font-bold text-emerald-400">Opérationnel</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PERFORMANCE DES BÂTIMENTS (Section 5 Requirement) */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-400" />
              <span>État des Bâtiments — Cité 1500 Logements</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparatif du taux de recouvrement, impayés et état des ascenseurs par bloc
            </p>
          </div>
          <button
            onClick={() => onNavigate('residences')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
          >
            <span>Gérer les Bâtiments</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="pb-3">Bâtiment</th>
                <th className="pb-3">Appartements</th>
                <th className="pb-3">Occupation</th>
                <th className="pb-3">Taux Recouvrement</th>
                <th className="pb-3">Montant Impayé</th>
                <th className="pb-3">Ascenseur</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {buildings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>{b.name}</span>
                  </td>
                  <td className="py-3 text-slate-300">{b.apartmentsCount} logts ({b.floorsCount} étages)</td>
                  <td className="py-3">
                    <span className="font-semibold text-slate-200">
                      {b.occupiedApartments} occupés
                    </span>{' '}
                    <span className="text-[10px] text-slate-500">
                      ({Math.round((b.occupiedApartments / b.apartmentsCount) * 100)}%)
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          b.collectionRate >= 85
                            ? 'text-emerald-400'
                            : b.collectionRate >= 70
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {b.collectionRate}%
                      </span>
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            b.collectionRate >= 85
                              ? 'bg-emerald-500'
                              : b.collectionRate >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${b.collectionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-mono font-bold text-rose-400">
                    {b.unpaidAmount > 0 ? `${b.unpaidAmount.toLocaleString()} DZD` : '0 DZD'}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                        b.elevatorStatus === 'OPERATIONAL'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : b.elevatorStatus === 'DEGRADED'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {b.elevatorStatus === 'OPERATIONAL'
                        ? 'En Service'
                        : b.elevatorStatus === 'DEGRADED'
                        ? 'Bruit suspect'
                        : 'Hors Service'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onNavigate('residences')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px] font-semibold"
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
