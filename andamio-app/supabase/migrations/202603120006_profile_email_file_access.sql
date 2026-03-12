drop policy if exists "authenticated full files" on public.files;
drop policy if exists "professionals read visible files" on public.files;
drop policy if exists "professionals insert files" on public.files;
drop policy if exists "professionals update own files" on public.files;
drop policy if exists "professionals delete own files" on public.files;

create or replace function public.current_profile_ids()
returns setof uuid
language sql
stable
as $$
  select id
  from public.profiles
  where id = auth.uid()
     or email = auth.jwt() ->> 'email'
$$;

create policy "professionals read visible files"
on public.files
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.role = 'admin'
      and profiles.id in (select public.current_profile_ids())
  )
  or visibility = 'Equipo'
  or uploaded_by in (select public.current_profile_ids())
);

create policy "professionals insert files"
on public.files
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.role in ('admin', 'profesional')
      and profiles.id in (select public.current_profile_ids())
  )
  and (
    uploaded_by is null
    or uploaded_by in (select public.current_profile_ids())
  )
);

create policy "professionals update own files"
on public.files
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.role = 'admin'
      and profiles.id in (select public.current_profile_ids())
  )
  or uploaded_by in (select public.current_profile_ids())
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.role = 'admin'
      and profiles.id in (select public.current_profile_ids())
  )
  or uploaded_by in (select public.current_profile_ids())
);

create policy "professionals delete own files"
on public.files
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.role = 'admin'
      and profiles.id in (select public.current_profile_ids())
  )
  or uploaded_by in (select public.current_profile_ids())
);
