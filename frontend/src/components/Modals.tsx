import React, { useState } from 'react';
import { X, DollarSign, AlertTriangle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-stone-100 border border-stone-200 text-zinc-900 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Encaisser un Paiement</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-zinc-900 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Sélectionner le Logement</label>
            <select
              value={apartmentId}
              onChange={(e) => setApartmentId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
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
              <label className="block text-stone-700 font-semibold mb-1">Montant (DZD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-950 font-mono font-bold outline-none focus:border-zinc-900 focus:bg-white transition"
                required
              />
            </div>
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Période Réglée</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Mode de Règlement</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
            >
              <option value="EDAHABIA">Carte Edahabia (Poste)</option>
              <option value="CIB">Carte Bancaire CIB</option>
              <option value="CCP">Virement CCP / BaridiMob</option>
              <option value="CASH">Espèces / Cash au Bureau</option>
              <option value="CHEQUE">Chèque</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Référence / Reçu</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: BaridiMob 094812 ou Reçu N°"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 placeholder:text-stone-400 outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="pro-button-secondary px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="pro-button-primary px-5 py-2 rounded-xl text-xs font-semibold transition"
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-stone-100 border border-stone-200 text-zinc-900 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">Déclarer un Incident / Panne</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-zinc-900 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Intitulé du Problème</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fuite d’eau sous-sol ou Ascenseur en panne"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 placeholder:text-stone-400 outline-none focus:border-zinc-900 focus:bg-white transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Localisation</label>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              >
                {buildings.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Gravité / Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              >
                <option value="CRITICAL">Critique (Urgent)</option>
                <option value="HIGH">Haute Priorité</option>
                <option value="NORMAL">Normale</option>
                <option value="LOW">Faible</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Catégorie Technique</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
            >
              <option value="Plomberie">Plomberie & Fuites d’eau</option>
              <option value="Ascenseur">Ascenseur & Cabine</option>
              <option value="Électricité">Électricité & Éclairage</option>
              <option value="Surpresseur">Pompe & Surpresseur</option>
              <option value="Sécurité">Sécurité & Portail</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Description Détaillée</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Précisez la nature de la panne pour le technicien..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-zinc-900 placeholder:text-stone-400 outline-none focus:border-zinc-900 focus:bg-white transition resize-none"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="pro-button-secondary px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="pro-button-primary px-5 py-2 rounded-xl text-xs font-semibold transition"
            >
              Transmettre au Technicien
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. Add Building Manager Modal (Residence Manager role only)
// -------------------------------------------------------------
interface AddBuildingManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (manager: any) => void;
  buildings: any[];
}

export const AddBuildingManagerModal: React.FC<AddBuildingManagerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  buildings,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedBuildingId, setAssignedBuildingId] = useState(buildings[0]?.id || 'b-1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedBuilding = buildings.find((b) => b.id === assignedBuildingId) || buildings[0];
    onSuccess({
      fullName,
      email,
      phone,
      assignedBuildingId,
      assignedBuildingName: assignedBuilding?.name || 'Bâtiment A1',
      managedApartmentsCount: assignedBuilding?.apartmentsCount || 36,
      managedResidentsCount: assignedBuilding?.occupiedApartments || 34,
      assignedAt: 'Mars 2026',
      status: 'ACTIVE',
    });
    setFullName('');
    setEmail('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-semibold text-stone-700 mb-1">
              <span>Rôle : Gestionnaire de Résidence</span>
            </div>
            <h3 className="text-base font-bold text-zinc-950">Nommer un Gestionnaire de Bâtiment</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-zinc-900 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Nom et Prénom du Gestionnaire</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Farid Bouzid"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 placeholder:text-stone-400 outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Numéro de Téléphone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0550 12 34 56"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 placeholder:text-stone-400 font-mono outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Email Professionnel</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="f.bouzid@citeconnect.dz"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 placeholder:text-stone-400 outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Bâtiment / Bloc Affecté</label>
            <select
              value={assignedBuildingId}
              onChange={(e) => setAssignedBuildingId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.apartmentsCount} logements)
                </option>
              ))}
            </select>
            <p className="text-[10px] text-stone-500 mt-1">
              Ce gestionnaire sera responsable de l’ajout et du suivi des résidents de ce bâtiment.
            </p>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="pro-button-secondary px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="pro-button-primary px-5 py-2 rounded-xl text-xs font-semibold transition"
            >
              Affecter le Gestionnaire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. Add Building (Batiment) Modal (Residence Manager role only)
// -------------------------------------------------------------
interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (building: any) => void;
}

export const AddBuildingModal: React.FC<AddBuildingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [floorsCount, setFloorsCount] = useState('9');
  const [apartmentsCount, setApartmentsCount] = useState('36');
  const [elevatorStatus, setElevatorStatus] = useState('OPERATIONAL');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      id: `b-${Date.now()}`,
      residenceId: 'res-1',
      name: name || 'Nouveau Bâtiment',
      floorsCount: Number(floorsCount),
      apartmentsCount: Number(apartmentsCount),
      occupiedApartments: 0,
      collectionRate: 100,
      unpaidAmount: 0,
      openIssuesCount: 0,
      elevatorStatus,
    });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-semibold text-stone-700 mb-1">
              <span>Rôle : Gestionnaire de Résidence</span>
            </div>
            <h3 className="text-base font-bold text-zinc-950">Ajouter un Nouveau Bâtiment</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-zinc-900 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Nom / Référence du Bâtiment</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Bâtiment C1 ou Bloc D"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 placeholder:text-stone-400 outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Nombre d'Étages</label>
              <input
                type="number"
                required
                value={floorsCount}
                onChange={(e) => setFloorsCount(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Total Appartements</label>
              <input
                type="number"
                required
                value={apartmentsCount}
                onChange={(e) => setApartmentsCount(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">État de l'Ascenseur</label>
            <select
              value={elevatorStatus}
              onChange={(e) => setElevatorStatus(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
            >
              <option value="OPERATIONAL">En Service (Opérationnel)</option>
              <option value="DEGRADED">En Maintenance / Bruit suspect</option>
              <option value="OUT_OF_SERVICE">Hors Service</option>
            </select>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="pro-button-secondary px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="pro-button-primary px-5 py-2 rounded-xl text-xs font-semibold transition"
            >
              Créer le Bâtiment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. Add Resident Modal (Building Manager role)
// -------------------------------------------------------------
interface AddResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (resident: any) => void;
  buildings: any[];
  defaultBuildingId?: string;
}

export const AddResidentModal: React.FC<AddResidentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  buildings,
  defaultBuildingId,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [buildingId, setBuildingId] = useState(defaultBuildingId || buildings[0]?.id || 'b-1');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [floor, setFloor] = useState('1');
  const [type, setType] = useState('F3');
  const [occupantType, setOccupantType] = useState<'OWNER' | 'TENANT'>('OWNER');
  const [monthlyCharge, setMonthlyCharge] = useState('2000');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selBuilding = buildings.find((b) => b.id === buildingId) || buildings[0];
    onSuccess({
      fullName,
      phone,
      email,
      buildingId,
      buildingName: selBuilding?.name || 'Bâtiment A1',
      number: apartmentNumber || 'Apt 01',
      floor: Number(floor),
      type,
      occupantType,
      monthlyCharge: Number(monthlyCharge),
      balance: 0,
      status: 'UP_TO_DATE',
      joinedDate: 'Mars 2026',
    });
    setFullName('');
    setPhone('');
    setEmail('');
    setApartmentNumber('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-semibold text-stone-700 mb-1">
              <span>Rôle : Gestionnaire de Bâtiment</span>
            </div>
            <h3 className="text-base font-bold text-zinc-950">Inscrire un Nouveau Résident</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-zinc-900 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Nom et Prénom de l'Occupant</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Walid Cherifi"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 placeholder:text-stone-400 outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Téléphone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0554 11 22 33"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 placeholder:text-stone-400 font-mono outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Statut d'Occupation</label>
              <select
                value={occupantType}
                onChange={(e) => setOccupantType(e.target.value as 'OWNER' | 'TENANT')}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition"
              >
                <option value="OWNER">Copropriétaire</option>
                <option value="TENANT">Locataire</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="w.cherifi@gmail.com"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-900 placeholder:text-stone-400 outline-none focus:border-zinc-900 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Bâtiment</label>
              <select
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition text-xs"
              >
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-stone-700 font-semibold mb-1">N° Logement</label>
              <input
                type="text"
                required
                value={apartmentNumber}
                onChange={(e) => setApartmentNumber(e.target.value)}
                placeholder="Apt 15"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-zinc-900 placeholder:text-stone-400 outline-none focus:border-zinc-900 focus:bg-white transition text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Étage & Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-2 text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition text-xs"
              >
                <option value="F3">F3</option>
                <option value="F4">F4</option>
                <option value="F5">F5</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-semibold mb-1">Charge Mensuelle (DZD)</label>
            <input
              type="number"
              value={monthlyCharge}
              onChange={(e) => setMonthlyCharge(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-zinc-950 font-mono font-bold outline-none focus:border-zinc-900 focus:bg-white transition"
              required
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="pro-button-secondary px-4 py-2 rounded-xl text-xs font-semibold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="pro-button-primary px-5 py-2 rounded-xl text-xs font-semibold transition"
            >
              Enregistrer le Résident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

