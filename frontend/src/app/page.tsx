'use client';

import React, { useState } from 'react';
import { ManagerSidebar, NavTab } from '../components/ManagerNavigation';
import { Header } from '../components/Header';
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
import { PaymentModal, IncidentModal } from '../components/Modals';

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
} from '../data/mockData';

export default function AppHome() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedResidenceId, setSelectedResidenceId] = useState<string>('res-1');

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  // Dynamic state
  const [payments, setPayments] = useState(mockPayments);
  const [incidents, setIncidents] = useState(mockIncidents);
  const [unpaidDebts, setUnpaidDebts] = useState(mockUnpaidDebts);
  const [apartments, setApartments] = useState(mockApartments);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => setNotificationToast(null), 4000);
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

  const handleQuickAction = (action: 'PAYMENT' | 'INCIDENT' | 'RESIDENT' | 'EXPENSE') => {
    if (action === 'PAYMENT') setIsPaymentModalOpen(true);
    if (action === 'INCIDENT') setIsIncidentModalOpen(true);
    if (action === 'RESIDENT') setActiveTab('residents');
    if (action === 'EXPENSE') setActiveTab('finances');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex">
      {/* 1. Left Sidebar Navigation */}
      <ManagerSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
          onQuickAction={handleQuickAction}
        />

        {/* Dynamic Toast Alert */}
        {notificationToast && (
          <div className="sticky top-16 z-50 px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top-2">
            <span>{notificationToast}</span>
            <button onClick={() => setNotificationToast(null)} className="text-emerald-400 hover:text-white">
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
              buildings={mockBuildings}
            />
          )}

          {activeTab === 'residences' && (
            <ResidencesView
              residences={mockResidences}
              buildings={mockBuildings}
              apartments={apartments}
              onOpenAddResidence={() => showToast('Formulaire de création de résidence')}
              onOpenAddBuilding={() => showToast('Formulaire de création de bâtiment')}
              onOpenAddApartment={() => showToast('Formulaire d’ajout de logement')}
            />
          )}

          {activeTab === 'residents' && (
            <ResidentsView
              apartments={apartments}
              onOpenAddResident={() => showToast('Formulaire d’inscription résident')}
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

      {/* Modals */}
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
        buildings={mockBuildings}
      />
    </div>
  );
}
