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
  Mail,
  CheckCircle2,
  Lock,
  Globe,
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
      name: 'John Doe',
      email: 'john@acme.com',
      role: 'OWNER',
      mfaEnabled: true,
      joinedAt: 'Jan 15, 2026',
    },
    {
      id: 'm2',
      name: 'Sarah Connor',
      email: 'sarah@acme.com',
      role: 'ADMIN',
      mfaEnabled: true,
      joinedAt: 'Feb 02, 2026',
    },
    {
      id: 'm3',
      name: 'Alex Rivera',
      email: 'alex@acme.com',
      role: 'MEMBER',
      mfaEnabled: false,
      joinedAt: 'Feb 19, 2026',
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
        joinedAt: 'Just now (Invited)',
      },
    ]);

    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-indigo-400" />
            <h1 className="text-sm font-bold text-white tracking-wide">ORGANIZATION ADMIN: Acme Global Corp</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-medium">
            Active Tenant ID: org_8829a
          </span>
        </div>
      </header>

      {/* Admin Shell with Sidebar Tabs */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 space-y-1.5">
          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'members'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            Team Members
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Building2 className="h-4 w-4" />
            General Settings
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'billing'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Plans & Billing
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Shield className="h-4 w-4" />
            Tenant Security
          </button>
        </aside>

        {/* Content Body */}
        <section className="flex-1 space-y-6">
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white">Team & Access Management</h2>
                  <p className="text-xs text-slate-400">Invite, configure roles, and manage tenant members.</p>
                </div>

                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Invite Member
                </button>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 font-semibold">User</th>
                      <th className="py-3 px-4 font-semibold">Role</th>
                      <th className="py-3 px-4 font-semibold">2FA Security</th>
                      <th className="py-3 px-4 font-semibold">Joined</th>
                      <th className="py-3 px-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-100">{member.name}</div>
                          <div className="text-[11px] text-slate-400">{member.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              member.role === 'OWNER'
                                ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                                : member.role === 'ADMIN'
                                  ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                                  : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {member.mfaEnabled ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> Enabled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                              Not Configured
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{member.joinedAt}</td>
                        <td className="py-3.5 px-4 text-right">
                          {member.role !== 'OWNER' && (
                            <button
                              onClick={() => setMembers(members.filter((m) => m.id !== member.id))}
                              className="p-1 rounded hover:bg-red-950/50 text-slate-500 hover:text-red-400 transition"
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
            <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-white">General Organization Settings</h2>
                <p className="text-xs text-slate-400">Configure organization profile and routing identity.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Organization Name</label>
                  <input
                    type="text"
                    defaultValue="Acme Global Corp"
                    className="w-full h-10 rounded-xl bg-slate-900 border border-slate-800 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Organization Slug (Subdomain)</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      defaultValue="acme-global"
                      className="w-full h-10 rounded-l-xl bg-slate-900 border border-slate-800 px-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <span className="h-10 px-3 flex items-center bg-slate-950 border border-l-0 border-slate-800 rounded-r-xl text-xs text-slate-500 font-mono">
                      .platform.io
                    </span>
                  </div>
                </div>

                <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Current Subscription Plan</h2>
                  <p className="text-xs text-slate-400">Manage billing tier and payment methods.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800/40 text-xs font-bold">
                  PRO TIER
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-white">$49.00 / month</p>
                  <p className="text-xs text-slate-400">Renews on March 15, 2026 via Stripe</p>
                </div>
                <button className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition">
                  Manage Stripe Portal
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-white">Tenant Security & Compliance Policies</h2>
                <p className="text-xs text-slate-400">Enforce security standards across all team members.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-200">Mandate Two-Factor Authentication (2FA)</p>
                    <p className="text-[11px] text-slate-400">All members must configure TOTP before accessing workspace data.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-blue-600" />
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-200">Allowed Domain Email Whitelist</p>
                    <p className="text-[11px] text-slate-400">Only users with @acme.com can accept invitations.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-blue-600" />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md glass-card rounded-2xl border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Invite New Team Member</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="colleague@acme.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-10 rounded-xl bg-slate-900 border border-slate-800 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'ADMIN' | 'MEMBER' | 'GUEST')}
                  className="w-full h-10 rounded-xl bg-slate-900 border border-slate-800 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="MEMBER">MEMBER (Standard Access)</option>
                  <option value="ADMIN">ADMIN (Member & Setting Control)</option>
                  <option value="GUEST">GUEST (Read-Only)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
