import React, { useState } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingDown,
  FileText,
  AlertTriangle,
  Plus,
  PhoneCall,
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
  const [activeSubTab, setActiveSubTab] = useState<'payments' | 'unpaid' | 'expenses' | 'bills'>(
    'unpaid'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-zinc-800" />
            <span>Gestion Financière & Recouvrement</span>
          </h1>
          <p className="text-xs text-stone-500">
            Suivi des charges communes, encaissements Edahabia/CCP, impayés et dépenses de la résidence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateMonthlyCharges}
            className="pro-button-secondary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-zinc-700" />
            <span>Générer Charges Mars</span>
          </button>

          <button
            onClick={onOpenPaymentModal}
            className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Enregistrer Paiement</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('unpaid')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition shrink-0 ${
            activeSubTab === 'unpaid'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Impayés & Recouvrement ({unpaidDebts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payments')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition shrink-0 ${
            activeSubTab === 'payments'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>Journal des Paiements ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('expenses')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition shrink-0 ${
            activeSubTab === 'expenses'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
          }`}
        >
          <TrendingDown className="h-4 w-4" />
          <span>Dépenses Résidence ({expenses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bills')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition shrink-0 ${
            activeSubTab === 'bills'
              ? 'bg-zinc-950 text-white font-semibold shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Factures Services & Sonelgaz ({bills.length})</span>
        </button>
      </div>

      {/* 1. IMPAYÉS (RECOUVREMENT) */}
      {activeSubTab === 'unpaid' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl pro-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-stone-100 border border-stone-200">
                <AlertTriangle className="h-4 w-4 text-zinc-900" />
              </span>
              <div>
                <p className="text-xs font-bold text-zinc-950">
                  {unpaidDebts.length} Logements présentent des retards de paiement
                </p>
                <p className="text-[11px] text-stone-500">
                  Les impayés sont calculés automatiquement en fonction des charges non acquittées.
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-stone-500 font-semibold uppercase">Total Créances</p>
              <p className="text-base font-bold text-zinc-950 font-mono">
                {unpaidDebts.reduce((sum, d) => sum + d.totalDebt, 0).toLocaleString()} DZD
              </p>
            </div>
          </div>

          <div className="rounded-2xl pro-card overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[11px] bg-stone-50/60">
                  <th className="py-2.5 px-4">Logement & Bâtiment</th>
                  <th className="py-2.5 px-4">Résident</th>
                  <th className="py-2.5 px-4">Contact</th>
                  <th className="py-2.5 px-4">Mois Impayés</th>
                  <th className="py-2.5 px-4">Dernier Règlement</th>
                  <th className="py-2.5 px-4">Total Dû</th>
                  <th className="py-2.5 px-4 text-right">Action Rapide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {unpaidDebts.map((debt) => (
                  <tr key={debt.apartmentId} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4 font-semibold text-zinc-950 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                      <span>{debt.apartmentNumber}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-900">{debt.residentName}</td>
                    <td className="py-3 px-4 text-stone-500 font-mono">{debt.phone}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
                        {debt.unpaidMonths} Mois de retard
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500">{debt.lastPayment}</td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-950 text-sm">
                      {debt.totalDebt.toLocaleString()} DZD
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={onOpenPaymentModal}
                        className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] font-semibold transition mr-2"
                      >
                        Encaisser
                      </button>
                      <a
                        href={`tel:${debt.phone}`}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-zinc-800 text-[11px] font-medium transition inline-flex items-center gap-1 border border-stone-200"
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
        <div className="rounded-2xl pro-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[11px] bg-stone-50/60">
                <th className="py-2.5 px-4">N° Reçu</th>
                <th className="py-2.5 px-4">Logement</th>
                <th className="py-2.5 px-4">Résident</th>
                <th className="py-2.5 px-4">Période Réglée</th>
                <th className="py-2.5 px-4">Mode Règlement</th>
                <th className="py-2.5 px-4">Date & Réf</th>
                <th className="py-2.5 px-4">Montant</th>
                <th className="py-2.5 px-4 text-right">Justificatif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/80 transition">
                  <td className="py-3 px-4 font-mono font-semibold text-zinc-900">{p.receiptNumber}</td>
                  <td className="py-3 px-4 font-semibold text-zinc-950">{p.apartment}</td>
                  <td className="py-3 px-4 text-stone-700 font-medium">{p.resident}</td>
                  <td className="py-3 px-4 text-stone-500">{p.period}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-stone-100 text-stone-800 border border-stone-200">
                      {p.method}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-500 text-[11px]">
                    {p.date} • <span className="font-mono text-stone-400">{p.reference}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-950 text-sm">
                    {p.amount.toLocaleString()} DZD
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-[11px] font-semibold text-zinc-700 hover:text-black transition flex items-center gap-1 ml-auto">
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
        <div className="rounded-2xl pro-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[11px] bg-stone-50/60">
                <th className="py-2.5 px-4">Catégorie</th>
                <th className="py-2.5 px-4">Fournisseur / Prestataire</th>
                <th className="py-2.5 px-4">Affectation</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Mode</th>
                <th className="py-2.5 px-4">Montant</th>
                <th className="py-2.5 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-stone-50/80 transition">
                  <td className="py-3 px-4 font-semibold text-zinc-950">{e.category}</td>
                  <td className="py-3 px-4 font-medium text-stone-700">{e.supplier}</td>
                  <td className="py-3 px-4 text-stone-500">{e.building}</td>
                  <td className="py-3 px-4 text-stone-500">{e.date}</td>
                  <td className="py-3 px-4 text-stone-500 font-mono text-[10px]">{e.method}</td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-950 text-sm">
                    {e.amount.toLocaleString()} DZD
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-stone-100 text-stone-800 border border-stone-200">
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
              className="p-5 rounded-2xl pro-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                    {bill.provider}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-medium border bg-stone-100 text-stone-800 border-stone-200">
                    {bill.status === 'OVERDUE' ? 'En Retard' : 'Non Payée'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-950 mt-2">{bill.serviceType}</h3>
                <p className="text-[11px] text-stone-400 font-mono mt-0.5">{bill.reference}</p>

                <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Période :</span>
                    <span className="font-medium text-zinc-900">{bill.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Échéance :</span>
                    <span className="font-semibold text-zinc-900">{bill.dueDate}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-stone-200">
                    <span className="text-stone-500">Montant Facture :</span>
                    <span className="font-mono font-bold text-zinc-950 text-sm">
                      {bill.amount.toLocaleString()} DZD
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex justify-end">
                <button className="pro-button-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold transition">
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
