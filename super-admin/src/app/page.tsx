'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Server,
  Building2,
  Users,
  DollarSign,
  Activity,
  Search,
  Lock,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'tenants' | 'audit' | 'security'>('tenants');

  const mockTenants = [
    {
      id: 'org_1',
      name: 'Acme Global Corp',
      slug: 'acme-global',
      plan: 'ENTERPRISE',
      usersCount: 248,
      status: 'ACTIVE',
      mrr: '$1,299',
      createdAt: '2026-01-14',
    },
    {
      id: 'org_2',
      name: 'CyberShield Systems',
      slug: 'cybershield',
      plan: 'PRO',
      usersCount: 42,
      status: 'ACTIVE',
      mrr: '$499',
      createdAt: '2026-02-03',
    },
    {
      id: 'org_3',
      name: 'Nexus Quantum Tech',
      slug: 'nexus-quantum',
      plan: 'STARTER',
      usersCount: 8,
      status: 'ACTIVE',
      mrr: '$99',
      createdAt: '2026-02-18',
    },
    {
      id: 'org_4',
      name: 'Solaris Cloud Labs',
      slug: 'solaris-labs',
      plan: 'FREE',
      usersCount: 3,
      status: 'PENDING_REVIEW',
      mrr: '$0',
      createdAt: '2026-03-01',
    },
  ];

  const mockAuditLogs = [
    {
      id: 'log_01',
      action: 'TENANT_PROVISIONED',
      actor: 'root@admin.saas.com',
      ip: '192.168.1.42',
      time: '2 mins ago',
      status: 'SUCCESS',
    },
    {
      id: 'log_02',
      action: 'RATE_LIMIT_BLOCKED',
      actor: '185.220.101.5 (Tor Exit)',
      ip: '185.220.101.5',
      time: '14 mins ago',
      status: 'WARN',
    },
    {
      id: 'log_03',
      action: 'MFA_DEVICE_ENROLLED',
      actor: 'security@cybershield.io',
      ip: '10.0.4.12',
      time: '45 mins ago',
      status: 'SUCCESS',
    },
    {
      id: 'log_04',
      action: 'PLAN_UPGRADE_PRO',
      actor: 'billing@acme.com',
      ip: '54.210.88.19',
      time: '1 hour ago',
      status: 'SUCCESS',
    },
  ];

  const filteredTenants = mockTenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#06080d]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#0a0d14]/90 p-5 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-lg shadow-indigo-500/25">
              <ShieldAlert className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase">SUPER ADMIN</h1>
              <span className="text-xs text-indigo-400 font-mono">ROOT REALM v1.0</span>
            </div>
          </div>

          <div className="rounded-lg bg-indigo-950/30 border border-indigo-500/20 p-2.5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Zero-Trust Active
            </span>
            <span className="font-mono text-slate-400 text-[10px]">ED25519</span>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setSelectedTab('tenants')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedTab === 'tenants'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4" />
                <span>Tenants Directory</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setSelectedTab('audit')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedTab === 'audit'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4" />
                <span>Audit & Events</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setSelectedTab('security')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedTab === 'security'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4" />
                <span>Security Policies</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400">
              SA
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-200">root@platform.io</p>
              <p className="text-slate-500 font-mono text-[10px]">Session: 2h remaining</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0a0d14]/50 backdrop-blur px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold text-slate-100">Super Administrator Console</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Bun Core API Connected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">Cluster: us-east-1a</span>
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 space-y-8 max-w-7xl">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl glass-panel space-y-2 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs uppercase tracking-wider font-semibold">Active Tenants</span>
                <Building2 className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 font-mono">1,482</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <span>+12.4% this month</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel space-y-2 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs uppercase tracking-wider font-semibold">Platform MRR</span>
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 font-mono">$184,320</div>
              <div className="text-xs text-emerald-400 font-medium">+8.2% from upgrades</div>
            </div>

            <div className="p-5 rounded-2xl glass-panel space-y-2 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs uppercase tracking-wider font-semibold">Threats Mitigated</span>
                <ShieldAlert className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 font-mono">4,819</div>
              <div className="text-xs text-slate-400 font-medium">NoSQL injections: 0 breached</div>
            </div>

            <div className="p-5 rounded-2xl glass-panel space-y-2 border border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs uppercase tracking-wider font-semibold">API Throughput</span>
                <Activity className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-slate-100 font-mono">99.99%</div>
              <div className="text-xs text-emerald-400 font-medium">Avg latency: 14ms (Bun)</div>
            </div>
          </div>

          {/* Tenants Section */}
          {selectedTab === 'tenants' && (
            <div className="rounded-2xl glass-panel border border-slate-800/80 overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-100">Registered SaaS Organizations</h3>
                  <p className="text-xs text-slate-400">Global tenant registry and isolation status</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search by name or slug..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 w-64 rounded-lg bg-slate-900/80 border border-slate-700/80 pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button className="h-9 px-3 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 flex items-center gap-1.5 hover:bg-slate-800">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-5 font-semibold">Organization</th>
                      <th className="py-3 px-5 font-semibold">Plan</th>
                      <th className="py-3 px-5 font-semibold">Users</th>
                      <th className="py-3 px-5 font-semibold">MRR</th>
                      <th className="py-3 px-5 font-semibold">Status</th>
                      <th className="py-3 px-5 font-semibold">Created</th>
                      <th className="py-3 px-5 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredTenants.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-medium text-slate-100">{tenant.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{tenant.slug}</div>
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tenant.plan === 'ENTERPRISE'
                                ? 'bg-purple-950/60 text-purple-300 border border-purple-800/50'
                                : tenant.plan === 'PRO'
                                  ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/50'
                                  : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {tenant.plan}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-mono text-slate-300">{tenant.usersCount}</td>
                        <td className="py-4 px-5 font-mono font-semibold text-slate-200">{tenant.mrr}</td>
                        <td className="py-4 px-5">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {tenant.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-slate-400">{tenant.createdAt}</td>
                        <td className="py-4 px-5 text-right">
                          <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white transition text-[11px] text-slate-300 font-medium">
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit Section */}
          {selectedTab === 'audit' && (
            <div className="rounded-2xl glass-panel border border-slate-800/80 p-5 space-y-4">
              <h3 className="text-base font-semibold text-slate-100">Security & Operational Event Stream</h3>
              <div className="divide-y divide-slate-800/60 font-mono text-xs">
                {mockAuditLogs.map((log) => (
                  <div key={log.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {log.status === 'WARN' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                      <div>
                        <span className="text-slate-200 font-semibold">{log.action}</span>
                        <span className="text-slate-500 ml-2">by {log.actor}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                      <span>IP: {log.ip}</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {selectedTab === 'security' && (
            <div className="rounded-2xl glass-panel border border-slate-800/80 p-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold text-slate-100">Zero-Trust Configuration & Enforcement</h3>
                <p className="text-xs text-slate-400 mt-1">Platform-wide cryptographic and isolation gates</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-200">Super Admin MFA Mandate</span>
                    <span className="text-xs text-emerald-400 font-semibold">ENFORCED (RFC 6238)</span>
                  </div>
                  <p className="text-xs text-slate-400">All root administration accounts require TOTP / FIDO2 keys.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-200">NoSQL Injection Firewall</span>
                    <span className="text-xs text-emerald-400 font-semibold">ACTIVE (Zod Filter)</span>
                  </div>
                  <p className="text-xs text-slate-400">All operators prefixed with $ are automatically stripped at gateway.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
