'use client';

import React, { useState } from 'react';
import { ManagerSidebar, NavTab } from '../components/ManagerNavigation';
import { Header, UserRole } from '../components/Header';
import { DashboardView } from '../components/views/DashboardView';
import { ResidencesView } from '../components/views/ResidencesView';
import { ResidentsView } from '../components/views/ResidentsView';
import { FinancesView } from '../components/views/FinancesView';
import { MaintenanceView } from '../components/views/MaintenanceView';
import { StaffView } from '../components/views/StaffView';
import { AnnouncementsView } from '../components/views/AnnouncementsView';
import { DocumentsView } from '../components/views/DocumentsView';
import { ReportsView } from '../components/views/ReportsView';
import { SettingsView } from '../components/views/SettingsView';
import {
  PaymentModal,
  IncidentModal,
  AddBuildingModal,
  AddBuildingManagerModal,
  AddResidentModal,
} from '../components/Modals';

import {
  mockResidences,
  mockBuildings,
  mockApartments,
  mockUnpaidDebts,
  mockPayments,
  mockExpenses,
  mockBills,
  mockIncidents,
  mockEquipment,
  mockStaff,
  mockTasks,
  mockAnnouncements,
  mockDocuments,
  mockBuildingManagers,
} from '../data/mockData';

export default function AppHome() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedResidenceId, setSelectedResidenceId] = useState<string>('res-1');

  // Role State: Residence Manager vs Building Manager
  const [currentRole, setCurrentRole] = useState<UserRole>('RESIDENCE_MANAGER');

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [isAddBuildingModalOpen, setIsAddBuildingModalOpen] = useState(false);
  const [isAddBuildingManagerModalOpen, setIsAddBuildingManagerModalOpen] = useState(false);
  const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false);

  // Dynamic state
  const [buildings, setBuildings] = useState(mockBuildings);
  const [buildingManagers, setBuildingManagers] = useState(mockBuildingManagers);
  const [apartments, setApartments] = useState(mockApartments);
  const [payments, setPayments] = useState(mockPayments);
  const [incidents, setIncidents] = useState(mockIncidents);
  const [unpaidDebts, setUnpaidDebts] = useState(mockUnpaidDebts);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const [residentsList, setResidentsList] = useState([
    {
      id: 'res-1',
      fullName: 'Krimo Benali',
      type: 'OWNER',
      apartment: 'A1 - Apt 01',
      floor: 0,
      phone: '0550 12 34 56',
      email: 'krimo.benali@gmail.com',
      joinedDate: 'Janvier 2024',
      balance: 0,
      status: 'UP_TO_DATE',
    },
    {
      id: 'res-2',
      fullName: 'Amina Saidi',
      type: 'OWNER',
      apartment: 'A1 - Apt 02',
      floor: 0,
      phone: '0661 98 76 54',
      email: 'amina.saidi@yahoo.fr',
      joinedDate: 'Mars 2024',
      balance: 2000,
      status: 'CREDIT',
    },
    {
      id: 'res-3',
      fullName: 'Youcef Belhadj',
      type: 'TENANT',
      apartment: 'A2 - Apt 04',
      floor: 1,
      phone: '0770 45 67 89',
      email: 'y.belhadj@hotmail.com',
      joinedDate: 'Novembre 2024',
      balance: -8000,
      status: 'DEBT',
    },
    {
      id: 'res-4',
      fullName: 'Farida Meziane',
      type: 'OWNER',
      apartment: 'B1 - Apt 12',
      floor: 3,
      phone: '0662 33 44 55',
      email: 'f.meziane@gmail.com',
      joinedDate: 'Février 2024',
      balance: -6000,
      status: 'DEBT',
    },
    {
      id: 'res-5',
      fullName: 'Rachid Mebarki',
      type: 'TENANT',
      apartment: 'A2 - Apt 08',
      floor: 2,
      phone: '0555 78 90 12',
      email: 'rachid.m@gmail.com',
      joinedDate: 'Juin 2025',
      balance: -4000,
      status: 'DEBT',
    },
  ]);

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // 1. Residence Manager Action: Add Batiment (Bâtiment)
  const handleAddBuilding = (newBuilding: any) => {
    setBuildings((prev) => [newBuilding, ...prev]);
    showToast(`✓ Bâtiment "${newBuilding.name}" ajouté avec succès (${newBuilding.apartmentsCount} logements).`);
  };

  // 2. Residence Manager Action: Add Building Manager
  const handleAddBuildingManager = (newManager: any) => {
    const managerItem = {
      id: `bm-${Date.now()}`,
      ...newManager,
    };
    setBuildingManagers((prev) => [managerItem, ...prev]);
    showToast(
      `✓ Gestionnaire de Bâtiment "${newManager.fullName}" nommé avec succès pour le ${newManager.assignedBuildingName}.`
    );
  };

  // 3. Building Manager Action: Add Resident
  const handleAddResident = (newResident: any) => {
    const residentItem = {
      id: `res-${Date.now()}`,
      fullName: newResident.fullName,
      type: newResident.occupantType,
      apartment: `${newResident.buildingName.replace('Bâtiment ', '')} - ${newResident.number}`,
      floor: newResident.floor,
      phone: newResident.phone,
      email: newResident.email || 'resident@citeconnect.dz',
      joinedDate: newResident.joinedDate,
      balance: newResident.balance,
      status: newResident.status,
    };

    setResidentsList((prev) => [residentItem, ...prev]);

    // Also update apartments state
    const aptItem = {
      id: `apt-${Date.now()}`,
      buildingId: newResident.buildingId,
      buildingName: newResident.buildingName,
      number: newResident.number,
      floor: newResident.floor,
      type: newResident.type,
      occupantName: newResident.fullName,
      phone: newResident.phone,
      monthlyCharge: newResident.monthlyCharge,
      balance: 0,
      status: 'UP_TO_DATE',
    };
    setApartments((prev) => [aptItem, ...prev]);

    showToast(
      `✓ Résident "${newResident.fullName}" inscrit avec succès au logement ${newResident.number} (${newResident.buildingName}).`
    );
  };

  const handleRecordPayment = (newPay: any) => {
    const payItem = {
      id: `pay-${Date.now()}`,
      receiptNumber: `REC-2026-${String(payments.length + 483).padStart(5, '0')}`,
      apartment: newPay.apartment,
      resident: newPay.resident,
      amount: newPay.amount,
      period: newPay.period,
      method: newPay.method,
      date: 'À l’instant',
      reference: newPay.reference,
      status: 'VALIDATED',
    };

    setPayments([payItem, ...payments]);

    // Reduce debt
    setUnpaidDebts((prev) =>
      prev.filter((d) => !d.apartmentNumber.includes(newPay.apartment))
    );

    showToast(`✓ Paiement de ${newPay.amount.toLocaleString()} DZD enregistré avec succès (${payItem.receiptNumber})`);
  };

  const handleReportIncident = (newInc: any) => {
    const incItem = {
      id: `inc-${Date.now()}`,
      title: newInc.title,
      type: newInc.type,
      building: newInc.building,
      apartment: 'Parties communes',
      reporter: newInc.reporter,
      priority: newInc.priority,
      status: 'REPORTED',
      date: 'À l’instant',
    };

    setIncidents([incItem, ...incidents]);
    showToast(`✓ Panne enregistrée : ${newInc.title} transmise aux équipes techniques.`);
  };

  const handleGenerateMonthlyCharges = () => {
    showToast('✓ Charges de Mars 2026 calculées et imputées aux 480 appartements avec succès.');
  };

  const handleQuickAction = (action: 'PAYMENT' | 'INCIDENT' | 'RESIDENT' | 'EXPENSE' | 'BUILDING' | 'BUILDING_MANAGER') => {
    if (action === 'PAYMENT') setIsPaymentModalOpen(true);
    if (action === 'INCIDENT') setIsIncidentModalOpen(true);
    if (action === 'BUILDING') setIsAddBuildingModalOpen(true);
    if (action === 'BUILDING_MANAGER') setIsAddBuildingManagerModalOpen(true);
    if (action === 'RESIDENT') setIsAddResidentModalOpen(true);
    if (action === 'EXPENSE') setActiveTab('finances');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-zinc-900 flex selection:bg-zinc-900 selection:text-white">
      {/* 1. Left Sidebar Navigation */}
      <ManagerSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentRole={currentRole}
        badgeCounts={{
          unpaid: unpaidDebts.length,
          incidents: incidents.filter((i) => i.status !== 'RESOLVED').length,
          maintenance: mockEquipment.filter((e) => e.status !== 'OPERATIONAL').length,
          tasks: mockTasks.filter((t) => t.status !== 'COMPLETED').length,
        }}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          selectedResidenceId={selectedResidenceId}
          onResidenceChange={setSelectedResidenceId}
          residences={mockResidences}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onQuickAction={handleQuickAction}
        />

        {/* Dynamic Toast Alert */}
        {notificationToast && (
          <div className="sticky top-16 z-50 px-6 py-2.5 bg-zinc-900 text-white text-xs font-bold flex items-center justify-between shadow-md border-b border-zinc-800 animate-in slide-in-from-top-2">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              {notificationToast}
            </span>
            <button onClick={() => setNotificationToast(null)} className="text-zinc-400 hover:text-white p-1">
              ✕
            </button>
          </div>
        )}

        {/* View Router */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={setActiveTab}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              onOpenIncidentModal={() => setIsIncidentModalOpen(true)}
              buildings={buildings}
            />
          )}

          {activeTab === 'residences' && (
            <ResidencesView
              residences={mockResidences}
              buildings={buildings}
              apartments={apartments}
              buildingManagers={buildingManagers}
              currentRole={currentRole}
              onOpenAddResidence={() => showToast('Formulaire de création de résidence')}
              onOpenAddBuilding={() => setIsAddBuildingModalOpen(true)}
              onOpenAddApartment={() => showToast('Formulaire d’ajout de logement')}
              onOpenAddBuildingManager={() => setIsAddBuildingManagerModalOpen(true)}
            />
          )}

          {activeTab === 'residents' && (
            <ResidentsView
              apartments={apartments}
              residentsList={residentsList}
              currentRole={currentRole}
              onOpenAddResident={() => setIsAddResidentModalOpen(true)}
            />
          )}

          {activeTab === 'finances' && (
            <FinancesView
              payments={payments}
              unpaidDebts={unpaidDebts}
              expenses={mockExpenses}
              bills={mockBills}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              onGenerateMonthlyCharges={handleGenerateMonthlyCharges}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceView
              incidents={incidents}
              equipment={mockEquipment}
              onOpenIncidentModal={() => setIsIncidentModalOpen(true)}
            />
          )}

          {activeTab === 'staff' && (
            <StaffView staff={mockStaff} tasks={mockTasks} />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementsView announcements={mockAnnouncements} />
          )}

          {activeTab === 'documents' && (
            <DocumentsView documents={mockDocuments} />
          )}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Role Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handleRecordPayment}
        apartments={apartments}
      />

      <IncidentModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        onSuccess={handleReportIncident}
        buildings={buildings}
      />

      {/* Residence Manager Modal: Add Batiment */}
      <AddBuildingModal
        isOpen={isAddBuildingModalOpen}
        onClose={() => setIsAddBuildingModalOpen(false)}
        onSuccess={handleAddBuilding}
      />

      {/* Residence Manager Modal: Add Building Manager */}
      <AddBuildingManagerModal
        isOpen={isAddBuildingManagerModalOpen}
        onClose={() => setIsAddBuildingManagerModalOpen(false)}
        onSuccess={handleAddBuildingManager}
        buildings={buildings}
      />

      {/* Building Manager Modal: Add Resident */}
      <AddResidentModal
        isOpen={isAddResidentModalOpen}
        onClose={() => setIsAddResidentModalOpen(false)}
        onSuccess={handleAddResident}
        buildings={buildings}
        defaultBuildingId="b-1"
      />
    </div>
  );
}
