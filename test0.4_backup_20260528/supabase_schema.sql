-- World Skin 0.4 — Supabase Schema
-- Paste into Supabase → SQL Editor → Run

-- ── Zones ─────────────────────────────────────────────────────────────────────
create table if not exists zones (
  id               text    primary key,
  label            text    not null,
  type             text    not null,
  center_lat       float8  not null,
  center_lng       float8  not null,
  radius           int4    not null,
  noise_min        float4  not null,
  noise_max        float4  not null,
  turbulence_min   float4  not null,
  turbulence_max   float4  not null,
  mobility         jsonb   not null default '{}',
  words            jsonb   not null default '[]',
  hours            jsonb   not null default '[]'
);

-- ── Corridors ─────────────────────────────────────────────────────────────────
create table if not exists corridors (
  id               text    primary key,
  label            text    not null,
  type             text    not null,
  points           jsonb   not null default '[]',
  width            int4    not null,
  noise_min        float4  not null,
  noise_max        float4  not null,
  turbulence_min   float4  not null,
  turbulence_max   float4  not null,
  mobility         jsonb   not null default '{}',
  words            jsonb   not null default '[]',
  hours            jsonb   not null default '[]'
);

-- ── Voids ─────────────────────────────────────────────────────────────────────
create table if not exists voids (
  id               text    primary key,
  center_lat       float8  not null,
  center_lng       float8  not null,
  radius           int4    not null
);

-- ── Records ───────────────────────────────────────────────────────────────────
create table if not exists records (
  id               text        primary key,
  user_id          text,
  device_id        text,
  record_type      text        not null default 'world',  -- 'world' | 'personal'
  lat              float8      not null,
  lng              float8      not null,
  timestamp        timestamptz,
  hour             int2,
  weekday          int2,
  noise_level      float4,
  turbulence       float4,
  peak             float4,
  mobility         text,
  direction        float4,
  duration         int2,
  word             text,
  selected_words   jsonb       default '[]',
  sense_vector     jsonb       default '{}',
  sound_vector     jsonb       default '{}',
  trust_score      float4,
  zone_id          text,
  source           text,
  noise            float4,
  flux             float4,
  movement         text,
  distance         float4,
  slot             text,
  created_at       timestamptz default now()
);

create index if not exists records_type_idx      on records (record_type);
create index if not exists records_device_id_idx on records (device_id) where record_type = 'personal';

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table zones      enable row level security;
alter table corridors  enable row level security;
alter table voids      enable row level security;
alter table records    enable row level security;

-- Public read (anon key is enough)
create policy "public read zones"      on zones      for select using (true);
create policy "public read corridors"  on corridors  for select using (true);
create policy "public read voids"      on voids      for select using (true);
create policy "public read records"    on records    for select using (true);

-- Personal records: any client can insert/delete rows with record_type = 'personal'
create policy "personal record insert" on records for insert with check (record_type = 'personal');
create policy "personal record delete" on records for delete using (record_type = 'personal');
