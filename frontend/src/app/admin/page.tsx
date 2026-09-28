'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  CreditCard,
  Shield,
  ArrowLeft,
  UserPlus,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export default function OrganizationAdminPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'settings' | 'billing' | 'security'>('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER' | 'GUEST'>('MEMBER');

  const [members, setMembers] = useState([
    {
      id: 'm1',
      name: 'Abdelhadi Mansouri',
      email: 'abdelhadi@citeconnect.dz',
      role: 'OWNER',
      mfaEnabled: true,
      joinedAt: '15 Janvier 2026',
    },
    {
      id: 'm2',
      name: 'Samir Chaouche',
      email: 'samir@citeconnect.dz',
      role: 'ADMIN',
      mfaEnabled: true,
      joinedAt: '02 Février 2026',
    },
    {
      id: 'm3',
      name: 'Nadia Bensaid',
      email: 'nadia@citeconnect.dz',
      role: 'MEMBER',
      mfaEnabled: false,
      joinedAt: '19 Février 2026',
    },
  ]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setMembers([
      ...members,
      {
        id: `m${members.length + 1}`,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        mfaEnabled: false,
        joinedAt: 'À l’instant (Invité)',
      },
    ]);

    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-zinc-900 flex flex-col">
      {/* Admin Header */}
      <header className="h-16 border-b border-stone-200 bg-white/90 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-zinc-800 hover:text-black transition pro-button-secondary px-3 py-1.5 rounded-xl"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Tableau de Bord</span>
          </Link>

          <div className="h-4 w-px bg-stone-300" />

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-zinc-900" />
            <h1 className="text-sm font-bold text-zinc-950 tracking-wide">ADMINISTRATION DU SYNDIC : Cité Connect</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-300 font-mono font-medium">
            Tenant ID: org_alger_01
          </span>
        </div>
      </header>

      {/* Admin Shell with Sidebar Tabs */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 space-y-1.5">
          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
              activeTab === 'members'
                ? 'bg-zinc-950 text-white font-semibold shadow-sm'
                : 'text-stone-600 hover:bg-stone-100 hover:text-black font-medium'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Membres & Accès</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
              activeTab === 'settings'
                ? 'bg-zinc-950 text-white font-semibold shadow-sm'
                : 'text-stone-600 hover:bg-stone-100 hover:text-black font-medium'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Paramètres Organisation</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
              activeTab === 'billing'
                ? 'bg-zinc-950 text-white font-semibold shadow-sm'
                : 'text-stone-600 hover:bg-stone-100 hover:text-black font-medium'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Abonnement & Facturation</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
              activeTab === 'security'
                ? 'bg-zinc-950 text-white font-semibold shadow-sm'
                : 'text-stone-600 hover:bg-stone-100 hover:text-black font-medium'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Sécurité & Conformité</span>
          </button>
        </aside>

        {/* Content Body */}
        <section className="flex-1 space-y-6">
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="pro-card rounded-2xl p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-950">Gestion de l'Équipe Syndic</h2>
                  <p className="text-xs text-stone-500">Invitez des gestionnaires, comptables et superviseurs.</p>
                </div>

                <button
                  onClick={() => setShowInviteModal(true)}
                  className="pro-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Inviter un Membre</span>
                </button>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 font-semibold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Utilisateur</th>
                      <th className="py-3 px-4">Rôle</th>
                      <th className="py-3 px-4">Sécurité 2FA</th>
                      <th className="py-3 px-4">Inscrit</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-stone-50/80 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-zinc-950">{member.name}</div>
                          <div className="text-[11px] text-stone-500">{member.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium border bg-stone-100 text-stone-800 border-stone-200">
                            {member.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {member.mfaEnabled ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-900 font-medium">
                              <CheckCircle2 className="h-3 w-3" /> Activé
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-stone-400">
                              Non Configuré
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-stone-500">{member.joinedAt}</td>
                        <td className="py-3.5 px-4 text-right">
                          {member.role !== 'OWNER' && (
                            <button
                              onClick={() => setMembers(members.filter((m) => m.id !== member.id))}
                              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-black transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="pro-card rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-zinc-950">Paramètres Généraux du Syndic</h2>
                <p className="text-xs text-stone-500">Configurez le profil et l'adresse web de votre cabinet.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Raison Sociale</label>
                  <input
                    type="text"
                    defaultValue="Cabinet Syndic Cité Connect"
                    className="w-full h-10 rounded-xl bg-stone-50 border border-stone-300 px-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Identifiant Unique (Sous-domaine)</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      defaultValue="citeconnect-alger"
                      className="w-full h-10 rounded-l-xl bg-stone-50 border border-stone-300 px-3 text-xs text-zinc-900 font-mono focus:outline-none focus:border-zinc-900 focus:bg-white transition"
                    />
                    <span className="h-10 px-3 flex items-center bg-stone-100 border border-l-0 border-stone-300 rounded-r-xl text-xs text-stone-500 font-mono">
                      .citeconnect.dz
                    </span>
                  </div>
                </div>

                <button className="pro-button-primary px-4 py-2 rounded-xl text-xs font-semibold transition">
                  Enregistrer les Modifications
                </button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="pro-card rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-zinc-950">Formule d’Abonnement</h2>
                  <p className="text-xs text-stone-500">Gestion de la licence et des accès aux résidences.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-900 border border-stone-300 text-xs font-bold">
                  LICENCE PRO
                </span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-zinc-950">12 000 DZD / mois</p>
                  <p className="text-xs text-stone-500">Renouvellement le 15 Mars 2026</p>
                </div>
                <button className="pro-button-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold transition">
                  Gérer la Facturation
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="pro-card rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-zinc-950">Sécurité & Politiques de Conformité</h2>
                <p className="text-xs text-stone-500">Appliquez les normes de protection des données pour vos copropriétés.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-950">Exiger l'Authentification à Deux Facteurs (2FA)</p>
                    <p className="text-[11px] text-stone-500">Tous les gestionnaires doivent valider un code OTP.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-zinc-950" />
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-950">Restriction par Domaine Email</p>
                    <p className="text-[11px] text-stone-500">Seules les adresses professionnelles autorisées peuvent rejoindre l'espace.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-zinc-950" />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-950">Inviter un Nouveau Collaborateur</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-stone-400 hover:text-zinc-900 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Adresse Email</label>
                <input
                  type="email"
                  required
                  placeholder="collaborateur@citeconnect.dz"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-10 rounded-xl bg-stone-50 border border-stone-300 px-3 text-xs text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Rôle Attribué</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'ADMIN' | 'MEMBER' | 'GUEST')}
                  className="w-full h-10 rounded-xl bg-stone-50 border border-stone-300 px-3 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
                >
                  <option value="MEMBER">GESTIONNAIRE (Accès Standard)</option>
                  <option value="ADMIN">ADMINISTRATEUR (Contrôle Total)</option>
                  <option value="GUEST">CONSULTANT (Lecture Seule)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="pro-button-secondary px-4 py-2 rounded-xl text-xs font-semibold transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="pro-button-primary px-4 py-2 rounded-xl text-xs font-semibold transition"
                >
                  Envoyer l'Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
