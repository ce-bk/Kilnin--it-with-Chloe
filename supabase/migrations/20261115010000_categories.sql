-- Group pieces by category (type of object) instead of design/collection.
-- Each piece keeps its own link to a portfolio piece for its photo.
-- The designs table and items.design_id are kept for history but no longer used by the app.

create table public.categories (
  id    text primary key,           -- slug, e.g. 'cups-mugs'
  name  text not null,
  sort  int not null default 0
);

insert into public.categories (id, name, sort) values
  ('lamps',          'Lamps',            10),
  ('candle-holders', 'Candle holders',   20),
  ('cups-mugs',      'Cups & mugs',      30),
  ('bowls',          'Bowls',            40),
  ('plates',         'Plates',           50),
  ('cake-stands',    'Cake stands',      60),
  ('jugs',           'Jugs',             70),
  ('serving',        'Serving',          80),
  ('vases-vessels',  'Vases & vessels',  90),
  ('kitchen',        'Kitchen tools',   100),
  ('soap-dishes',    'Soap dishes',     110),
  ('page-holders',   'Page holders',    120),
  ('other',          'Other',           999);

alter table public.items add column category_id text references public.categories(id);
alter table public.items add column site_piece_id text;  -- id in src/data/pieces.ts, for the photo
alter table public.items alter column design_id drop not null;

update public.items i set site_piece_id = d.site_piece_id
from public.designs d where d.id = i.design_id;

update public.items set category_id = case design_id
  when 'lamps'        then 'lamps'
  when 'vela'         then 'candle-holders'
  when 'moss'         then 'cups-mugs'
  when 'blue-stripe'  then 'cups-mugs'
  when 'sap-cups'     then 'cups-mugs'
  when 'cortados'     then 'cups-mugs'
  when 'cloud-cup'    then 'cups-mugs'
  when 'geometric'    then 'bowls'
  when 'off-the-hump' then 'jugs'
  when 'cake-stand'   then 'cake-stands'
  when 'waves'        then 'plates'
  when 'blue'         then 'bowls'
  when 'fondue'       then 'serving'
  when 'jugs'         then 'jugs'
  when 'squeezer'     then 'kitchen'
  when 'noche'        then 'vases-vessels'
  when 'soap'         then 'soap-dishes'
  when 'page-holder'  then 'page-holders'
  when 'plants'       then 'vases-vessels'
  when 'vessel'       then 'vases-vessels'
  when 'guac-bowl'      then 'bowls'
  when 'margarita-cups' then 'cups-mugs'
  else 'other'
end;

alter table public.items alter column category_id set default 'other';
alter table public.items alter column category_id set not null;
create index items_category_idx on public.items (category_id);

alter table public.categories enable row level security;
create policy "owner full access" on public.categories for all to authenticated using (true) with check (true);
revoke all on public.categories from anon;
grant select, insert, update, delete on public.categories to authenticated;
