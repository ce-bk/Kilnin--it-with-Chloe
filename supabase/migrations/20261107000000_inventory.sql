-- Inventory and sales for Kilnin' it.
-- designs: a design/collection (maps to a portfolio piece on the site where one exists)
-- items:   one row per sellable unit (a set sold together is one row)
-- sales:   one row per sale; inserting a sale marks the item sold, deleting it (undo) makes it available again
--
-- Access: only signed-in users. Public sign-ups must be DISABLED in the Supabase dashboard,
-- so the only signed-in user is the owner. Stage 2 will add public read access for the gallery.

create table public.designs (
  id            text primary key,              -- slug, e.g. 'cake-stand'
  name          text not null,
  site_piece_id text,                          -- id in src/data/pieces.ts, if the design is on the site
  created_at    timestamptz not null default now()
);

create table public.items (
  id          uuid primary key default gen_random_uuid(),
  design_id   text not null references public.designs(id),
  label       text not null,
  price_eur   numeric(8,2) check (price_eur >= 0),
  going       boolean not null default true,   -- taken to the next market
  status      text not null default 'available'
              check (status in ('available', 'sold', 'not_for_sale')),
  notes       text,
  sort        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.sales (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid not null references public.items(id) on delete restrict,
  price_eur   numeric(8,2) not null check (price_eur >= 0),
  method      text not null check (method in ('cash', 'bizum', 'card', 'other')),
  channel     text not null default 'market' check (channel in ('market', 'online', 'direct')),
  event       text,                            -- e.g. 'market-2026-11-28'
  sold_at     timestamptz not null default now(),
  notes       text
);

-- An item can only be sold once (also stops double taps at the stall).
create unique index sales_one_per_item on public.sales (item_id);
create index items_design_idx on public.items (design_id);

create or replace function public.sync_item_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.items set status = 'sold', updated_at = now() where id = new.item_id;
    return new;
  else
    update public.items set status = 'available', updated_at = now()
      where id = old.item_id and status = 'sold';
    return old;
  end if;
end;
$$;

create trigger sales_sync_item
after insert or delete on public.sales
for each row execute function public.sync_item_status();

-- Row level security: signed-in owner only.
alter table public.designs enable row level security;
alter table public.items   enable row level security;
alter table public.sales   enable row level security;

create policy "owner full access" on public.designs for all to authenticated using (true) with check (true);
create policy "owner full access" on public.items   for all to authenticated using (true) with check (true);
create policy "owner full access" on public.sales   for all to authenticated using (true) with check (true);

revoke all on public.designs, public.items, public.sales from anon;
grant select, insert, update, delete on public.designs, public.items, public.sales to authenticated;
