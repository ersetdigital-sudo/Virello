import React from 'react';
import Link from 'next/link';

const TONES: Record<string, string> = {
  emerald: 'bg-[#e7f6f0] text-[#0e7a56] before:bg-[#12805c]',
  gray: 'bg-[#ececf0] text-[#5c5c66] before:bg-[#9a9aa4]',
  amber: 'bg-[#fdf3e6] text-[#b45309] before:bg-[#d97706]',
  violet: 'bg-[#f5f0ff] text-[#6d28d9] before:bg-[#7c3aed]',
  blue: 'bg-[#eaf2fd] text-[#1d5fb5] before:bg-[#3b82f6]',
};

export function Pill({
  tone = 'gray',
  children,
}: {
  tone?: keyof typeof TONES | string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-bold uppercase tracking-[0.08em] before:h-1.5 before:w-1.5 before:rounded-full before:content-[''] ${
        TONES[tone] ?? TONES.gray
      }`}
    >
      {children}
    </span>
  );
}

export function MicroLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5c5c66]">
      {children}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-[#e7e7ec] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}
    >
      {children}
    </section>
  );
}

export function TitleRow({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {sub ? <p className="mt-1 text-sm text-[#5c5c66]">{sub}</p> : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  );
}

const BTN_BASE =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50';

const BTN_VARIANTS: Record<string, string> = {
  primary: 'bg-[#6d28d9] text-white hover:bg-[#5b21b6]',
  ghost: 'border border-[#e0e0e6] bg-white text-[#141416] hover:bg-[#f5f5f7]',
  danger: 'text-[#b23e33] hover:bg-[#fdecea]',
};

export function Btn({
  variant = 'primary',
  href,
  children,
  className = '',
  ...rest
}: {
  variant?: keyof typeof BTN_VARIANTS | string;
  href?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${BTN_BASE} ${BTN_VARIANTS[variant] ?? BTN_VARIANTS.primary} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}

export const INPUT_CLS =
  'w-full rounded-lg border border-[#e0e0e6] bg-white px-3 text-sm text-[#141416] transition-colors placeholder:text-[#9a9aa4]';

export const INPUT_H_CLS = `${INPUT_CLS} h-10`;

export function Field({
  label,
  error,
  hint,
  children,
  className = '',
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <MicroLabel>{label}</MicroLabel>
      {children}
      {hint && !error ? <p className="text-xs text-[#5c5c66]">{hint}</p> : null}
      {error ? <p className="text-xs font-medium text-[#b23e33]">{error}</p> : null}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 text-sm font-medium"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-[#6d28d9]' : 'bg-[#d8d8de]'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
      {label}
    </button>
  );
}

export function EmptyState({
  icon,
  title,
  desc,
  children,
}: {
  icon: string;
  title: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="material-symbols-outlined text-[28px] text-[#9a9aa4]">{icon}</span>
      <p className="text-sm font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-[#5c5c66]">{desc}</p>
      {children ? <div className="mt-1 flex flex-wrap justify-center gap-2">{children}</div> : null}
    </div>
  );
}

export const rp = (n: number) => `Rp${n.toLocaleString('id-ID')}`;
