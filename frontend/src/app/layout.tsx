import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cité Connect | Gestion Immobilière & Copropriétés',
  description: 'Plateforme moderne et professionnelle de gestion des résidences, charges communes, pannes et copropriétaires.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-[#faf9f6] text-zinc-900 antialiased selection:bg-zinc-950 selection:text-white">
        {children}
      </body>
    </html>
  );
}
