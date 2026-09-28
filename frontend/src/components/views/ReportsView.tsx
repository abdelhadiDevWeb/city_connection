import React from 'react';
import { BarChart3, FileSpreadsheet, FileText, DollarSign } from 'lucide-react';

export const ReportsView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-950 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-zinc-800" />
            <span>Rapports & États Comptables</span>
          </h1>
          <p className="text-xs text-stone-500">
            Exportations PDF et Excel pour les bilans de copropriété, états des impayés et dépenses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report 1: Bilan Financier Mensuel */}
        <div className="p-6 rounded-2xl pro-card flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-stone-100 border border-stone-200 text-zinc-900 flex items-center justify-center mb-3">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Bilan Financier Mensuel</h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Synthèse complète des encaissements de charges, impayés du mois et dépenses par catégorie.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button className="flex-1 py-2 rounded-xl pro-button-secondary text-xs font-semibold transition flex items-center justify-center gap-1.5">
              <FileText className="h-4 w-4 text-stone-700" />
              <span>PDF</span>
            </button>
            <button className="flex-1 py-2 rounded-xl pro-button-secondary text-xs font-semibold transition flex items-center justify-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-stone-700" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Report 2: État Détaillé des Créances & Impayés */}
        <div className="p-6 rounded-2xl pro-card flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-stone-100 border border-stone-200 text-zinc-900 flex items-center justify-center mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">État des Impayés par Bâtiment</h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Liste nominative des résidents débiteurs avec nombre de mois de retard et historique des relances.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button className="flex-1 py-2 rounded-xl pro-button-secondary text-xs font-semibold transition flex items-center justify-center gap-1.5">
              <FileText className="h-4 w-4 text-stone-700" />
              <span>PDF</span>
            </button>
            <button className="flex-1 py-2 rounded-xl pro-button-secondary text-xs font-semibold transition flex items-center justify-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-stone-700" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Report 3: Registre Technique de Maintenance */}
        <div className="p-6 rounded-2xl pro-card flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-stone-100 border border-stone-200 text-zinc-900 flex items-center justify-center mb-3">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Registre Technique & Pannes</h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Journal des interventions d'ascenseurs, réparations de plomberie et facturation des prestataires.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button className="flex-1 py-2 rounded-xl pro-button-secondary text-xs font-semibold transition flex items-center justify-center gap-1.5">
              <FileText className="h-4 w-4 text-stone-700" />
              <span>PDF</span>
            </button>
            <button className="flex-1 py-2 rounded-xl pro-button-secondary text-xs font-semibold transition flex items-center justify-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-stone-700" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
