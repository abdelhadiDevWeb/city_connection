import React from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, Calendar, Filter, DollarSign } from 'lucide-react';

export const ReportsView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            <span>Rapports & États Comptables</span>
          </h1>
          <p className="text-xs text-slate-400">
            Exportations PDF et Excel pour les bilans de copropriété, états des impayés et dépenses
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report 1: Bilan Financier Mensuel */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg">
          <div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Bilan Financier Mensuel</h3>
            <p className="text-xs text-slate-400 mt-1">
              Synthèse complète des encaissements de charges, impayés du mois et dépenses par catégorie.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-1.5">
              <FileText className="h-4 w-4 text-red-400" />
              <span>PDF</span>
            </button>
            <button className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Report 2: État Détaillé des Créances & Impayés */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg">
          <div>
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">État des Impayés par Bâtiment</h3>
            <p className="text-xs text-slate-400 mt-1">
              Liste nominative des résidents débiteurs avec nombre de mois de retard et historique des relances.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-1.5">
              <FileText className="h-4 w-4 text-red-400" />
              <span>PDF</span>
            </button>
            <button className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Report 3: Registre Technique de Maintenance */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg">
          <div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Registre Technique & Pannes</h3>
            <p className="text-xs text-slate-400 mt-1">
              Journal des interventions d'ascenseurs, réparations de plomberie et facturation des prestataires.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <button className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-1.5">
              <FileText className="h-4 w-4 text-red-400" />
              <span>PDF</span>
            </button>
            <button className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center justify-center gap-1.5">
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
