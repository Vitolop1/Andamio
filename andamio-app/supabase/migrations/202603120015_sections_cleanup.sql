insert into public.courses (id, institution_id, name, school_year, level, shift, teacher_name)
values
  ('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 'Taller de fonoaudiologia', '2026', 'Seccion', 'Mixto', 'Lic. Emilia Maidana'),
  ('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222221', 'Curso de verano intensivo', '2026', 'Intensivo', 'Verano', 'Lic. Emilia Maidana'),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222221', 'Taller de lectoescritura', '2026', 'Seccion', 'Tarde', 'Prof. Rosario Maidana')
on conflict (id) do update
set
  institution_id = excluded.institution_id,
  name = excluded.name,
  school_year = excluded.school_year,
  level = excluded.level,
  shift = excluded.shift,
  teacher_name = excluded.teacher_name;

update public.students
set course_id = null
where id in (
  '44444444-4444-4444-4444-444444444441',
  '44444444-4444-4444-4444-444444444442',
  '44444444-4444-4444-4444-444444444444'
);

update public.students
set
  institution_id = '22222222-2222-2222-2222-222222222221',
  course_id = '33333333-3333-3333-3333-333333333331'
where id = '44444444-4444-4444-4444-444444444443';

update public.files
set
  institution_id = '22222222-2222-2222-2222-222222222222',
  course_id = null
where id = '77777777-7777-7777-7777-777777777771';

update public.files
set
  uploaded_by = '11111111-1111-1111-1111-111111111111',
  institution_id = '22222222-2222-2222-2222-222222222221',
  course_id = '33333333-3333-3333-3333-333333333331',
  title = 'Material taller de fonoaudiologia',
  grade_label = null,
  subject = 'Fonoaudiologia'
where id = '77777777-7777-7777-7777-777777777772';

update public.files
set course_id = null
where id = '77777777-7777-7777-7777-777777777774';

update public.files
set
  institution_id = '22222222-2222-2222-2222-222222222221',
  course_id = '33333333-3333-3333-3333-333333333331'
where id = '77777777-7777-7777-7777-777777777775';

update public.schedule_events
set title = 'Revision con docente 5to grado'
where id = '88888888-8888-8888-8888-888888888882';

update public.schedule_events
set title = 'Sesion grupal - Taller de fonoaudiologia'
where id = '88888888-8888-8888-8888-888888888883';

update public.assignments
set course_id = null
where course_id in (
  '33333333-3333-3333-3333-333333333331',
  '33333333-3333-3333-3333-333333333332',
  '33333333-3333-3333-3333-333333333334'
);

delete from public.courses
where id = '33333333-3333-3333-3333-333333333334';

