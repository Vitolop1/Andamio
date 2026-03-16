insert into public.courses (id, institution_id, name, school_year, level, shift, teacher_name)
values
  ('33333333-3333-3333-3333-333333333334', '22222222-2222-2222-2222-222222222221', 'Clases de apoyo', '2026', 'Apoyo', 'Flexible', 'Prof. Rosario Maidana')
on conflict (id) do update
set
  institution_id = excluded.institution_id,
  name = excluded.name,
  school_year = excluded.school_year,
  level = excluded.level,
  shift = excluded.shift,
  teacher_name = excluded.teacher_name;
