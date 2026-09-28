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
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/';
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center creamy-bg p-4 relative overflow-hidden text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
      {/* Background warm aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md gradient-card-creamy-elevated rounded-2xl border border-stone-300/90 p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white shadow-xl shadow-black/20">
            <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-zinc-950 uppercase gradient-text-dark">
            CITÉ CONNECT SUPER ADMIN
          </h1>
          <p className="text-xs text-stone-600 font-medium">
            Console Centrale de Supervision & Caisse Espèces
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-medium">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-900">Email Administrateur Principal</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@citeconnect.dz"
                className="w-full h-10 rounded-lg bg-white border border-stone-300 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-black transition-colors font-semibold shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-900">Mot de Passe Maître</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 rounded-lg bg-white border border-stone-300 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-black transition-colors font-semibold shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900">Code de Sécurité (TOTP 6 Chiffres)</label>
              <span className="text-[10px] text-stone-500 font-mono font-bold">Double Facteur</span>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                required
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="999999"
                className="w-full h-10 rounded-lg bg-white border border-stone-300 pl-9 pr-3 text-sm text-zinc-900 font-mono font-black tracking-widest placeholder:text-stone-400 focus:outline-none focus:border-black transition-colors shadow-2xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-lg gradient-button-black text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60"
          >
            {isLoading ? 'Connexion en cours...' : 'Accéder à la Console Super Admin'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-stone-200 text-center">
          <span className="text-[11px] text-stone-500 font-mono font-semibold">
            Plateforme Cité Connect • Réglement Espèces & Gestion Hiérarchique
          </span>
        </div>
      </div>
    </div>
  );
}
