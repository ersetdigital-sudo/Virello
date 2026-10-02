'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '../../services/adminApi';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: 'Main Menu',
    items: [
      { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
      { href: '/admin/products', label: 'Produk', icon: 'inventory_2' },
      { href: '/admin/categories', label: 'Kategori', icon: 'category' },
    ],
  },
  {
    group: 'Settings',
    items: [{ href: '/admin/settings', label: 'Pengaturan', icon: 'settings' }],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

const isActivePath = (pathname: string, href: string) =>
  href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

function buildCrumbs(pathname: string): string[] {
  if (pathname === '/admin') return ['Dashboard'];
  const labels: Record<string, string> = {
    products: 'Produk',
    categories: 'Kategori',
    settings: 'Pengaturan',
    baru: 'Tambah',
  };
  const parts = pathname.split('/').filter(Boolean).slice(1);
  const crumbs = ['Dashboard'];
  parts.forEach((part, i) => {
    if (labels[part]) crumbs.push(labels[part]);
    else if (i === parts.length - 1) crumbs.push('Edit');
  });
  return crumbs;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'ok' | 'checking'>('checking');
  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (isLogin) {
      setStatus('ok');
      return;
    }
    let alive = true;
    setStatus('loading');
    fetch('/api/admin/overview')
      .then((res) => {
        if (!alive) return;
        if (res.status === 401) {
          setStatus('ok');
          router.replace('/admin/login');
        } else {
          setStatus('ok');
        }
      })
      .catch(() => {
        if (!alive) return;
        setStatus('ok');
        router.replace('/admin/login');
      });
    return () => {
      alive = false;
    };
  }, [pathname, isLogin, router]);

  if (isLogin) return <>{children}</>;

  const crumbs = buildCrumbs(pathname);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace('/admin/login');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#141416]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[#e7e7ec] bg-white md:flex">
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#6d28d9] text-sm font-bold text-white">
            V
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold">Virello</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5c5c66]">
              Admin
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          {NAV_GROUPS.map((g) => (
            <div key={g.group} className="space-y-1">
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a8a94]">
                {g.group}
              </div>
              {g.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#f5f0ff] text-[#6d28d9]'
                        : 'text-[#3c3c44] hover:bg-[#f5f5f7]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 border-t border-[#e7e7ec] p-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#f5f0ff] text-xs font-bold text-[#6d28d9]">
            A
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-sm font-semibold">Admin</div>
            <div className="truncate text-[11px] text-[#5c5c66]">Administrator</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Keluar"
            className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-[#5c5c66] transition-colors hover:bg-[#fdecea] hover:text-[#b23e33]"
          >
            <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
          </button>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-[#e7e7ec] bg-white px-4 md:px-8">
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
            {crumbs.map((c, i) => (
              <React.Fragment key={`${c}-${i}`}>
                {i > 0 ? (
                  <span className="material-symbols-outlined text-[14px] text-[#9a9aa4]">
                    chevron_right
                  </span>
                ) : null}
                <span
                  className={
                    i === crumbs.length - 1
                      ? 'truncate font-semibold'
                      : 'truncate text-[#5c5c66]'
                  }
                >
                  {c}
                </span>
              </React.Fragment>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              title="Lihat situs"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[#e0e0e6] bg-white text-[#3c3c44] transition-colors hover:bg-[#f5f5f7]"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </a>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#6d28d9] text-xs font-bold text-white">
              A
            </div>
          </div>
        </header>

        <main className="px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-10">
          {status === 'loading' ? (
            <div className="flex items-center justify-center py-24 text-sm text-[#5c5c66]">
              <span className="material-symbols-outlined mr-2 animate-spin text-[18px]">
                progress_activity
              </span>
              Memuat…
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[#e7e7ec] bg-white md:hidden">
        {ALL_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors ${
                active ? 'text-[#6d28d9]' : 'text-[#5c5c66]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
