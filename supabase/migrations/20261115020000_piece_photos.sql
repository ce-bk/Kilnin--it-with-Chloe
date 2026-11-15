-- A photo per piece, uploaded from the admin. Stored in a private bucket; the app shows it
-- through short-lived signed links, so only the signed-in owner can see the files.

alter table public.items add column photo_path text;  -- path inside the piece-photos bucket

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('piece-photos', 'piece-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/heic'])
on conflict (id) do nothing;

create policy "owner reads piece photos"   on storage.objects for select to authenticated using (bucket_id = 'piece-photos');
create policy "owner adds piece photos"    on storage.objects for insert to authenticated with check (bucket_id = 'piece-photos');
create policy "owner updates piece photos" on storage.objects for update to authenticated using (bucket_id = 'piece-photos');
create policy "owner deletes piece photos" on storage.objects for delete to authenticated using (bucket_id = 'piece-photos');
