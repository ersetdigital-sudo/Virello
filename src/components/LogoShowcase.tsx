import React from 'react';
import { LogoConceptA, LogoConceptB, LogoConceptC, LogoProps } from './Logo';

const sizes: NonNullable<LogoProps['size']>[] = ['sm', 'md', 'lg', 'xl'];

const concepts: { label: string; Component: React.FC<LogoProps> }[] = [
  { label: 'Concept A — Vault', Component: LogoConceptA },
  { label: 'Concept B — Split', Component: LogoConceptB },
  { label: 'Concept C — Flow', Component: LogoConceptC },
];

/** Temporary comparison sheet for picking the new brand mark. */
export const LogoShowcase: React.FC = () => {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="font-sora text-2xl font-extrabold text-gray-900">Logo Concepts</h1>

      {concepts.map(({ label, Component }) => (
        <div key={label} className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6d28d9] font-sora">
            {label}
          </span>

          {/* Light surface */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-wrap items-end gap-8">
            {sizes.map((size) => (
              <Component key={size} size={size} />
            ))}
            <Component size="lg" showText={false} />
          </div>

          {/* Dark surface */}
          <div className="bg-[#320b6e] rounded-2xl p-6 flex flex-wrap items-end gap-8">
            {sizes.map((size) => (
              <Component key={size} size={size} variant="light" />
            ))}
            <Component size="lg" variant="light" showText={false} />
          </div>

          {/* In-header context (matches the real sticky header) */}
          <div className="bg-white/90 border border-gray-200 rounded-2xl">
            <div className="max-w-[1280px] h-20 px-6 flex items-center justify-between gap-6 rounded-2xl bg-white/90 border-b border-[#e4e1e7]/70">
              <Component size="md" />
              <nav className="flex items-center gap-4 text-sm font-medium text-gray-600">
                <span className="px-3 py-1.5 rounded-lg text-[#6d28d9] font-bold bg-[#f5f0ff]">
                  Katalog
                </span>
                <span className="px-3 py-1.5">Promo</span>
                <span className="px-3 py-1.5">Cek Pesanan</span>
              </nav>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
