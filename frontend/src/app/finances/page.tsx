'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FinancesView } from '../../components/views/FinancesView';
import { mockPayments, mockUnpaidDebts, mockExpenses, mockBills } from '../../data/mockData';

export default function FinancesPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-zinc-900 p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-800 hover:text-black transition pro-button-secondary px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au Tableau de Bord</span>
        </Link>
      </div>

      <FinancesView
        payments={mockPayments}
        unpaidDebts={mockUnpaidDebts}
        expenses={mockExpenses}
        bills={mockBills}
        onOpenPaymentModal={() => {}}
        onGenerateMonthlyCharges={() => {}}
      />
    </div>
  );
}
