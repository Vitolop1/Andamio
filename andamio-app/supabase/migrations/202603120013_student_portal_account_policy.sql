drop policy if exists "authenticated full student portal accounts" on public.student_portal_accounts;
drop policy if exists "team and own student portal accounts" on public.student_portal_accounts;

create policy "team and own student portal accounts"
on public.student_portal_accounts
for all
to authenticated
using (
  auth.uid() = profile_id
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'profesional')
  )
)
with check (
  auth.uid() = profile_id
  or exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('admin', 'profesional')
  )
);
