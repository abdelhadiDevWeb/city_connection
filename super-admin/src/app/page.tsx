'use client';

import React, { useState } from 'react';
import {
  Building2,
  Building,
  Home,
  Layers,
  Users,
  UserCheck,
  UserPlus,
  Banknote,
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  Shield,
  Check,
  X,
  MapPin,
} from 'lucide-react';

interface BuildingItem {
  id: string;
  name: string;
  floorsCount: number;
  apartmentsCount: number;
  buildingManager?: {
    name: string;
    phone: string;
    email: string;
    apartment: string;
    status: 'ACTIVE' | 'PENDING';
  };
}

interface ResidenceItem {
  id: string;
  name: string;
  city: string;
  address: string;
  residenceManager: {
    name: string;
    phone: string;
    email: string;
    appointedDate: string;
    status: 'ACTIVE' | 'PENDING';
  };
  monthlyPlatformCashDue: number; // in DZD
  cashPaymentStatus: 'PAID' | 'PARTIAL' | 'OVERDUE';
  lastCashPaymentDate: string;
  buildings: BuildingItem[];
}

interface CashPaymentRecord {
  id: string;
  receiptNumber: string;
  residenceId: string;
  residenceName: string;
  payerType: 'RESIDENCE_MANAGER' | 'BUILDING_MANAGER' | 'RESIDENCE_TREASURY';
  payerName: string;
  payerRole: string;
  buildingName?: string;
  amount: number; // in DZD
  period: string; // e.g. "Mars 2026"
  paymentDate: string;
  receivedBy: string; // Super Admin agent
  status: 'COLLECTED_CASH' | 'PENDING_CASH';
  notes: string;
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'topology' | 'cash' | 'managers' | 'overview'>('topology');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResidenceFilter, setSelectedResidenceFilter] = useState<string>('ALL');
  const [cashStatusFilter, setCashStatusFilter] = useState<'ALL' | 'COLLECTED' | 'PENDING'>('ALL');
  const [expandedResidenceId, setExpandedResidenceId] = useState<string | null>('res_1');

  // Modals state
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isResidenceModalOpen, setIsResidenceModalOpen] = useState(false);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<CashPaymentRecord | null>(null);

  // New Cash Payment Form State
  const [newCashPayment, setNewCashPayment] = useState({
    residenceId: 'res_1',
    payerType: 'RESIDENCE_MANAGER' as 'RESIDENCE_MANAGER' | 'BUILDING_MANAGER' | 'RESIDENCE_TREASURY',
    payerName: 'Karim Benaissa',
    payerRole: 'Gestionnaire de Résidence',
    buildingName: '',
    amount: 45000,
    period: 'Mars 2026',
    receivedBy: 'Admin Principal (Caisse Centrale)',
    notes: 'Remis en main propre en coupures de 2000 DA au bureau d\'Alger',
    status: 'COLLECTED_CASH' as 'COLLECTED_CASH' | 'PENDING_CASH',
  });

  // Initial Mock Data: Residences with Buildings, Residence Managers, and Building Managers
  const [residences, setResidences] = useState<ResidenceItem[]>([
    {
      id: 'res_1',
      name: 'Résidence El Bahdja',
      city: 'Bab Ezzouar, Alger',
      address: 'Lotissement 14, Boulevard 5 Juillet, Bab Ezzouar',
      residenceManager: {
        name: 'M. Karim Benaissa',
        phone: '+213 550 12 34 56',
        email: 'karim.benaissa@elbahdja.dz',
        appointedDate: '2025-06-15',
        status: 'ACTIVE',
      },
      monthlyPlatformCashDue: 45000,
      cashPaymentStatus: 'PAID',
      lastCashPaymentDate: '2026-03-25',
      buildings: [
        {
          id: 'bld_1_1',
          name: 'Bâtiment A (Le Figuier)',
          floorsCount: 7,
          apartmentsCount: 28,
          buildingManager: {
            name: 'M. Omar Haddad',
            phone: '+213 661 22 33 44',
            email: 'omar.haddad@elbahdja.dz',
            apartment: 'Apt A-04, 1er Étage',
            status: 'ACTIVE',
          },
        },
        {
          id: 'bld_1_2',
          name: 'Bâtiment B (L\'Olivier)',
          floorsCount: 8,
          apartmentsCount: 32,
          buildingManager: {
            name: 'M. Samir Kaci',
            phone: '+213 552 44 55 66',
            email: 'samir.kaci@elbahdja.dz',
            apartment: 'Apt B-12, 3ème Étage',
            status: 'ACTIVE',
          },
        },
        {
          id: 'bld_1_3',
          name: 'Bâtiment C (Le Palmier)',
          floorsCount: 6,
          apartmentsCount: 24,
          buildingManager: {
            name: 'Mme. Nacera Saidi',
            phone: '+213 770 11 22 33',
            email: 'nacera.saidi@elbahdja.dz',
            apartment: 'Apt C-02, RDC',
            status: 'ACTIVE',
          },
        },
      ],
    },
    {
      id: 'res_2',
      name: 'Cité 1000 Logements',
      city: 'Bir El Djir, Oran',
      address: 'Route Nationale 11, Bir El Djir, Oran',
      residenceManager: {
        name: 'M. Ahmed Benali',
        phone: '+213 770 45 67 89',
        email: 'ahmed.benali@cite1000.dz',
        appointedDate: '2025-08-01',
        status: 'ACTIVE',
      },
      monthlyPlatformCashDue: 75000,
      cashPaymentStatus: 'PAID',
      lastCashPaymentDate: '2026-03-24',
      buildings: [
        {
          id: 'bld_2_1',
          name: 'Bâtiment 01',
          floorsCount: 10,
          apartmentsCount: 40,
          buildingManager: {
            name: 'M. Mourad Cherif',
            phone: '+213 662 99 88 77',
            email: 'm.cherif@cite1000.dz',
            apartment: 'Apt 01-08, 2ème Étage',
            status: 'ACTIVE',
          },
        },
        {
          id: 'bld_2_2',
          name: 'Bâtiment 02',
          floorsCount: 10,
          apartmentsCount: 40,
          buildingManager: {
            name: 'M. Yacine Touati',
            phone: '+213 551 88 77 66',
            email: 'yacine.touati@cite1000.dz',
            apartment: 'Apt 02-15, 4ème Étage',
            status: 'ACTIVE',
          },
        },
        {
          id: 'bld_2_3',
          name: 'Bâtiment 03',
          floorsCount: 10,
          apartmentsCount: 40,
          buildingManager: {
            name: 'M. Abdelkrim Belkacem',
            phone: '+213 778 33 22 11',
            email: 'a.belkacem@cite1000.dz',
            apartment: 'Apt 03-01, 1er Étage',
            status: 'ACTIVE',
          },
        },
        {
          id: 'bld_2_4',
          name: 'Bâtiment 04',
          floorsCount: 10,
          apartmentsCount: 40,
          buildingManager: {
            name: 'M. Mohamed Brahimi',
            phone: '+213 660 55 44 33',
            email: 'm.brahimi@cite1000.dz',
            apartment: 'Apt 04-20, 5ème Étage',
            status: 'ACTIVE',
          },
        },
      ],
    },
    {
      id: 'res_3',
      name: 'Résidence Les Pins',
      city: 'Hydra, Alger',
      address: 'Chemin Djenane El Malik, Hydra',
      residenceManager: {
        name: 'Mme. Amina Mansouri',
        phone: '+213 770 98 76 54',
        email: 'amina.mansouri@lespins-hydra.dz',
        appointedDate: '2025-10-10',
        status: 'ACTIVE',
      },
      monthlyPlatformCashDue: 55000,
      cashPaymentStatus: 'PARTIAL',
      lastCashPaymentDate: '2026-03-20',
      buildings: [
        {
          id: 'bld_3_1',
          name: 'Bâtiment A (Les Cèdres)',
          floorsCount: 4,
          apartmentsCount: 16,
          buildingManager: {
            name: 'M. Reda Ziani',
            phone: '+213 554 11 99 88',
            email: 'reda.ziani@lespins.dz',
            apartment: 'Apt A-01, RDC',
            status: 'ACTIVE',
          },
        },
        {
          id: 'bld_3_2',
          name: 'Bâtiment B (Les Pins d\'Alep)',
          floorsCount: 5,
          apartmentsCount: 20,
          buildingManager: {
            name: 'M. Fodil Messaoudi',
            phone: '+213 663 77 66 55',
            email: 'fodil.m@lespins.dz',
            apartment: 'Apt B-05, 1er Étage',
            status: 'ACTIVE',
          },
        },
      ],
    },
    {
      id: 'res_4',
      name: 'Cité Bellevue',
      city: 'Belouizdad, Alger',
      address: 'Rue Mohamed Belouizdad, Hamma',
      residenceManager: {
        name: 'M. Djamel Khodja',
        phone: '+213 558 77 44 11',
        email: 'djamel.khodja@bellevue-alger.dz',
        appointedDate: '2025-11-05',
        status: 'ACTIVE',
      },
      monthlyPlatformCashDue: 30000,
      cashPaymentStatus: 'PAID',
      lastCashPaymentDate: '2026-03-18',
      buildings: [
        {
          id: 'bld_4_1',
          name: 'Bâtiment A',
          floorsCount: 6,
          apartmentsCount: 18,
          buildingManager: {
            name: 'M. Bilal Yahia',
            phone: '+213 772 33 44 55',
            email: 'bilal.yahia@bellevue.dz',
            apartment: 'Apt A-03, 1er Étage',
            status: 'ACTIVE',
          },
        },
        {
          id: 'bld_4_2',
          name: 'Bâtiment B',
          floorsCount: 6,
          apartmentsCount: 18,
          buildingManager: {
            name: 'M. Tarek Rahmani',
            phone: '+213 665 11 22 33',
            email: 'tarek.r@bellevue.dz',
            apartment: 'Apt B-09, 3ème Étage',
            status: 'ACTIVE',
          },
        },
      ],
    },
    {
      id: 'res_5',
      name: 'Résidence Les Cerisiers',
      city: 'Ali Mendjeli, Constantine',
      address: 'UV 13, Nouvelle Ville Ali Mendjeli',
      residenceManager: {
        name: 'M. Mustapha Bouali',
        phone: '+213 661 88 44 22',
        email: 'm.bouali@cerisiers-cst.dz',
        appointedDate: '2026-01-10',
        status: 'ACTIVE',
      },
      monthlyPlatformCashDue: 40000,
      cashPaymentStatus: 'OVERDUE',
      lastCashPaymentDate: '2026-02-15',
      buildings: [
        {
          id: 'bld_5_1',
          name: 'Bâtiment Nord',
          floorsCount: 6,
          apartmentsCount: 24,
          buildingManager: {
            name: 'M. Hocine Meziane',
            phone: '+213 559 66 33 00',
            email: 'h.meziane@cerisiers.dz',
            apartment: 'Apt N-06, 2ème Étage',
            status: 'ACTIVE',
          },
        },
        {
          id: 'bld_5_2',
          name: 'Bâtiment Sud',
          floorsCount: 6,
          apartmentsCount: 24,
          buildingManager: {
            name: 'M. Farouk Chaoui',
            phone: '+213 773 22 11 99',
            email: 'farouk.c@cerisiers.dz',
            apartment: 'Apt S-11, 3ème Étage',
            status: 'ACTIVE',
          },
        },
      ],
    },
  ]);

  // Initial Mock Data: Manual Cash Payments Ledger
  const [cashPayments, setCashPayments] = useState<CashPaymentRecord[]>([
    {
      id: 'pay_1',
      receiptNumber: 'REC-ESP-2026-0042',
      residenceId: 'res_1',
      residenceName: 'Résidence El Bahdja',
      payerType: 'RESIDENCE_MANAGER',
      payerName: 'M. Karim Benaissa',
      payerRole: 'Gestionnaire de Résidence',
      amount: 45000,
      period: 'Mars 2026',
      paymentDate: '2026-03-25 10:30',
      receivedBy: 'Admin Principal (Caisse Centrale)',
      status: 'COLLECTED_CASH',
      notes: 'Remise manuelle au bureau en espèces (22 x 2000 DA + 1 x 1000 DA). Quittance signée.',
    },
    {
      id: 'pay_2',
      receiptNumber: 'REC-ESP-2026-0041',
      residenceId: 'res_2',
      residenceName: 'Cité 1000 Logements',
      payerType: 'RESIDENCE_MANAGER',
      payerName: 'M. Ahmed Benali',
      payerRole: 'Gestionnaire de Résidence',
      amount: 75000,
      period: 'Mars 2026',
      paymentDate: '2026-03-24 14:15',
      receivedBy: 'Admin Principal (Caisse Centrale)',
      status: 'COLLECTED_CASH',
      notes: 'Versement espèces complet pour les 4 bâtiments du site.',
    },
    {
      id: 'pay_3',
      receiptNumber: 'REC-ESP-2026-0040',
      residenceId: 'res_3',
      residenceName: 'Résidence Les Pins',
      payerType: 'BUILDING_MANAGER',
      payerName: 'M. Reda Ziani',
      payerRole: 'Responsable Bâtiment A',
      buildingName: 'Bâtiment A (Les Cèdres)',
      amount: 35000,
      period: 'Mars 2026 (Acompte)',
      paymentDate: '2026-03-20 11:00',
      receivedBy: 'Agent Caisse Alger',
      status: 'COLLECTED_CASH',
      notes: 'Acompte espèces pour le Bâtiment A. Reste 20,000 DA pour le Bâtiment B.',
    },
    {
      id: 'pay_4',
      receiptNumber: 'REC-ESP-2026-0039',
      residenceId: 'res_4',
      residenceName: 'Cité Bellevue',
      payerType: 'RESIDENCE_MANAGER',
      payerName: 'M. Djamel Khodja',
      payerRole: 'Gestionnaire de Résidence',
      amount: 30000,
      period: 'Mars 2026',
      paymentDate: '2026-03-18 16:45',
      receivedBy: 'Admin Principal (Caisse Centrale)',
      status: 'COLLECTED_CASH',
      notes: 'Paiement espèces en mains propres.',
    },
    {
      id: 'pay_5',
      receiptNumber: 'REC-ESP-2026-0043',
      residenceId: 'res_5',
      residenceName: 'Résidence Les Cerisiers',
      payerType: 'RESIDENCE_MANAGER',
      payerName: 'M. Mustapha Bouali',
      payerRole: 'Gestionnaire de Résidence',
      amount: 40000,
      period: 'Mars 2026',
      paymentDate: '2026-03-28 09:00',
      receivedBy: 'Non encore encaissé',
      status: 'PENDING_CASH',
      notes: 'Visite de l\'agent de collecte prévue pour réception physique des espèces à Constantine.',
    },
    {
      id: 'pay_6',
      receiptNumber: 'REC-ESP-2026-0038',
      residenceId: 'res_3',
      residenceName: 'Résidence Les Pins',
      payerType: 'RESIDENCE_MANAGER',
      payerName: 'Mme. Amina Mansouri',
      payerRole: 'Gestionnaire de Résidence',
      amount: 55000,
      period: 'Février 2026',
      paymentDate: '2026-02-28 12:00',
      receivedBy: 'Admin Principal (Caisse Centrale)',
      status: 'COLLECTED_CASH',
      notes: 'Règlement total du mois de Février en espèces.',
    },
  ]);

  // Aggregate stats
  const totalResidencesCount = residences.length;
  const totalBuildingsCount = residences.reduce((acc, r) => acc + r.buildings.length, 0);
  const totalApartmentsCount = residences.reduce(
    (acc, r) => acc + r.buildings.reduce((bAcc, b) => bAcc + b.apartmentsCount, 0),
    0
  );
  const totalResidenceManagersCount = residences.length;
  const totalBuildingManagersCount = residences.reduce(
    (acc, r) => acc + r.buildings.filter((b) => b.buildingManager).length,
    0
  );

  const totalCashCollected = cashPayments
    .filter((p) => p.status === 'COLLECTED_CASH')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCashPending = cashPayments
    .filter((p) => p.status === 'PENDING_CASH')
    .reduce((sum, p) => sum + p.amount, 0);

  // Filtered lists
  const filteredResidences = residences.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.residenceManager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.buildings.some(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.buildingManager?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  const filteredCashPayments = cashPayments.filter((p) => {
    const matchesRes = selectedResidenceFilter === 'ALL' || p.residenceId === selectedResidenceFilter;
    const matchesStatus =
      cashStatusFilter === 'ALL' ||
      (cashStatusFilter === 'COLLECTED' && p.status === 'COLLECTED_CASH') ||
      (cashStatusFilter === 'PENDING' && p.status === 'PENDING_CASH');
    const matchesSearch =
      p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.residenceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.period.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRes && matchesStatus && matchesSearch;
  });

  // Collect all managers for the Directory Tab
  const allManagersList = [
    ...residences.map((r) => ({
      id: `rm_${r.id}`,
      name: r.residenceManager.name,
      role: 'Gestionnaire de Résidence',
      type: 'RESIDENCE_MANAGER' as const,
      residenceName: r.name,
      buildingName: 'Site entier',
      phone: r.residenceManager.phone,
      email: r.residenceManager.email,
      appointedDate: r.residenceManager.appointedDate,
      status: r.residenceManager.status,
      cashDue: r.monthlyPlatformCashDue,
      cashPaymentStatus: r.cashPaymentStatus,
    })),
    ...residences.flatMap((r) =>
      r.buildings
        .filter((b) => b.buildingManager)
        .map((b) => ({
          id: `bm_${b.id}`,
          name: b.buildingManager!.name,
          role: 'Responsable de Bâtiment',
          type: 'BUILDING_MANAGER' as const,
          residenceName: r.name,
          buildingName: b.name,
          phone: b.buildingManager!.phone,
          email: b.buildingManager!.email,
          appointedDate: 'Attribué',
          status: b.buildingManager!.status,
          cashDue: Math.round(r.monthlyPlatformCashDue / r.buildings.length),
          cashPaymentStatus: r.cashPaymentStatus,
        }))
    ),
  ];

  // Handler to register manual cash payment
  const handleSaveCashPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRes = residences.find((r) => r.id === newCashPayment.residenceId);
    const newRecord: CashPaymentRecord = {
      id: `pay_${Date.now()}`,
      receiptNumber: `REC-ESP-2026-${String(cashPayments.length + 44).padStart(4, '0')}`,
      residenceId: newCashPayment.residenceId,
      residenceName: targetRes?.name || 'Résidence',
      payerType: newCashPayment.payerType,
      payerName: newCashPayment.payerName,
      payerRole: newCashPayment.payerRole,
      buildingName: newCashPayment.buildingName || undefined,
      amount: Number(newCashPayment.amount),
      period: newCashPayment.period,
      paymentDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      receivedBy: newCashPayment.receivedBy,
      status: newCashPayment.status,
      notes: newCashPayment.notes,
    };

    setCashPayments([newRecord, ...cashPayments]);

    if (newCashPayment.status === 'COLLECTED_CASH') {
      setResidences((prev) =>
        prev.map((r) =>
          r.id === newCashPayment.residenceId
            ? { ...r, cashPaymentStatus: 'PAID', lastCashPaymentDate: new Date().toISOString().split('T')[0] }
            : r
        )
      );
    }

    setIsCashModalOpen(false);
  };

  const handleMarkAsCollected = (paymentId: string) => {
    setCashPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'COLLECTED_CASH',
              receivedBy: 'Admin Principal (Caisse Centrale)',
              paymentDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
              notes: p.notes + ' [Encaissé en espèces physiquement confirmé]',
            }
          : p
      )
    );
  };

  return (
    <div className="flex min-h-screen creamy-bg text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Luxurious Creamy Ivory Sidebar with Gradient Black Accents */}
      <aside className="w-72 border-r border-stone-300/80 bg-gradient-to-b from-[#fcfbf9] via-[#f7f3ea] to-[#efe9dd] p-6 flex flex-col justify-between shrink-0 shadow-lg">
        <div className="space-y-8">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white shadow-xl shadow-black/20">
              <Shield className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-zinc-950 uppercase gradient-text-dark">
                CITÉ CONNECT
              </h1>
              <span className="text-[11px] font-bold text-stone-500 tracking-wider">SUPER ADMIN CONSOLE</span>
            </div>
          </div>

          {/* Quick Cash Summary Widget in Sidebar */}
          <div className="gradient-card-creamy-elevated rounded-xl p-4 border border-stone-300/90 space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs text-stone-600 font-semibold">
              <span className="flex items-center gap-1.5 text-zinc-900">
                <Banknote className="h-4 w-4 text-zinc-950" /> Caisse Espèces
              </span>
              <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-white text-[10px] font-bold">
                Cash Manuel
              </span>
            </div>
            <div>
              <div className="text-xl font-black text-zinc-950 tracking-tight">
                {totalCashCollected.toLocaleString()} <span className="text-xs text-stone-500 font-normal">DA</span>
              </div>
              <div className="text-[11px] text-stone-600 flex items-center justify-between mt-1">
                <span>Reste à percevoir :</span>
                <span className="text-zinc-900 font-bold">{totalCashPending.toLocaleString()} DA</span>
              </div>
            </div>
            <button
              onClick={() => setIsCashModalOpen(true)}
              className="w-full py-2 px-3 rounded-lg gradient-button-black text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-3.5 w-3.5" /> Encaisser en Espèces
            </button>
          </div>

          {/* Navigation Links with Gradient Black Active States */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('topology')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'topology'
                  ? 'gradient-button-black shadow-md'
                  : 'text-stone-700 hover:text-black hover:bg-stone-200/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className={`h-4 w-4 ${activeTab === 'topology' ? 'text-white' : 'text-stone-500'}`} />
                <span>Résidences & Bâtiments</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === 'topology' ? 'bg-zinc-800 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {totalResidencesCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cash')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'cash'
                  ? 'gradient-button-black shadow-md'
                  : 'text-stone-700 hover:text-black hover:bg-stone-200/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Receipt className={`h-4 w-4 ${activeTab === 'cash' ? 'text-white' : 'text-stone-500'}`} />
                <span>Encaissements Espèces</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === 'cash' ? 'bg-zinc-800 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {cashPayments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('managers')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'managers'
                  ? 'gradient-button-black shadow-md'
                  : 'text-stone-700 hover:text-black hover:bg-stone-200/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`h-4 w-4 ${activeTab === 'managers' ? 'text-white' : 'text-stone-500'}`} />
                <span>Gestionnaires & Chefs</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === 'managers' ? 'bg-zinc-800 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {totalResidenceManagersCount + totalBuildingManagersCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'gradient-button-black shadow-md'
                  : 'text-stone-700 hover:text-black hover:bg-stone-200/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className={`h-4 w-4 ${activeTab === 'overview' ? 'text-white' : 'text-stone-500'}`} />
                <span>Vue d'Ensemble & Audit</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Super Admin Session Footer */}
        <div className="pt-4 border-t border-stone-300/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-zinc-950 to-zinc-800 text-white flex items-center justify-center font-bold text-xs shadow-md">
              SA
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-zinc-950 truncate">Super Administrateur</div>
              <div className="text-[10px] text-stone-500 truncate">caisse.centrale@citeconnect.dz</div>
            </div>
          </div>
          <div className="text-[10px] text-stone-600 flex items-center justify-between font-medium">
            <span>Règlement :</span>
            <span className="text-zinc-950 font-mono font-bold">100% Espèces (Cash)</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-20 border-b border-stone-300/80 bg-white/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-zinc-950 tracking-tight flex items-center gap-2">
                {activeTab === 'topology' && 'Gestion des Résidences & Bâtiments'}
                {activeTab === 'cash' && 'Gestion des Encaissements en Espèces (Cash Manuel)'}
                {activeTab === 'managers' && 'Annuaire des Gestionnaires de Résidence & Bâtiment'}
                {activeTab === 'overview' && 'Tableau de Bord & Audit Monétaire'}
              </h2>
              <p className="text-xs text-stone-600 font-medium">
                Supervision hiérarchique des sites et encaissement direct en espèces
              </p>
            </div>
          </div>

          {/* Action buttons and Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher résidence, gestionnaire, reçu..."
                className="h-9 w-72 rounded-lg bg-white border border-stone-300 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-zinc-900 transition-colors shadow-2xs"
              />
            </div>

            <button
              onClick={() => setIsCashModalOpen(true)}
              className="h-9 px-4 rounded-lg gradient-button-black text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
            >
              <Banknote className="h-4 w-4" /> Enregistrer Versement Espèces
            </button>

            <button
              onClick={() => setIsResidenceModalOpen(true)}
              className="h-9 px-4 rounded-lg gradient-button-creamy text-xs font-bold flex items-center gap-2 transition-colors hover:scale-102"
            >
              <Plus className="h-4 w-4 text-zinc-950" /> Nouvelle Résidence
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 space-y-8 flex-1">
          {/* Top KPI Cards (Creamy Gradient White with Bold Gradient Black Contrast) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Card 1: High-Contrast Gradient Black Card for Total Cash */}
            <div className="gradient-black-card rounded-2xl p-5 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between text-xs text-zinc-300 font-semibold">
                <span>Total Encaissé en Espèces</span>
                <div className="p-2 rounded-xl bg-white/15 text-white">
                  <Banknote className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mt-2 tracking-tight">
                {totalCashCollected.toLocaleString()} <span className="text-sm font-normal text-zinc-300">DA</span>
              </div>
              <div className="text-[11px] text-zinc-300 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                <span>Reçus physiques validés par l'Admin</span>
              </div>
            </div>

            {/* Card 2: Creamy Card for Pending Cash */}
            <div className="gradient-card-creamy-elevated rounded-2xl p-5 border border-stone-300/80 relative overflow-hidden shadow-md">
              <div className="flex items-center justify-between text-xs text-stone-600 font-bold">
                <span>Espèces en Attente de Versement</span>
                <div className="p-2 rounded-xl bg-stone-200/80 text-stone-800">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-zinc-950 mt-2 tracking-tight">
                {totalCashPending.toLocaleString()} <span className="text-sm font-normal text-stone-500">DA</span>
              </div>
              <div className="text-[11px] text-stone-600 mt-2 flex items-center gap-1.5 font-medium">
                <AlertCircle className="h-3.5 w-3.5 text-stone-500" />
                <span>À collecter auprès des gestionnaires</span>
              </div>
            </div>

            {/* Card 3: Creamy Card for Residences & Buildings */}
            <div className="gradient-card-creamy-elevated rounded-2xl p-5 border border-stone-300/80 relative overflow-hidden shadow-md">
              <div className="flex items-center justify-between text-xs text-stone-600 font-bold">
                <span>Résidences & Bâtiments</span>
                <div className="p-2 rounded-xl bg-stone-200/80 text-stone-800">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-zinc-950 mt-2 tracking-tight">
                {totalResidencesCount} <span className="text-sm font-normal text-stone-500">sites</span>
              </div>
              <div className="text-[11px] text-stone-600 mt-2 flex items-center gap-1.5 font-medium">
                <span>{totalBuildingsCount} bâtiments • {totalApartmentsCount} appartements</span>
              </div>
            </div>

            {/* Card 4: Creamy Card for Managers */}
            <div className="gradient-card-creamy-elevated rounded-2xl p-5 border border-stone-300/80 relative overflow-hidden shadow-md">
              <div className="flex items-center justify-between text-xs text-stone-600 font-bold">
                <span>Gestionnaires Actifs</span>
                <div className="p-2 rounded-xl bg-stone-200/80 text-stone-800">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-zinc-950 mt-2 tracking-tight">
                {totalResidenceManagersCount + totalBuildingManagersCount}{' '}
                <span className="text-sm font-normal text-stone-500">responsables</span>
              </div>
              <div className="text-[11px] text-stone-600 mt-2 flex items-center gap-1.5 font-medium">
                <span>{totalResidenceManagersCount} de résidence • {totalBuildingManagersCount} de bloc</span>
              </div>
            </div>
          </div>

          {/* TAB 1: TOPOLOGY (RESIDENCES, BUILDINGS, MANAGERS) */}
          {activeTab === 'topology' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight">
                    Arborescence Complète : Résidences, Bâtiments & Responsables
                  </h3>
                  <p className="text-xs text-stone-600">
                    Chaque résidence dispose de son Gestionnaire de Résidence et de ses Responsables de Bâtiment
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsBuildingModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg gradient-button-creamy text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Ajouter un Bâtiment
                  </button>
                  <button
                    onClick={() => setIsManagerModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg gradient-button-black text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Nommer un Responsable
                  </button>
                </div>
              </div>

              {/* Residences Accordion / Detailed Cards */}
              <div className="space-y-4">
                {filteredResidences.map((residence) => {
                  const isExpanded = expandedResidenceId === residence.id;
                  const totalResApts = residence.buildings.reduce((sum, b) => sum + b.apartmentsCount, 0);

                  return (
                    <div
                      key={residence.id}
                      className="gradient-card-creamy rounded-2xl border border-stone-300/90 overflow-hidden shadow-md transition-all hover:border-stone-400"
                    >
                      {/* Residence Header Row */}
                      <div
                        onClick={() => setExpandedResidenceId(isExpanded ? null : residence.id)}
                        className="p-5 flex items-center justify-between cursor-pointer bg-gradient-to-r from-white via-[#fcfaf5] to-[#f6f2e8] select-none"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white flex items-center justify-center font-bold shadow-md">
                            <Building2 className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h4 className="text-base font-black text-zinc-950">{residence.name}</h4>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-200/90 text-stone-800 font-bold border border-stone-300">
                                {residence.city}
                              </span>
                              {residence.cashPaymentStatus === 'PAID' ? (
                                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-zinc-950 text-white font-bold flex items-center gap-1 shadow-xs">
                                  <Check className="h-3 w-3 stroke-[3]" /> Espèces Encaissées
                                </span>
                              ) : residence.cashPaymentStatus === 'PARTIAL' ? (
                                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-300 text-stone-900 font-bold flex items-center gap-1">
                                  Partiellement Payé en Espèces
                                </span>
                              ) : (
                                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center gap-1">
                                  En attente de versement
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-stone-600 mt-1 flex items-center gap-4 font-medium">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-stone-500" /> {residence.address}
                              </span>
                              <span>•</span>
                              <span>{residence.buildings.length} Bâtiments</span>
                              <span>•</span>
                              <span>{totalResApts} Appartements</span>
                              <span>•</span>
                              <span className="text-zinc-950 font-bold">
                                Redevance : {residence.monthlyPlatformCashDue.toLocaleString()} DA / mois (Espèces)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewCashPayment({
                                ...newCashPayment,
                                residenceId: residence.id,
                                payerType: 'RESIDENCE_MANAGER',
                                payerName: residence.residenceManager.name,
                                payerRole: 'Gestionnaire de Résidence',
                                amount: residence.monthlyPlatformCashDue,
                              });
                              setIsCashModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 rounded-lg gradient-button-black text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 shadow-sm"
                          >
                            <Banknote className="h-3.5 w-3.5" /> Encaisser Espèces
                          </button>
                          <div className="text-stone-400">
                            {isExpanded ? <ChevronDown className="h-5 w-5 text-zinc-900" /> : <ChevronRight className="h-5 w-5" />}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Section: Residence Manager & Buildings */}
                      {isExpanded && (
                        <div className="p-6 border-t border-stone-200 bg-[#f9f6ee]/70 space-y-6">
                          {/* 1. Residence Manager Profile Card */}
                          <div className="gradient-card-creamy-elevated rounded-xl p-4 border border-stone-300">
                            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-zinc-950" /> Gestionnaire Général de la Résidence (Syndic Principal)
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-zinc-950 to-zinc-800 text-white flex items-center justify-center font-black text-sm shadow-md">
                                  {residence.residenceManager.name.substring(3, 5)}
                                </div>
                                <div>
                                  <div className="text-sm font-black text-zinc-950 flex items-center gap-2">
                                    {residence.residenceManager.name}
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 font-mono font-bold">
                                      Depuis {residence.residenceManager.appointedDate}
                                    </span>
                                  </div>
                                  <div className="text-xs text-stone-600 flex items-center gap-4 mt-0.5 font-medium">
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-3 w-3 text-stone-500" /> {residence.residenceManager.phone}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-3 w-3 text-stone-500" /> {residence.residenceManager.email}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-xs">
                                <div className="text-right">
                                  <div className="text-stone-500 font-medium">Dernier versement cash reçu</div>
                                  <div className="text-zinc-950 font-bold font-mono">
                                    {residence.lastCashPaymentDate}
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedResidenceFilter(residence.id);
                                    setActiveTab('cash');
                                  }}
                                  className="px-3 py-1.5 rounded-lg gradient-button-creamy text-xs font-bold shadow-2xs"
                                >
                                  Historique Caisse
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* 2. Buildings & Building Managers Sub-Grid */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
                                <Layers className="h-3.5 w-3.5 text-zinc-950" /> Bâtiments & Chefs de Bloc (Building Managers)
                              </h5>
                              <span className="text-xs text-stone-500 font-medium">
                                {residence.buildings.length} bâtiments rattachés
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {residence.buildings.map((building) => (
                                <div
                                  key={building.id}
                                  className="gradient-card-creamy rounded-xl p-4 border border-stone-300 space-y-3 relative group hover:border-stone-400 transition-colors shadow-xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-black text-sm text-zinc-950">
                                      <Home className="h-4 w-4 text-stone-500" />
                                      {building.name}
                                    </div>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                                      {building.apartmentsCount} apts • {building.floorsCount} ét.
                                    </span>
                                  </div>

                                  {/* Building Manager Details */}
                                  <div className="pt-2 border-t border-stone-200 space-y-1.5">
                                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                                      Responsable de Bâtiment :
                                    </div>
                                    {building.buildingManager ? (
                                      <div className="space-y-1">
                                        <div className="text-xs font-black text-zinc-950 flex items-center justify-between">
                                          <span>{building.buildingManager.name}</span>
                                          <span className="text-[10px] text-stone-500 font-mono font-bold">
                                            {building.buildingManager.apartment}
                                          </span>
                                        </div>
                                        <div className="text-[11px] text-stone-600 flex items-center gap-2 font-medium">
                                          <Phone className="h-3 w-3 text-stone-500" />
                                          {building.buildingManager.phone}
                                        </div>
                                        <div className="text-[11px] text-stone-600 flex items-center gap-2 font-medium">
                                          <Mail className="h-3 w-3 text-stone-500" />
                                          {building.buildingManager.email}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-xs text-stone-400 italic py-1">
                                        Aucun responsable assigné
                                      </div>
                                    )}
                                  </div>

                                  {/* Building Cash Action */}
                                  <div className="pt-2 flex items-center justify-between text-xs">
                                    <button
                                      onClick={() => {
                                        setNewCashPayment({
                                          ...newCashPayment,
                                          residenceId: residence.id,
                                          payerType: 'BUILDING_MANAGER',
                                          payerName: building.buildingManager?.name || 'Chef de Bloc',
                                          payerRole: `Responsable ${building.name}`,
                                          buildingName: building.name,
                                          amount: Math.round(residence.monthlyPlatformCashDue / residence.buildings.length),
                                        });
                                        setIsCashModalOpen(true);
                                      }}
                                      className="text-xs text-zinc-950 hover:underline flex items-center gap-1 font-bold"
                                    >
                                      <Banknote className="h-3 w-3" /> Encaisser quote-part
                                    </button>
                                    <span className="text-[10px] text-stone-400 font-mono">ID: {building.id}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CASH PAYMENTS LEDGER & MANUAL RECEIPTS */}
          {activeTab === 'cash' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-zinc-950" /> Registre des Encaissements en Espèces (Cash Ledger)
                  </h3>
                  <p className="text-xs text-stone-600">
                    Gestion manuelle des règlements en espèces remis en main propre par les gestionnaires de résidences et de bâtiments
                  </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-stone-700 bg-white border border-stone-300 rounded-lg p-1 shadow-2xs">
                    <button
                      onClick={() => setCashStatusFilter('ALL')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        cashStatusFilter === 'ALL' ? 'bg-zinc-950 text-white font-bold' : 'hover:text-black font-medium'
                      }`}
                    >
                      Tous
                    </button>
                    <button
                      onClick={() => setCashStatusFilter('COLLECTED')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        cashStatusFilter === 'COLLECTED' ? 'bg-zinc-950 text-white font-bold' : 'hover:text-black font-medium'
                      }`}
                    >
                      Encaissés
                    </button>
                    <button
                      onClick={() => setCashStatusFilter('PENDING')}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        cashStatusFilter === 'PENDING' ? 'bg-zinc-950 text-white font-bold' : 'hover:text-black font-medium'
                      }`}
                    >
                      En Attente
                    </button>
                  </div>

                  <select
                    value={selectedResidenceFilter}
                    onChange={(e) => setSelectedResidenceFilter(e.target.value)}
                    className="h-9 px-3 rounded-lg bg-white border border-stone-300 text-xs text-zinc-900 focus:outline-none focus:border-black font-medium shadow-2xs"
                  >
                    <option value="ALL">Toutes les Résidences</option>
                    {residences.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setIsCashModalOpen(true)}
                    className="h-9 px-4 rounded-lg gradient-button-black text-xs font-bold flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Nouveau Versement
                  </button>
                </div>
              </div>

              {/* Cash Ledger Table */}
              <div className="gradient-card-creamy-elevated rounded-2xl border border-stone-300/90 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-300 bg-[#f4efe4] text-stone-700 uppercase tracking-wider font-bold">
                      <th className="py-4 px-5">N° Quittance / Reçu</th>
                      <th className="py-4 px-5">Résidence & Bâtiment</th>
                      <th className="py-4 px-5">Dépositaire (Payeur Cash)</th>
                      <th className="py-4 px-5">Période</th>
                      <th className="py-4 px-5 text-right">Montant Espèces</th>
                      <th className="py-4 px-5">Date & Réceptionnaire</th>
                      <th className="py-4 px-5">Statut Caisse</th>
                      <th className="py-4 px-5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredCashPayments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-stone-500 font-medium">
                          Aucun encaissement en espèces trouvé pour ces critères.
                        </td>
                      </tr>
                    ) : (
                      filteredCashPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-white/80 transition-colors">
                          <td className="py-4 px-5 font-mono font-bold text-zinc-950 flex items-center gap-2">
                            <Receipt className="h-3.5 w-3.5 text-stone-500" />
                            {payment.receiptNumber}
                          </td>
                          <td className="py-4 px-5">
                            <div className="font-bold text-zinc-950">{payment.residenceName}</div>
                            {payment.buildingName && (
                              <div className="text-[11px] text-stone-600 font-medium">{payment.buildingName}</div>
                            )}
                          </td>
                          <td className="py-4 px-5">
                            <div className="font-bold text-zinc-950">{payment.payerName}</div>
                            <div className="text-[10px] text-stone-500 font-medium">{payment.payerRole}</div>
                          </td>
                          <td className="py-4 px-5 text-stone-800 font-semibold">{payment.period}</td>
                          <td className="py-4 px-5 text-right font-mono font-black text-zinc-950 text-sm">
                            {payment.amount.toLocaleString()} <span className="text-[10px] font-normal text-stone-500">DA</span>
                          </td>
                          <td className="py-4 px-5">
                            <div className="text-zinc-900 font-mono text-[11px] font-semibold">{payment.paymentDate}</div>
                            <div className="text-[10px] text-stone-500">Reçu par : {payment.receivedBy}</div>
                          </td>
                          <td className="py-4 px-5">
                            {payment.status === 'COLLECTED_CASH' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-950 text-white font-bold text-[10px] shadow-2xs">
                                <Check className="h-3 w-3 stroke-[3]" /> Encaissé en main propre
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 font-bold text-[10px] border border-stone-300">
                                <Clock className="h-3 w-3 text-stone-600" /> En attente de remise
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {payment.status === 'PENDING_CASH' && (
                                <button
                                  onClick={() => handleMarkAsCollected(payment.id)}
                                  className="px-2.5 py-1 rounded gradient-button-black text-[10px] font-bold shadow-xs hover:scale-105 transition-all"
                                  title="Confirmer la réception physique des espèces"
                                >
                                  Valider Cash
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedReceipt(payment)}
                                className="px-2.5 py-1 rounded gradient-button-creamy text-[10px] font-bold flex items-center gap-1 shadow-2xs hover:scale-102 transition-all"
                              >
                                <Printer className="h-3 w-3" /> Reçu Officiel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGERS DIRECTORY (RESIDENCE & BUILDING MANAGERS) */}
          {activeTab === 'managers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-zinc-950 tracking-tight flex items-center gap-2">
                    <Users className="h-5 w-5 text-zinc-950" /> Annuaire des Gestionnaires & Responsables de Bâtiment
                  </h3>
                  <p className="text-xs text-stone-600">
                    Contacts directs et suivi des cotisations en espèces par gestionnaire
                  </p>
                </div>
                <button
                  onClick={() => setIsManagerModalOpen(true)}
                  className="px-3.5 py-2 rounded-lg gradient-button-black text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <UserPlus className="h-4 w-4" /> Désigner un Responsable
                </button>
              </div>

              <div className="gradient-card-creamy-elevated rounded-2xl border border-stone-300/90 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-300 bg-[#f4efe4] text-stone-700 uppercase tracking-wider font-bold">
                      <th className="py-4 px-5">Nom du Responsable</th>
                      <th className="py-4 px-5">Fonction & Niveau</th>
                      <th className="py-4 px-5">Résidence Rattachée</th>
                      <th className="py-4 px-5">Bâtiment Affecté</th>
                      <th className="py-4 px-5">Contact Téléphonique</th>
                      <th className="py-4 px-5">Adresse Email</th>
                      <th className="py-4 px-5 text-right">Redevance Prévue</th>
                      <th className="py-4 px-5 text-center">Action Cash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {allManagersList.map((m) => (
                      <tr key={m.id} className="hover:bg-white/80 transition-colors">
                        <td className="py-4 px-5 font-bold text-zinc-950 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-zinc-950 to-zinc-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {m.name.charAt(0)}
                          </div>
                          <span>{m.name}</span>
                        </td>
                        <td className="py-4 px-5">
                          {m.type === 'RESIDENCE_MANAGER' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-zinc-950 text-white font-bold text-[10px]">
                              Gestionnaire Résidence
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 font-bold text-[10px] border border-stone-300">
                              Chef de Bâtiment
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-zinc-900 font-bold">{m.residenceName}</td>
                        <td className="py-4 px-5 text-stone-600 font-medium">{m.buildingName}</td>
                        <td className="py-4 px-5 font-mono text-stone-800 font-semibold">{m.phone}</td>
                        <td className="py-4 px-5 text-stone-600">{m.email}</td>
                        <td className="py-4 px-5 text-right font-mono font-black text-zinc-950">
                          {m.cashDue.toLocaleString()} DA
                        </td>
                        <td className="py-4 px-5 text-center">
                          <button
                            onClick={() => {
                              const targetRes = residences.find((r) => r.name === m.residenceName);
                              setNewCashPayment({
                                ...newCashPayment,
                                residenceId: targetRes?.id || 'res_1',
                                payerType: m.type,
                                payerName: m.name,
                                payerRole: m.role,
                                buildingName: m.type === 'BUILDING_MANAGER' ? m.buildingName : '',
                                amount: m.cashDue,
                              });
                              setIsCashModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded gradient-button-black text-[10px] font-bold shadow-2xs"
                          >
                            Encaisser Cash
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: OVERVIEW & CASH AUDIT */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cash Flow Balance Card */}
                <div className="gradient-card-creamy-elevated rounded-2xl p-6 border border-stone-300 space-y-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                      <Banknote className="h-4 w-4" /> Bilan des Versements Espèces
                    </h4>
                    <span className="text-xs text-stone-500 font-mono font-bold">Exercice 2026</span>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-medium">Total Encaissé en Main Propre :</span>
                      <span className="font-mono font-black text-zinc-950 text-base">
                        {totalCashCollected.toLocaleString()} DZD
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-zinc-800 to-black h-2.5 rounded-full"
                        style={{
                          width: `${Math.round(
                            (totalCashCollected / (totalCashCollected + totalCashPending || 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-600 font-medium">
                      <span>Taux de recouvrement en espèces :</span>
                      <span className="font-black text-zinc-950">
                        {Math.round((totalCashCollected / (totalCashCollected + totalCashPending || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cash Rules Guidelines for Super Admin */}
                <div className="gradient-card-creamy-elevated rounded-2xl p-6 border border-stone-300 space-y-3 shadow-md">
                  <h4 className="text-sm font-black text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Protocole de Versement Espèces Cité Connect
                  </h4>
                  <ul className="text-xs text-stone-700 space-y-2.5 leading-relaxed font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-zinc-950 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>
                        Les règlements sont perçus en devises algériennes (DZD) en billets de banque au bureau central ou lors des tournées d'inspection.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-zinc-950 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>
                        Toute perception de cash donne lieu à la remise immédiate du Reçu Officiel tamponné et signé par le Super Admin.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-zinc-950 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>
                        Les versements peuvent être effectués soit globalement par le Gestionnaire de Résidence, soit par bloc par le Responsable de Bâtiment.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL 1: RECORD MANUAL CASH PAYMENT */}
      {isCashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg gradient-card-creamy-elevated rounded-2xl border border-stone-400 p-6 space-y-5 shadow-2xl relative text-zinc-900">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-zinc-950 text-white font-bold shadow-md">
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-950">Encaisser un Versement en Espèces</h3>
                  <p className="text-xs text-stone-600">Saisie manuelle du paiement cash reçu de la résidence</p>
                </div>
              </div>
              <button
                onClick={() => setIsCashModalOpen(false)}
                className="text-stone-400 hover:text-black p-1 rounded-lg hover:bg-stone-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCashPayment} className="space-y-4 text-xs font-medium">
              {/* Select Residence */}
              <div className="space-y-1">
                <label className="text-zinc-900 font-bold">Résidence Concernée</label>
                <select
                  value={newCashPayment.residenceId}
                  onChange={(e) => {
                    const rId = e.target.value;
                    const r = residences.find((x) => x.id === rId);
                    setNewCashPayment({
                      ...newCashPayment,
                      residenceId: rId,
                      payerName: r?.residenceManager.name || '',
                      payerRole: 'Gestionnaire de Résidence',
                      amount: r?.monthlyPlatformCashDue || 40000,
                    });
                  }}
                  className="w-full h-10 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 focus:outline-none focus:border-black font-semibold shadow-2xs"
                >
                  {residences.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Payer Type & Role */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Type de Dépositaire</label>
                  <select
                    value={newCashPayment.payerType}
                    onChange={(e) =>
                      setNewCashPayment({
                        ...newCashPayment,
                        payerType: e.target.value as any,
                      })
                    }
                    className="w-full h-10 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 focus:outline-none focus:border-black font-semibold shadow-2xs"
                  >
                    <option value="RESIDENCE_MANAGER">Gestionnaire de Résidence</option>
                    <option value="BUILDING_MANAGER">Responsable de Bâtiment</option>
                    <option value="RESIDENCE_TREASURY">Trésorerie Directe Site</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Nom du Dépositaire</label>
                  <input
                    type="text"
                    required
                    value={newCashPayment.payerName}
                    onChange={(e) => setNewCashPayment({ ...newCashPayment, payerName: e.target.value })}
                    className="w-full h-10 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 focus:outline-none focus:border-black font-semibold shadow-2xs"
                  />
                </div>
              </div>

              {/* Building Name (if building manager) */}
              {newCashPayment.payerType === 'BUILDING_MANAGER' && (
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Bâtiment / Bloc Concerné</label>
                  <input
                    type="text"
                    placeholder="Ex: Bâtiment A, Bloc 2..."
                    value={newCashPayment.buildingName}
                    onChange={(e) => setNewCashPayment({ ...newCashPayment, buildingName: e.target.value })}
                    className="w-full h-10 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 focus:outline-none focus:border-black font-semibold shadow-2xs"
                  />
                </div>
              )}

              {/* Amount and Period */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Montant en Espèces (DZD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={100}
                      step={500}
                      value={newCashPayment.amount}
                      onChange={(e) => setNewCashPayment({ ...newCashPayment, amount: Number(e.target.value) })}
                      className="w-full h-10 rounded-lg bg-white border border-stone-300 pl-3 pr-10 text-zinc-950 font-mono font-black focus:outline-none focus:border-black shadow-2xs"
                    />
                    <span className="absolute right-3 top-2.5 text-stone-500 font-bold text-xs">DA</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Période Couverte</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mars 2026, 1er Trimestre..."
                    value={newCashPayment.period}
                    onChange={(e) => setNewCashPayment({ ...newCashPayment, period: e.target.value })}
                    className="w-full h-10 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 focus:outline-none focus:border-black font-semibold shadow-2xs"
                  />
                </div>
              </div>

              {/* Received By and Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Reçu par (Agent Caisse)</label>
                  <input
                    type="text"
                    required
                    value={newCashPayment.receivedBy}
                    onChange={(e) => setNewCashPayment({ ...newCashPayment, receivedBy: e.target.value })}
                    className="w-full h-10 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 focus:outline-none focus:border-black font-semibold shadow-2xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Statut Encaissement</label>
                  <select
                    value={newCashPayment.status}
                    onChange={(e) =>
                      setNewCashPayment({
                        ...newCashPayment,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full h-10 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 focus:outline-none focus:border-black font-semibold shadow-2xs"
                  >
                    <option value="COLLECTED_CASH">Encaissé (Billets réceptionnés)</option>
                    <option value="PENDING_CASH">En attente de remise physique</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-zinc-900 font-bold">Remarques / Décompte Billets</label>
                <textarea
                  rows={2}
                  value={newCashPayment.notes}
                  onChange={(e) => setNewCashPayment({ ...newCashPayment, notes: e.target.value })}
                  placeholder="Ex: Remis en coupures de 2000 DA et 1000 DA au bureau..."
                  className="w-full rounded-lg bg-white border border-stone-300 p-2.5 text-zinc-900 focus:outline-none focus:border-black font-semibold shadow-2xs"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCashModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-200 text-stone-800 hover:bg-stone-300 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg gradient-button-black font-bold flex items-center gap-2 shadow-md hover:scale-105 transition-all"
                >
                  <Check className="h-4 w-4 stroke-[3]" /> Valider l'Encaissement Espèces
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE OFFICIAL CASH RECEIPT */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white text-black rounded-2xl p-8 space-y-6 shadow-2xl relative border-4 border-black">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-4">
              <div>
                <h3 className="text-lg font-black tracking-wider uppercase">CITÉ CONNECT ALGÉRIE</h3>
                <p className="text-xs font-bold text-stone-600">DIRECTION GÉNÉRALE • CAISSE CENTRALE</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-stone-600">QUITTANCE N°</div>
                <div className="text-sm font-mono font-black">{selectedReceipt.receiptNumber}</div>
              </div>
            </div>

            {/* Receipt Title */}
            <div className="text-center py-2 bg-black text-white rounded-lg font-black text-sm tracking-wide uppercase shadow-md">
              REÇU DE PAIEMENT EN ESPÈCES (CASH RECEIPT)
            </div>

            {/* Details Grid */}
            <div className="space-y-3 text-xs border border-stone-300 rounded-lg p-4 bg-[#faf8f4]">
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="font-bold text-stone-600">Résidence :</span>
                <span className="font-black text-black">{selectedReceipt.residenceName}</span>
              </div>
              {selectedReceipt.buildingName && (
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="font-bold text-stone-600">Bâtiment / Bloc :</span>
                  <span className="font-black text-black">{selectedReceipt.buildingName}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="font-bold text-stone-600">Dépositaire (Remis par) :</span>
                <span className="font-black text-black">
                  {selectedReceipt.payerName} ({selectedReceipt.payerRole})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="font-bold text-stone-600">Période concernée :</span>
                <span className="font-black text-black">{selectedReceipt.period}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="font-bold text-stone-600">Date & Heure de versement :</span>
                <span className="font-mono font-black text-black">{selectedReceipt.paymentDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-200">
                <span className="font-bold text-stone-600">Réceptionné par :</span>
                <span className="font-black text-black">{selectedReceipt.receivedBy}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-black text-sm text-black uppercase">MONTANT ENCAISSÉ :</span>
                <span className="font-mono font-black text-xl text-black">
                  {selectedReceipt.amount.toLocaleString()} DZD
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="text-[11px] text-stone-700 bg-stone-100 p-3 rounded-lg border border-stone-200 font-medium">
              <span className="font-bold">Observation :</span> {selectedReceipt.notes}
            </div>

            {/* Simulated Stamp and Signature Area */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-dashed border-stone-300">
              <div className="text-center p-3 border-2 border-stone-400 border-dashed rounded-xl">
                <div className="text-[10px] text-stone-500 uppercase font-black">Signature du Dépositaire</div>
                <div className="h-10 flex items-center justify-center font-serif italic text-zinc-800 font-bold">
                  {selectedReceipt.payerName}
                </div>
              </div>
              <div className="text-center p-3 border-2 border-black rounded-xl bg-white relative overflow-hidden shadow-inner">
                <div className="text-[9px] font-black text-black uppercase tracking-wider">
                  CAISSE CENTRALE CITÉ CONNECT
                </div>
                <div className="text-xs font-black text-black my-1 uppercase">★ PAYÉ EN ESPÈCES ★</div>
                <div className="text-[9px] font-mono font-bold text-stone-600">
                  {selectedReceipt.paymentDate.split(' ')[0]}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-lg bg-stone-200 text-black font-bold text-xs hover:bg-stone-300"
              >
                Fermer
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-lg bg-black text-white font-black text-xs flex items-center gap-2 hover:bg-zinc-800 shadow-md"
              >
                <Printer className="h-4 w-4" /> Imprimer le Reçu Officiel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD RESIDENCE */}
      {isResidenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md gradient-card-creamy-elevated rounded-2xl border border-stone-400 p-6 space-y-4 shadow-2xl text-zinc-900">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-zinc-950" /> Créer une Nouvelle Résidence
              </h3>
              <button onClick={() => setIsResidenceModalOpen(false)} className="text-stone-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newRes: ResidenceItem = {
                  id: `res_${Date.now()}`,
                  name: formData.get('name') as string,
                  city: formData.get('city') as string,
                  address: formData.get('address') as string,
                  residenceManager: {
                    name: formData.get('managerName') as string,
                    phone: formData.get('managerPhone') as string,
                    email: formData.get('managerEmail') as string,
                    appointedDate: new Date().toISOString().split('T')[0],
                    status: 'ACTIVE',
                  },
                  monthlyPlatformCashDue: Number(formData.get('dues')) || 40000,
                  cashPaymentStatus: 'OVERDUE',
                  lastCashPaymentDate: 'Nouveau site',
                  buildings: [
                    {
                      id: `bld_${Date.now()}_1`,
                      name: 'Bâtiment Principal A',
                      floorsCount: 5,
                      apartmentsCount: 20,
                      buildingManager: {
                        name: 'À désigner',
                        phone: '-',
                        email: '-',
                        apartment: 'RDC',
                        status: 'PENDING',
                      },
                    },
                  ],
                };
                setResidences([newRes, ...residences]);
                setIsResidenceModalOpen(false);
              }}
              className="space-y-3 text-xs font-medium"
            >
              <div className="space-y-1">
                <label className="text-zinc-900 font-bold">Nom de la Résidence</label>
                <input
                  name="name"
                  required
                  placeholder="Ex: Résidence Les Orangers"
                  className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Ville / Wilaya</label>
                  <input
                    name="city"
                    required
                    placeholder="Ex: Bab Ezzouar, Alger"
                    className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Redevance Cash (DA/mois)</label>
                  <input
                    name="dues"
                    type="number"
                    defaultValue={40000}
                    className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-950 font-mono font-black"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-zinc-900 font-bold">Adresse Complète</label>
                <input
                  name="address"
                  required
                  placeholder="Ex: Lotissement 22, Route de..."
                  className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold"
                />
              </div>
              <div className="pt-2 border-t border-stone-200 space-y-2">
                <div className="text-[11px] font-black text-stone-600 uppercase">Gestionnaire de Résidence Initial</div>
                <input
                  name="managerName"
                  required
                  placeholder="Nom & Prénom du Gestionnaire"
                  className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name="managerPhone"
                    required
                    placeholder="+213 550..."
                    className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-mono font-bold"
                  />
                  <input
                    name="managerEmail"
                    required
                    placeholder="contact@..."
                    className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResidenceModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-800 font-bold"
                >
                  Annuler
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg gradient-button-black font-black shadow-sm">
                  Enregistrer Résidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD BUILDING */}
      {isBuildingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md gradient-card-creamy-elevated rounded-2xl border border-stone-400 p-6 space-y-4 shadow-2xl text-zinc-900">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                <Home className="h-5 w-5 text-zinc-950" /> Ajouter un Bâtiment
              </h3>
              <button onClick={() => setIsBuildingModalOpen(false)} className="text-stone-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const targetResId = formData.get('residenceId') as string;
                const newBld: BuildingItem = {
                  id: `bld_${Date.now()}`,
                  name: formData.get('bldName') as string,
                  floorsCount: Number(formData.get('floors')) || 5,
                  apartmentsCount: Number(formData.get('apts')) || 20,
                  buildingManager: {
                    name: (formData.get('bldManagerName') as string) || 'À désigner',
                    phone: (formData.get('bldManagerPhone') as string) || '-',
                    email: (formData.get('bldManagerEmail') as string) || '-',
                    apartment: (formData.get('bldManagerApt') as string) || 'Apt 1',
                    status: 'ACTIVE',
                  },
                };
                setResidences((prev) =>
                  prev.map((r) => (r.id === targetResId ? { ...r, buildings: [...r.buildings, newBld] } : r))
                );
                setIsBuildingModalOpen(false);
              }}
              className="space-y-3 text-xs font-medium"
            >
              <div className="space-y-1">
                <label className="text-zinc-900 font-bold">Résidence d'Appartenance</label>
                <select
                  name="residenceId"
                  className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold"
                >
                  {residences.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-zinc-900 font-bold">Nom du Bâtiment / Bloc</label>
                <input
                  name="bldName"
                  required
                  placeholder="Ex: Bâtiment D (Le Jasmin)"
                  className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Nombre d'Étages</label>
                  <input
                    name="floors"
                    type="number"
                    defaultValue={6}
                    className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-950 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Nombre d'Appartements</label>
                  <input
                    name="apts"
                    type="number"
                    defaultValue={24}
                    className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-950 font-bold"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-stone-200 space-y-2">
                <div className="text-[11px] font-black text-stone-600 uppercase">Chef de Bloc / Responsable Bâtiment</div>
                <input
                  name="bldManagerName"
                  required
                  placeholder="Nom & Prénom"
                  className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name="bldManagerPhone"
                    placeholder="Téléphone (+213...)"
                    className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-mono font-bold"
                  />
                  <input
                    name="bldManagerApt"
                    placeholder="Numéro Apt (Ex: Apt D-02)"
                    className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBuildingModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-800 font-bold"
                >
                  Annuler
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg gradient-button-black font-black shadow-sm">
                  Ajouter Bâtiment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: DESIGNATE / REASSIGN MANAGER */}
      {isManagerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md gradient-card-creamy-elevated rounded-2xl border border-stone-400 p-6 space-y-4 shadow-2xl text-zinc-900">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-black text-zinc-950 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-zinc-950" /> Désigner un Responsable
              </h3>
              <button onClick={() => setIsManagerModalOpen(false)} className="text-stone-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Responsable mis à jour avec succès dans le registre officiel.');
                setIsManagerModalOpen(false);
              }}
              className="space-y-3 text-xs font-medium"
            >
              <div className="space-y-1">
                <label className="text-zinc-900 font-bold">Résidence</label>
                <select className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold">
                  {residences.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-zinc-900 font-bold">Type de Rôle</label>
                <select className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold">
                  <option>Gestionnaire de Résidence (Syndic)</option>
                  <option>Responsable de Bâtiment (Chef de Bloc)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-zinc-900 font-bold">Nom & Prénom</label>
                <input
                  required
                  placeholder="Ex: M. Khaled Bouzid"
                  className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Numéro de Téléphone</label>
                  <input
                    required
                    placeholder="+213 550..."
                    className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-900 font-bold">Email Professionnel</label>
                  <input
                    required
                    type="email"
                    placeholder="khaled@..."
                    className="w-full h-9 rounded-lg bg-white border border-stone-300 px-3 text-zinc-900 font-semibold"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManagerModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-800 font-bold"
                >
                  Annuler
                </button>
                <button type="submit" className="px-4 py-1.5 rounded-lg gradient-button-black font-black shadow-sm">
                  Valider la Désignation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
