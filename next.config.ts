import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The original Vite app rendered without React StrictMode; keep effects
  // (scroll handlers, title sync, keyboard shortcuts) firing exactly once.
  reactStrictMode: false,
};

export default nextConfig;
