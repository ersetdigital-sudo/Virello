import React from 'react';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showText?: boolean;
}

const iconSizes: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-11 h-11',
  xl: 'w-14 h-14',
};

const textSizes: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

/** Shared shell: identical structure & sizing across every concept. */
const Shell: React.FC<LogoProps & { children: React.ReactNode }> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showText = true,
  children,
}) => (
  <div className={`group inline-flex items-center gap-2.5 select-none cursor-pointer ${className}`}>
    <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
      {children}
    </div>

    {showText && (
      <div className="flex items-center tracking-tight leading-none">
        <span
          className={`font-sans font-extrabold ${textSizes[size]} tracking-[-0.045em] transition-colors duration-200 ${
            variant === 'light'
              ? 'text-white'
              : 'text-[#0c0a1d] group-hover:text-[#7c3aed]'
          }`}
        >
          Virello
        </span>
      </div>
    )}
  </div>
);

/**
 * Concept A — "Vault" (live): a violet-only gradient squircle with a soft
 * top sheen, a crafted rounded white V, and the design system's signature hard
 * offset shadow. Monochrome, confident, and instantly legible from 28px up.
 */
export const LogoConceptA: React.FC<LogoProps> = (props) => (
  <Shell {...props}>
    <div className="relative w-full h-full rounded-[30%] bg-[linear-gradient(145deg,#8b5cf6_0%,#7c3aed_52%,#5b21b6_100%)] shadow-[3px_3px_0_#c4b5fd] ring-1 ring-inset ring-white/25 transition-transform duration-300 group-hover:-translate-y-0.5 flex items-center justify-center overflow-hidden">
      {/* top sheen for a soft glassy finish */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.28),transparent)]" />
      <svg
        className="relative w-[64%] h-[64%]"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4.2 5.6 12 19.4 19.8 5.6"
          stroke="#ffffff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  </Shell>
);

/**
 * Concept B — "Split": containerless precision V built from two weighted
 * strokes that stop short of each other at the apex. Duotone violet/coral,
 * brighter stops for dark backgrounds.
 */
export const LogoConceptB: React.FC<LogoProps> = ({ variant = 'dark', ...props }) => (
  <Shell variant={variant} {...props}>
    <svg
      className="relative w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vr-b-l" x1="10" y1="9" x2="22" y2="33" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={variant === 'light' ? '#a855f7' : '#7c3aed'} />
          <stop offset="100%" stopColor={variant === 'light' ? '#8b5cf6' : '#5b21b6'} />
        </linearGradient>
        <linearGradient id="vr-b-r" x1="34" y1="9" x2="24" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={variant === 'light' ? '#ff8a75' : '#fc6955'} />
          <stop offset="100%" stopColor={variant === 'light' ? '#fc6955' : '#e04e3b'} />
        </linearGradient>
      </defs>
      <path d="M11.6 11 21.4 31.6" stroke="url(#vr-b-l)" strokeWidth="6.4" strokeLinecap="round" />
      <path d="M32.4 11 23.6 29.2" stroke="url(#vr-b-r)" strokeWidth="6.4" strokeLinecap="round" />
    </svg>
  </Shell>
);

/**
 * Concept C — "Flow": stacked double-chevron implying downward motion /
 * transaction flow. Top chevron violet gradient, bottom chevron solid coral.
 */
export const LogoConceptC: React.FC<LogoProps> = (props) => (
  <Shell {...props}>
    <svg
      className="relative w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vr-c-top" x1="9" y1="10" x2="35" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <path
        d="M9 12.5 22 25.5 35 12.5"
        stroke="url(#vr-c-top)"
        strokeWidth="5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22.5 22 35.5 35 22.5"
        stroke="#fc6955"
        strokeWidth="5.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Shell>
);

/** Default logo in use: Concept A. Swap this alias to change the live brand mark. */
export const Logo: React.FC<LogoProps> = (props) => <LogoConceptA {...props} />;
