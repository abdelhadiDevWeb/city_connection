'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AnnouncementsView } from '../../components/views/AnnouncementsView';
import { mockAnnouncements } from '../../data/mockData';

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au Tableau de Bord</span>
        </Link>
      </div>

      <AnnouncementsView announcements={mockAnnouncements} />
    </div>
  );
}
