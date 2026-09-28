import React, { useState } from 'react';
import { X, CheckCircle2, DollarSign, AlertTriangle, UserPlus, Building, Upload } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (payment: any) => void;
  apartments: any[];
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  apartments,
}) => {
  const [apartmentId, setApartmentId] = useState(apartments[0]?.id || '');
  const [amount, setAmount] = useState('2000');
  const [period, setPeriod] = useState('Mars 2026');
  const [method, setMethod] = useState('EDAHABIA');
  const [reference, setReference] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apt = apartments.find((a) => a.id === apartmentId) || apartments[0];
    onSuccess({
      apartment: apt.number,
      resident: apt.occupantName,
      amount: Number(amount),
      period,
      method,
      reference: reference || 'MANUAL-LOG',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">Encaisser un Paiement</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Sélectionner le Logement</label>
            <select
              value={apartmentId}
              onChange={(e) => setApartmentId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none"
            >
              {apartments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.buildingName} - Apt {a.number} ({a.occupantName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Montant (DZD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Période Réglée</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mode de Règlement</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none"
            >
              <option value="EDAHABIA">Carte Edahabia (Poste)</option>
              <option value="CIB">Carte Bancaire CIB</option>
              <option value="CCP">Virement CCP / BaridiMob</option>
              <option value="CASH">Espèces / Cash au Bureau</option>
              <option value="CHEQUE">Chèque</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Référence / Reçu</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: BaridiMob 094812 ou Reçu N°"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20"
            >
              Valider & Générer Reçu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (incident: any) => void;
  buildings: any[];
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  buildings,
}) => {
  const [title, setTitle] = useState('');
  const [building, setBuilding] = useState(buildings[0]?.name || 'Bâtiment A1');
  const [type, setType] = useState('Plomberie');
  const [priority, setPriority] = useState('HIGH');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      title,
      building,
      type,
      priority,
      description,
      reporter: 'Administrateur',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">Déclarer un Incident / Panne</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Intitulé du Problème</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fuite d’eau sous-sol ou Ascenseur en panne"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Localisation</label>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none"
              >
                {buildings.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Gravité / Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none"
              >
                <option value="CRITICAL">Critique (Urgent)</option>
                <option value="HIGH">Haute Priorité</option>
                <option value="NORMAL">Normale</option>
                <option value="LOW">Faible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Catégorie Technique</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none"
            >
              <option value="Plomberie">Plomberie & Fuites d’eau</option>
              <option value="Ascenseur">Ascenseur & Cabine</option>
              <option value="Électricité">Électricité & Éclairage</option>
              <option value="Surpresseur">Pompe & Surpresseur</option>
              <option value="Sécurité">Sécurité & Portail</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description Détaillée</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Précisez la nature de la panne pour le technicien..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/20"
            >
              Transmettre au Technicien
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
