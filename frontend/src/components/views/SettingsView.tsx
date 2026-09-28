import React, { useState } from 'react';
import { Sliders, Plus, Check, Settings2, Trash2, Edit2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('PAYMENT_METHOD');

  const groups = [
    { id: 'PAYMENT_METHOD', label: 'Modes de Règlement (Paiements)' },
    { id: 'RESIDENCE_TYPE', label: 'Types de Résidences (AADL, LPA...)' },
    { id: 'CHARGE_TYPE', label: 'Types de Charges Communes' },
    { id: 'EXPENSE_CATEGORY', label: 'Catégories de Dépenses' },
    { id: 'INCIDENT_TYPE', label: 'Types d’Incidents & Pannes' },
    { id: 'STAFF_FUNCTION', label: 'Fonctions du Personnel' },
  ];

  const mockCategories: Record<string, string[]> = {
    PAYMENT_METHOD: [
      'Espèces / Cash au Bureau',
      'Virement CCP / BaridiMob',
      'Carte Edahabia',
      'Carte CIB',
      'Chèque Bancaire',
      'Virement Bancaire BNA/BEA',
    ],
    RESIDENCE_TYPE: ['AADL (Location-Vente)', 'LPA (Promotionnel Aidé)', 'LPP', 'Copropriété Privée'],
    CHARGE_TYPE: [
      'Charges Communes Générales',
      'Entretien & Nettoyage',
      'Gardiennage & Sécurité',
      'Maintenance Ascenseurs',
      'Éclairage Parties Communes',
      'Fonds de Réserve Travaux',
    ],
    EXPENSE_CATEGORY: [
      'Ascenseurs (Maintenance & Pièces)',
      'Électricité & Éclairage',
      'Plomberie & Réparation Pompes',
      'Produits de Nettoyage',
      'Jardinage & Espaces Verts',
      'Honoraires Syndic',
    ],
    INCIDENT_TYPE: [
      'Fuite d’eau colonne montante',
      'Panne Ascenseur',
      'Coupure Surpresseur d’eau',
      'Panne Éclairage Palier',
      'Dégradation Parties Communes',
      'Problème Déchets',
    ],
    STAFF_FUNCTION: [
      'Concierge / Gardien Principal',
      'Agent d’Entretien & Nettoyage',
      'Électricien Dépanneur',
      'Plombier de la Cité',
      'Agent de Sécurité',
    ],
  };

  const currentItems = mockCategories[selectedGroup] || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Sliders className="h-5 w-5 text-blue-400" />
            <span>Paramètres Dynamiques & Nomenclatures</span>
          </h1>
          <p className="text-xs text-slate-400">
            Conformité Section 21 : Aucune liste n'est figée en dur dans le code. Personnalisez vos catégories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Category Selector */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase px-3 pb-2">Nomenclatures</p>
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                selectedGroup === g.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Right: Items List */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">
              Éléments configurés ({currentItems.length})
            </h3>
            <button className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Ajouter une Valeur</span>
            </button>
          </div>

          <div className="space-y-2">
            {currentItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-200">{item}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-7 w-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
