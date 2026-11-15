-- Leads: events to explore and people/places to collaborate with, before anything is booked.
-- A lead that turns into a booked event links to it (market_id).

create table public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  kind        text not null default 'collab' check (kind in ('event', 'collab')),
  type        text,                 -- e.g. Café, Florist, Community market
  status      text not null default 'idea' check (status in ('idea', 'contacted', 'talking', 'yes', 'no')),
  place       text,
  contact     text,                 -- Instagram handle, email, person's name
  link        text,
  next_step   text,
  next_date   date,                 -- follow-up, visit or application deadline
  notes       text,
  market_id   uuid references public.markets(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index leads_next_date_idx on public.leads (next_date);

alter table public.leads enable row level security;
create policy "owner full access" on public.leads for all to authenticated using (true) with check (true);
revoke all on public.leads from anon;
grant select, insert, update, delete on public.leads to authenticated;

-- A few starting points found on 15 Nov 2026. Dates come from event listings, so check them first.
insert into public.leads (name, kind, type, status, place, contact, link, next_step, next_date, notes) values
  ('Festivalet (Christmas edition)', 'event', 'Design & makers market', 'idea', 'Sant Andreu', null, null,
   'Go as a visitor. Talk to 2–3 makers and ask how they got in. Ask the organisers when spring applications open.',
   '2026-12-12', 'Listed for 12–13 Dec 2026, 70+ makers. Check the dates on their Instagram.'),
  ('Design Market (FAD)', 'event', 'Christmas design market', 'idea', 'Museu del Disseny / DHub, Glòries', null, null,
   'Visit. Note stall sizes, prices and what sells. Set a reminder to apply in late summer 2027.',
   '2026-12-11', 'Listed for 11–13 Dec 2026. The venue differs between listings.'),
  ('Lehmann Factory local design market', 'event', 'Local design & craft market', 'idea', 'Fàbrica Lehmann', null, null,
   'Visit and collect the organiser''s contact.',
   '2026-12-13', 'Listed for 13–14 Dec 2026, free entry. Check the dates.'),
  ('Palo Market Fest', 'event', 'Monthly design market', 'idea', 'Carrer dels Pellaires 30, Poblenou', 'comunicacio@paloalto.barcelona', 'https://palomarketfest.com',
   'Email to ask how to apply for a spring 2027 weekend.',
   '2026-12-01', 'First weekend of every month. Selected exhibitors, so send the application kit.');
