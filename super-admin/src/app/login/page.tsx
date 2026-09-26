'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight } from 'lucide-react';

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Submit to /api/v1/auth/super-admin/login
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/';
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06080d] p-4 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel rounded-2xl border border-slate-800/80 p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Super Admin Portal</h1>
          <p className="text-xs text-slate-400">Isolated administrative domain. Hardware MFA enforced.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Root Administrator Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@platform.io"
                className="w-full h-10 rounded-lg bg-slate-900/80 border border-slate-700/80 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Master Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 rounded-lg bg-slate-900/80 border border-slate-700/80 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">6-Digit TOTP / Hardware Code</label>
              <span className="text-[10px] text-indigo-400 font-mono">RFC 6238</span>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="999999"
                className="w-full h-10 rounded-lg bg-slate-900/80 border border-slate-700/80 pl-9 pr-3 text-sm text-slate-200 font-mono tracking-widest placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-60"
          >
            {isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter Realm'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800 text-center">
          <span className="text-[11px] text-slate-500 font-mono">
            IP: 127.0.0.1 • TLS 1.3 Strict Encrypted
          </span>
        </div>
      </div>
    </div>
  );
}
