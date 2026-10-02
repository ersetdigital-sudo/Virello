-- Virello admin schema: categories, products, settings
create extension if not exists pgcrypto;

create table if not exists public.categories (
  id text primary key,
  label text not null,
  description text not null default '',
  icon text not null default '',
  icon_bg text not null default '',
  icon_color text not null default '',
  slug text not null,
  variant text not null default 'nominal' check (variant in ('nominal','bill')),
  input_label text not null default '',
  input_placeholder text not null default '',
  chips_title text,
  chips jsonb,
  nominal_title text,
  nominal_layout text default 'grid4',
  in_sidebar boolean not null default true,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  category text not null references public.categories(id) on delete cascade,
  filter_tab text not null default 'all',
  provider text not null default '',
  provider_badge_class text not null default '',
  provider_badge_text text not null default '',
  tag text,
  tag_color text check (tag_color in ('emerald','violet','amber','blue','gray')),
  title text not null,
  description text not null default '',
  nominal_label text,
  nominal_sub text,
  original_price int,
  price int not null,
  is_bill boolean not null default false,
  action_text text not null default 'Beli',
  popular_score int not null default 0,
  target_type text not null default 'phone',
  target_placeholder text not null default '',
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_active on public.products(is_active);

-- Lock everything from anon; backend uses service_role (bypasses RLS)
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.settings enable row level security;

insert into public.settings(key, value) values
  ('whatsapp_number', '"6281234567890"'::jsonb),
  ('whatsapp_message', '"Halo CS Virello, saya membutuhkan bantuan terkait pesanan atau layanan."'::jsonb),
  ('qris_image_url', 'null'::jsonb)
on conflict (key) do nothing;
