create table if not exists public.student_portal_accounts (
  student_id uuid primary key references public.students(id) on delete cascade,
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  email text not null unique,
  initial_password text not null,
  created_at timestamptz not null default now()
);

alter table public.student_portal_accounts enable row level security;

drop policy if exists "authenticated full student portal accounts" on public.student_portal_accounts;
create policy "authenticated full student portal accounts"
on public.student_portal_accounts
for all
to authenticated
using (true)
with check (true);
