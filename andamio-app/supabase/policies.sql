alter table public.profiles enable row level security;
alter table public.institutions enable row level security;
alter table public.courses enable row level security;
alter table public.students enable row level security;
alter table public.student_professionals enable row level security;
alter table public.evaluations enable row level security;
alter table public.files enable row level security;
alter table public.schedule_events enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "authenticated read profiles" on public.profiles;
create policy "authenticated read profiles"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "authenticated full institutions" on public.institutions;
create policy "authenticated full institutions"
on public.institutions
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full courses" on public.courses;
create policy "authenticated full courses"
on public.courses
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full students" on public.students;
create policy "authenticated full students"
on public.students
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full student professionals" on public.student_professionals;
create policy "authenticated full student professionals"
on public.student_professionals
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full evaluations" on public.evaluations;
create policy "authenticated full evaluations"
on public.evaluations
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full files" on public.files;
create policy "authenticated full files"
on public.files
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full schedule events" on public.schedule_events;
create policy "authenticated full schedule events"
on public.schedule_events
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full assignments" on public.assignments;
create policy "authenticated full assignments"
on public.assignments
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated full submissions" on public.submissions;
create policy "authenticated full submissions"
on public.submissions
for all
to authenticated
using (true)
with check (true);
