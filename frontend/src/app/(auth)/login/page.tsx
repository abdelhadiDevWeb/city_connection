'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4">
      <div className="w-full max-w-md pro-card-elevated rounded-2xl p-8 space-y-6 bg-white">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">Connexion Cité Connect</h1>
          <p className="text-xs text-stone-500">Accédez à votre espace de gestion syndic</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Adresse Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gestionnaire@citeconnect.dz"
                className="w-full h-10 rounded-xl bg-stone-50 border border-stone-300 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-700">Mot de passe</label>
              <a href="#" className="text-[11px] text-zinc-700 hover:text-black font-semibold underline underline-offset-4">
                Mot de passe oublié ?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 rounded-xl bg-stone-50 border border-stone-300 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-xl pro-button-primary font-semibold text-xs flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {loading ? 'Authentification...' : 'Se Connecter'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500">
          Créer un compte administrateur ?{' '}
          <Link href="/register" className="text-zinc-900 font-semibold hover:underline underline-offset-4">
            Inscrire un Syndic
          </Link>
        </div>
      </div>
    </div>
  );
}
