drop policy if exists "authenticated full files" on public.files;
drop policy if exists "professionals read visible files" on public.files;
drop policy if exists "professionals insert files" on public.files;
drop policy if exists "professionals update own files" on public.files;
drop policy if exists "professionals delete own files" on public.files;

do $$
begin
  create type public.file_visibility as enum ('Equipo', 'Privado');
exception
  when duplicate_object then null;
end $$;

alter table public.files
add column if not exists visibility public.file_visibility not null default 'Equipo';

create policy "professionals read visible files"
on public.files
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or visibility = 'Equipo'
  or uploaded_by = auth.uid()
);

create policy "professionals insert files"
on public.files
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'profesional')
  )
  and (uploaded_by = auth.uid() or uploaded_by is null)
);

create policy "professionals update own files"
on public.files
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or uploaded_by = auth.uid()
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or uploaded_by = auth.uid()
);

create policy "professionals delete own files"
on public.files
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
  or uploaded_by = auth.uid()
);
