-- A piece can have a quantity: several identical units under one entry (e.g. 6 page holders).
-- Each sale is one unit. The piece shows as sold once every unit has a sale; undoing a sale
-- makes it available again.

alter table public.items add column quantity int not null default 1 check (quantity >= 1);

-- More than one sale per piece is now allowed, up to its quantity.
drop index if exists public.sales_one_per_item;

-- Before a sale: refuse it when every unit is already sold (also stops double taps at the stall).
create or replace function public.check_units_left()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  qty int;
  sold int;
begin
  select quantity into qty from public.items where id = new.item_id for update;
  select count(*) into sold from public.sales where item_id = new.item_id;
  if sold >= qty then
    raise exception 'That piece is already sold' using errcode = '23505';
  end if;
  return new;
end;
$$;

create trigger sales_check_units
before insert on public.sales
for each row execute function public.check_units_left();

-- After a sale or an undo: sold when no units are left, otherwise available.
create or replace function public.sync_item_status()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  target uuid := case when tg_op = 'INSERT' then new.item_id else old.item_id end;
begin
  update public.items i
     set status = case when (select count(*) from public.sales s where s.item_id = i.id) >= i.quantity then 'sold' else 'available' end,
         updated_at = now()
   where i.id = target and i.status <> 'not_for_sale';
  return case when tg_op = 'INSERT' then new else old end;
end;
$$;

-- When the quantity changes: it can't go below what's already sold, and the status follows.
create or replace function public.sync_status_on_quantity()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  sold int;
begin
  select count(*) into sold from public.sales where item_id = new.id;
  if new.quantity < sold then
    raise exception '% already sold, so the quantity can''t be lower than that', sold;
  end if;
  if new.status <> 'not_for_sale' then
    new.status := case when sold >= new.quantity then 'sold' else 'available' end;
  end if;
  return new;
end;
$$;

create trigger items_quantity_status
before update of quantity on public.items
for each row
when (new.quantity is distinct from old.quantity)
execute function public.sync_status_on_quantity();

-- Page holders are one design, painted afterwards: merge them into a single piece with a quantity.
-- Only done when none of them has been sold yet, so no sale history is touched.
do $$
declare
  keep uuid;
  n int;
  price numeric(8,2);
begin
  if exists (select 1 from public.sales s join public.items i on i.id = s.item_id where i.category_id = 'page-holders') then
    return;
  end if;
  select count(*) into n from public.items where category_id = 'page-holders';
  -- Keep their price (the most common one, if they somehow differ).
  select price_eur into price from public.items
   where category_id = 'page-holders' and price_eur is not null
   group by price_eur order by count(*) desc, price_eur desc limit 1;
  if n < 2 then
    return;
  end if;
  select id into keep from public.items where category_id = 'page-holders' order by sort, created_at limit 1;
  update public.items set
    label    = 'Page holder',
    quantity = n,
    status   = 'available',
    price_eur = price,
    updated_at = now()
  where id = keep;
  -- Keep the merged piece on any packing list one of the others was on.
  insert into public.market_items (market_id, item_id)
  select distinct mi.market_id, keep from public.market_items mi
  join public.items i on i.id = mi.item_id
  where i.category_id = 'page-holders' and i.id <> keep
  on conflict do nothing;
  delete from public.items where category_id = 'page-holders' and id <> keep;
end;
$$;
