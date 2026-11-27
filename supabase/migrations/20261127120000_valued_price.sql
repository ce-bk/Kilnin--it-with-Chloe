-- A piece's valued price (its worth with the maker's time counted) gets its own column,
-- instead of living in the notes as "Valued €X". Existing values are moved across.

alter table public.items add column valued_eur numeric(8,2) check (valued_eur >= 0);

update public.items
set valued_eur = replace((regexp_match(notes, 'valued\s*€\s*([0-9]+(?:[.,][0-9]+)?)', 'i'))[1], ',', '.')::numeric,
    notes = nullif(btrim(regexp_replace(notes, '\s*·?\s*valued\s*€\s*[0-9]+(?:[.,][0-9]+)?\s*', ' ', 'i'), ' ·'), '')
where notes ~* 'valued\s*€\s*[0-9]';
