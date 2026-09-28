import React, { useState } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingDown,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  ArrowDownRight,
  PhoneCall,
  Search,
  Download,
  Calendar,
} from 'lucide-react';

interface FinancesViewProps {
  payments: any[];
  unpaidDebts: any[];
  expenses: any[];
  bills: any[];
  onOpenPaymentModal: () => void;
  onGenerateMonthlyCharges: () => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  payments,
  unpaidDebts,
  expenses,
  bills,
  onOpenPaymentModal,
  onGenerateMonthlyCharges,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'payments' | 'unpaid' | 'expenses' | 'bills' | 'charges'>(
    'unpaid'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-400" />
            <span>Gestion Financière & Recouvrement</span>
          </h1>
          <p className="text-xs text-slate-400">
            Suivi des charges communes, encaissements Edahabia/CCP, impayés et dépenses de la résidence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateMonthlyCharges}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-blue-400" />
            <span>Générer Charges Mars</span>
          </button>

          <button
            onClick={onOpenPaymentModal}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Enregistrer Paiement</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('unpaid')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeSubTab === 'unpaid'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Impayés & Recouvrement ({unpaidDebts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payments')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeSubTab === 'payments'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>Journal des Paiements ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('expenses')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeSubTab === 'expenses'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingDown className="h-4 w-4" />
          <span>Dépenses Résidence ({expenses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bills')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
            activeSubTab === 'bills'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Factures Services & Sonelgaz ({bills.length})</span>
        </button>
      </div>

      {/* 1. IMPAYÉS (RECOUVREMENT) */}
      {activeSubTab === 'unpaid' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
              <div>
                <p className="text-xs font-bold text-rose-200">
                  {unpaidDebts.length} Logements présentent des retards de paiement
                </p>
                <p className="text-[11px] text-slate-400">
                  Les impayés sont calculés automatiquement en fonction des charges non acquittées.
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Créances</p>
              <p className="text-base font-black text-rose-400 font-mono">
                {unpaidDebts.reduce((sum, d) => sum + d.totalDebt, 0).toLocaleString()} DZD
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                  <th className="py-3 px-4">Logement & Bâtiment</th>
                  <th className="py-3 px-4">Résident</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Mois Impayés</th>
                  <th className="py-3 px-4">Dernier Règlement</th>
                  <th className="py-3 px-4">Total Dû</th>
                  <th className="py-3 px-4 text-right">Action Rapide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {unpaidDebts.map((debt) => (
                  <tr key={debt.apartmentId} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      <span>{debt.apartmentNumber}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{debt.residentName}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono">{debt.phone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          debt.severity === 'CRITICAL'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {debt.unpaidMonths} Mois de retard
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{debt.lastPayment}</td>
                    <td className="py-3 px-4 font-mono font-black text-rose-400 text-sm">
                      {debt.totalDebt.toLocaleString()} DZD
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={onOpenPaymentModal}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold transition mr-2"
                      >
                        Encaisser
                      </button>
                      <a
                        href={`tel:${debt.phone}`}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition inline-flex items-center gap-1"
                      >
                        <PhoneCall className="h-3 w-3" />
                        <span>Rappeler</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. JOURNAL DES PAIEMENTS */}
      {activeSubTab === 'payments' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                <th className="py-3 px-4">N° Reçu</th>
                <th className="py-3 px-4">Logement</th>
                <th className="py-3 px-4">Résident</th>
                <th className="py-3 px-4">Période Réglée</th>
                <th className="py-3 px-4">Mode Règlement</th>
                <th className="py-3 px-4">Date & Réf</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4 text-right">Justificatif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">{p.receiptNumber}</td>
                  <td className="py-3 px-4 font-bold text-white">{p.apartment}</td>
                  <td className="py-3 px-4 text-slate-300 font-semibold">{p.resident}</td>
                  <td className="py-3 px-4 text-slate-400">{p.period}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-800 text-slate-200 border border-slate-700">
                      {p.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {p.date} • <span className="font-mono text-slate-500">{p.reference}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-black text-emerald-400 text-sm">
                    {p.amount.toLocaleString()} DZD
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-[11px] font-bold text-slate-400 hover:text-white transition flex items-center gap-1 ml-auto">
                      <Download className="h-3 w-3" />
                      <span>Reçu PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. DÉPENSES OPÉRATIONNELLES */}
      {activeSubTab === 'expenses' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/40">
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4">Fournisseur / Prestataire</th>
                <th className="py-3 px-4">Affectation</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-bold text-white">{e.category}</td>
                  <td className="py-3 px-4 font-semibold text-slate-300">{e.supplier}</td>
                  <td className="py-3 px-4 text-slate-400">{e.building}</td>
                  <td className="py-3 px-4 text-slate-400">{e.date}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">{e.method}</td>
                  <td className="py-3 px-4 font-mono font-bold text-purple-400 text-sm">
                    {e.amount.toLocaleString()} DZD
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Acquitté
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. FACTURES DE SERVICES & SONELGAZ */}
      {activeSubTab === 'bills' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {bill.provider}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      bill.status === 'OVERDUE'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {bill.status === 'OVERDUE' ? 'En Retard' : 'Non Payée'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">{bill.serviceType}</h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{bill.reference}</p>

                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Période :</span>
                    <span className="font-semibold text-slate-200">{bill.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Échéance :</span>
                    <span className="font-bold text-amber-400">{bill.dueDate}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Montant Facture :</span>
                    <span className="font-mono font-black text-white text-sm">
                      {bill.amount.toLocaleString()} DZD
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition">
                  Marquer comme Payée
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
