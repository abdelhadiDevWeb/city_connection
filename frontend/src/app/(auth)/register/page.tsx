'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Mail, Lock, Building, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organizationName: '',
    password: '',
  });
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
          <h1 className="text-xl font-bold tracking-tight text-zinc-950">Créer un Espace Syndic</h1>
          <p className="text-xs text-stone-500">Plateforme professionnelle de gestion des cités & copropriétés</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Prénom</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Karim"
                className="w-full h-10 rounded-xl bg-stone-50 border border-stone-300 px-3 text-xs text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Nom</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Mansouri"
                className="w-full h-10 rounded-xl bg-stone-50 border border-stone-300 px-3 text-xs text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Cabinet de Syndic / Société</label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="text"
                required
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                placeholder="SARL Syndic Al-Amel"
                className="w-full h-10 rounded-xl bg-stone-50 border border-stone-300 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Email Professionnel</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@alamel-syndic.dz"
                className="w-full h-10 rounded-xl bg-stone-50 border border-stone-300 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Mot de Passe Principal</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full h-10 rounded-xl bg-stone-50 border border-stone-300 pl-9 pr-3 text-xs text-zinc-900 placeholder:text-stone-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-xl pro-button-primary font-semibold text-xs flex items-center justify-center gap-2 transition disabled:opacity-60 pt-1"
          >
            {loading ? 'Création en cours...' : 'Créer l’Espace Syndic'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="text-zinc-900 font-semibold hover:underline underline-offset-4">
            Se Connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
