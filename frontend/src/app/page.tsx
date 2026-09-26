'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Settings,
  Bell,
  Sparkles,
  TrendingUp,
  Cpu,
  Database,
  ArrowUpRight,
  Shield,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white">APEX PLATFORM</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Active Tenant Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-slate-300 font-medium">Acme Global Corp</span>
            <span className="text-[10px] text-blue-400 font-bold px-1.5 py-0.2 rounded bg-blue-950 border border-blue-800/40">PRO</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 transition-all shadow-sm"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Organization Admin</span>
          </Link>

          <button className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200">
            <Bell className="h-4 w-4" />
          </button>

          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
            JD
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/20 border border-blue-900/30 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full-Stack SaaS Setup Initialized</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome to your Workspace Dashboard
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Powered by Next.js 15, Bun high-throughput backend, MongoDB multi-tenant logical partitioning, and React Native Expo mobile sync.
            </p>
          </div>

          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-3">
            <div className="p-4 rounded-xl glass-card text-center space-y-1 border border-blue-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Super Admin Port</span>
              <p className="text-lg font-mono font-bold text-indigo-400">:3001</p>
            </div>
            <div className="p-4 rounded-xl glass-card text-center space-y-1 border border-blue-500/20">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Bun Core API</span>
              <p className="text-lg font-mono font-bold text-emerald-400">:4000</p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card space-y-4 hover:border-blue-500/40 transition-all group">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Settings className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-white">Tenant Administration</h3>
              <p className="text-xs text-slate-400">
                Manage organization memberships, invite coworkers, configure billing plans, and set MFA requirements.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              Open Org Admin Portal <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4 hover:border-purple-500/40 transition-all group">
            <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-white">Zero-Trust Security</h3>
              <p className="text-xs text-slate-400">
                Argon2id password hashing, Ed25519 asymmetric token verification, and strict NoSQL injection guards.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> All security guards operational
            </span>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4 hover:border-emerald-500/40 transition-all group">
            <div className="h-10 w-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-white">Mobile Sync (Expo SDK 52)</h3>
              <p className="text-xs text-slate-400">
                Native React Native app with biometric login, offline caching, and cross-platform push notifications.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Located in: apps/application</span>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="p-6 rounded-2xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-white">Workspace Resource Utilization</h3>
              <p className="text-xs text-slate-400">Live metrics collected from Bun backend & MongoDB</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Refreshed 5s ago</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Monthly API Calls</span>
              <p className="text-xl font-bold font-mono text-white">41,290 / 100k</p>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="w-[41%] h-full bg-blue-500 rounded-full" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Database Storage</span>
              <p className="text-xl font-bold font-mono text-white">142 MB / 1 GB</p>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="w-[14%] h-full bg-emerald-500 rounded-full" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Active Team Members</span>
              <p className="text-xl font-bold font-mono text-white">12 Seats</p>
              <p className="text-[11px] text-slate-400">Owner + 3 Admins + 8 Members</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Security Score</span>
              <p className="text-xl font-bold font-mono text-emerald-400">100 / 100</p>
              <p className="text-[11px] text-emerald-400">MFA & IP Shield Active</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
