alter table public.files
add column if not exists grade_label text;

update public.profiles
set
  full_name = 'Lic. Emilia Maidana',
  email = 'emilia@andamio.app',
  role = 'admin'
where id = '11111111-1111-1111-1111-111111111111';

update public.profiles
set
  full_name = 'Prof. Rosario Maidana',
  email = 'rosario@andamio.app'
where id = '11111111-1111-1111-1111-111111111112';

update public.profiles
set
  full_name = 'Prof. Agustina Esquiu',
  email = 'agustina@andamio.app'
where id = '11111111-1111-1111-1111-111111111113';

update public.institutions
set
  name = 'Andamio',
  lead_name = 'Lic. Emilia Maidana'
where id = '22222222-2222-2222-2222-222222222221';

update public.institutions
set lead_name = 'Prof. Rosario Maidana'
where id = '22222222-2222-2222-2222-222222222222';

update public.institutions
set lead_name = 'Prof. Agustina Esquiu'
where id = '22222222-2222-2222-2222-222222222223';

update public.courses
set teacher_name = 'Emilia Maidana'
where id = '33333333-3333-3333-3333-333333333333';

update public.courses
set teacher_name = 'Agustina Esquiu'
where id = '33333333-3333-3333-3333-333333333334';

update public.schedule_events
set location = 'Andamio'
where location = 'Consultorio Andamio';

update public.files
set grade_label = '3er grado'
where id = '77777777-7777-7777-7777-777777777771';

update public.files
set grade_label = '5to grado'
where id = '77777777-7777-7777-7777-777777777772';

insert into public.files (
  id,
  uploaded_by,
  institution_id,
  course_id,
  student_id,
  title,
  storage_path,
  kind,
  scope,
  visibility,
  grade_label,
  subject,
  file_size_label,
  school_year
)
values
  (
    '77777777-7777-7777-7777-777777777776',
    '11111111-1111-1111-1111-111111111111',
    null,
    null,
    null,
    'Cuadernillo compartido 1er grado',
    'grades/1er-grado/material/cuadernillo-compartido-1er-grado.pdf',
    'Material',
    'Curso',
    'Equipo',
    '1er grado',
    'Lectoescritura',
    '980 KB',
    '2026'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222225',
    null,
    null,
    'Lecturas de 1er grado Santa Maria',
    'institutions/22222222-2222-2222-2222-222222222225/grades/1er-grado/material/lecturas-1er-grado-santa-maria.pdf',
    'Material',
    'Curso',
    'Equipo',
    '1er grado',
    'Lectoescritura',
    '760 KB',
    '2026'
  )
on conflict (id) do update
set
  uploaded_by = excluded.uploaded_by,
  institution_id = excluded.institution_id,
  course_id = excluded.course_id,
  student_id = excluded.student_id,
  title = excluded.title,
  storage_path = excluded.storage_path,
  kind = excluded.kind,
  scope = excluded.scope,
  visibility = excluded.visibility,
  grade_label = excluded.grade_label,
  subject = excluded.subject,
  file_size_label = excluded.file_size_label,
  school_year = excluded.school_year;
