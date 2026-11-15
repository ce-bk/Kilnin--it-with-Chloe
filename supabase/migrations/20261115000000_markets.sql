-- Markets become first-class events. One inventory (items); a market has a packing list
-- (market_items) and sales made there point at it (sales.market_id).
-- Sales outside a market use channel 'direct' or 'online' with no market_id.

create table public.markets (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  date        date not null,
  location    text,
  goal_eur    numeric(8,2) check (goal_eur >= 0),
  created_at  timestamptz not null default now()
);

create table public.market_items (
  market_id  uuid not null references public.markets(id) on delete cascade,
  item_id    uuid not null references public.items(id) on delete cascade,
  primary key (market_id, item_id)
);

alter table public.sales add column market_id uuid references public.markets(id) on delete set null;
create index sales_market_idx on public.sales (market_id);
create index markets_date_idx on public.markets (date);

-- Carry over the first market: its packing list was items.going, its sales used event text.
with m as (
  insert into public.markets (name, date, goal_eur)
  values ('Market', '2026-11-28', 135)
  returning id
)
, packed as (
  insert into public.market_items (market_id, item_id)
  select m.id, i.id from m, public.items i
  where i.going and i.status <> 'not_for_sale'
)
update public.sales s set market_id = m.id
from m where s.event = 'market-2026-11-28';

-- Same access rules as the other tables: signed-in owner only.
alter table public.markets      enable row level security;
alter table public.market_items enable row level security;

create policy "owner full access" on public.markets      for all to authenticated using (true) with check (true);
create policy "owner full access" on public.market_items for all to authenticated using (true) with check (true);

revoke all on public.markets, public.market_items from anon;
grant select, insert, update, delete on public.markets, public.market_items to authenticated;
