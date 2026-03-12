insert into public.profiles (id, full_name, email, role)
values
  ('11111111-1111-1111-1111-111111111111', 'Lic. Emilia Maidana', 'emilia@andamio.app', 'admin'),
  ('11111111-1111-1111-1111-111111111112', 'Prof. Rosario Maidana', 'rosario@andamio.app', 'profesional'),
  ('11111111-1111-1111-1111-111111111113', 'Prof. Agustina Esquiu', 'agustina@andamio.app', 'profesional'),
  ('11111111-1111-1111-1111-111111111114', 'Admin Andamio', 'admin@andamio.app', 'admin')
on conflict (id) do update
set
  full_name = excluded.full_name,
  email = excluded.email,
  role = excluded.role;

insert into public.institutions (id, name, city, province, lead_name, created_by)
values
  ('22222222-2222-2222-2222-222222222221', 'Andamio', 'Salta', 'Salta', 'Lic. Emilia Maidana', '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222', 'Colegio Santo Tomas de Aquino', 'Salta', 'Salta', 'Prof. Rosario Maidana', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-222222222223', 'Colegio Belgrano', 'Salta', 'Salta', 'Prof. Agustina Esquiu', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-222222222224', 'Colegio San Pablo', 'Salta', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-222222222225', 'Colegio Santa Maria', 'Salta', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-222222222226', 'Colegio Santa Teresa de Jesus', 'Salta', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-222222222227', 'Colegio Verbum', 'Salta', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-222222222228', 'Colegio San Cayetano', 'Salta', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-222222222229', 'Colegio Dante Alighieri', 'Salta', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-22222222222a', 'Uzzi College', 'Salta', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-22222222222b', 'Colegio Sagrado Corazon (San Lorenzo Chico)', 'San Lorenzo Chico', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-22222222222c', 'San Isidro College (San Lorenzo Chico)', 'San Lorenzo Chico', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-22222222222d', 'Colegio Santisima Trinidad (San Lorenzo)', 'San Lorenzo', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-22222222222e', 'CODESA', 'Salta', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114'),
  ('22222222-2222-2222-2222-22222222222f', 'Bachillerato Humanista Moderno (BACHI)', 'Salta', 'Salta', 'Equipo Andamio', '11111111-1111-1111-1111-111111111114')
on conflict (id) do update
set
  name = excluded.name,
  city = excluded.city,
  province = excluded.province,
  lead_name = excluded.lead_name,
  created_by = excluded.created_by;

insert into public.courses (id, institution_id, name, school_year, level, shift, teacher_name)
values
  ('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222222', '3ro A', '2026', 'Primaria', 'Manana', 'Soledad Cruz'),
  ('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222222', '5to B', '2026', 'Primaria', 'Tarde', 'Marina Flores'),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222221', 'Taller de lenguaje', '2026', 'Consultorio', 'Mixto', 'Emilia Maidana'),
  ('33333333-3333-3333-3333-333333333334', '22222222-2222-2222-2222-222222222223', 'Apoyo secundario', '2026', 'Secundaria', 'Tarde', 'Agustina Esquiu')
on conflict (id) do update
set
  institution_id = excluded.institution_id,
  name = excluded.name,
  school_year = excluded.school_year,
  level = excluded.level,
  shift = excluded.shift,
  teacher_name = excluded.teacher_name;

insert into public.students (
  id,
  institution_id,
  course_id,
  first_name,
  last_name,
  birth_date,
  family_contact,
  support_focus,
  notes,
  status
)
values
  ('44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333331', 'Juana', 'Rivera', '2016-07-20', 'Laura Rivera - 387 512 0014', 'Lectoescritura', 'Necesita sostener la secuencia de lectura diaria y seguimiento de produccion escrita.', 'requiere-seguimiento'),
  ('44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333332', 'Mateo', 'Campos', '2014-05-18', 'Juan Campos - 387 443 1882', 'Organizacion y estudio', 'Viene sosteniendo muy bien la planificacion semanal y la entrega de tareas en tiempo.', 'al-dia'),
  ('44444444-4444-4444-4444-444444444443', '22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333333', 'Pilar', 'Soria', '2017-02-01', 'Micaela Soria - 387 411 9200', 'Conciencia fonologica', 'Ingreso reciente. Falta cargar observacion inicial completa y material para casa.', 'nuevo-ingreso'),
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333334', 'Santino', 'Diaz', '2011-10-09', 'Carla Diaz - 387 478 3321', 'Comprension lectora', 'Le cuesta sostener la entrega digital; conviene reforzar consignas claras y checklist.', 'requiere-seguimiento')
on conflict (id) do nothing;

insert into public.student_professionals (id, student_id, professional_id)
values
  ('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111'),
  ('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444442', '11111111-1111-1111-1111-111111111111'),
  ('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444443', '11111111-1111-1111-1111-111111111111'),
  ('55555555-5555-5555-5555-555555555554', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111')
on conflict (student_id, professional_id) do nothing;

insert into public.evaluations (
  id,
  student_id,
  created_by,
  title,
  evaluation_type,
  summary,
  evaluated_at
)
values
  ('66666666-6666-6666-6666-666666666661', '44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', 'Seguimiento comprension lectora', 'Observacion', 'Mejora en fluidez lectora, todavia necesita apoyo para sostener inferencias simples.', '2026-03-09'),
  ('66666666-6666-6666-6666-666666666662', '44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', 'Produccion escrita guiada', 'Evaluacion', 'Responde mejor con apoyos visuales. Se recomienda rutina corta de escritura en casa.', '2026-03-04'),
  ('66666666-6666-6666-6666-666666666663', '44444444-4444-4444-4444-444444444442', '11111111-1111-1111-1111-111111111111', 'Chequeo de agenda y habitos', 'Seguimiento', 'La organizacion semanal quedo estable. Puede empezar a autogestionar entregas simples.', '2026-03-08'),
  ('66666666-6666-6666-6666-666666666664', '44444444-4444-4444-4444-444444444443', '11111111-1111-1111-1111-111111111111', 'Entrevista inicial con familia', 'Ingreso', 'Se relevaron antecedentes y se definio foco inicial en conciencia fonologica y vocabulario.', '2026-03-07'),
  ('66666666-6666-6666-6666-666666666665', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Plan de apoyo para textos expositivos', 'Planificacion', 'Se acordaron consignas fragmentadas y entrega por etapas para bajar la frustracion.', '2026-03-10')
on conflict (id) do nothing;

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
  subject,
  file_size_label,
  school_year
)
values
  ('77777777-7777-7777-7777-777777777771', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', 'Informe trimestral de Juana', 'students/44444444-4444-4444-4444-444444444441/reports/informe-trimestral-juana.pdf', 'Informe', 'Alumno', 'Lectoescritura', '1.8 MB', '2026'),
  ('77777777-7777-7777-7777-777777777772', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333332', null, 'Rutina semanal 5to B', 'institutions/22222222-2222-2222-2222-222222222222/courses/33333333-3333-3333-3333-333333333332/materials/rutina-semanal-5to-b.pdf', 'Material', 'Curso', 'Habitos de estudio', '850 KB', '2026'),
  ('77777777-7777-7777-7777-777777777773', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', null, null, 'Planilla de asistencia marzo', 'institutions/22222222-2222-2222-2222-222222222221/materials/planilla-asistencia-marzo.pdf', 'Planilla', 'Institucion', 'Gestion', '420 KB', '2026'),
  ('77777777-7777-7777-7777-777777777774', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', '33333333-3333-3333-3333-333333333334', '44444444-4444-4444-4444-444444444444', 'Actividad casa Santino', 'students/44444444-4444-4444-4444-444444444444/assignments/actividad-casa-santino.pdf', 'Actividad', 'Alumno', 'Comprension', '2.1 MB', '2026'),
  ('77777777-7777-7777-7777-777777777775', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444443', 'Evaluacion inicial Pilar', 'students/44444444-4444-4444-4444-444444444443/evaluations/evaluacion-inicial-pilar.pdf', 'Evaluacion', 'Alumno', 'Lenguaje', '1.1 MB', '2026')
on conflict (id) do nothing;

insert into public.schedule_events (
  id,
  student_id,
  professional_id,
  title,
  event_date,
  start_time,
  end_time,
  location,
  status
)
values
  ('88888888-8888-8888-8888-888888888881', '44444444-4444-4444-4444-444444444441', '11111111-1111-1111-1111-111111111111', 'Sesion individual - Juana Rivera', '2026-03-12', '15:00:00', '15:45:00', 'Andamio', 'confirmada'),
  ('88888888-8888-8888-8888-888888888882', null, '11111111-1111-1111-1111-111111111111', 'Revision con docente 5to B', '2026-03-12', '16:15:00', '16:45:00', 'Llamada virtual', 'pendiente'),
  ('88888888-8888-8888-8888-888888888883', '44444444-4444-4444-4444-444444444443', '11111111-1111-1111-1111-111111111111', 'Sesion grupal - Taller de lenguaje', '2026-03-14', '10:00:00', '11:00:00', 'Andamio', 'confirmada'),
  ('88888888-8888-8888-8888-888888888884', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Sesion individual - Santino Diaz', '2026-03-12', '18:15:00', '19:00:00', 'Colegio Belgrano', 'reprogramar'),
  ('88888888-8888-8888-8888-888888888885', '44444444-4444-4444-4444-444444444442', '11111111-1111-1111-1111-111111111111', 'Sesion individual - Mateo Campos', '2026-03-13', '17:30:00', '18:15:00', 'Andamio', 'confirmada')
on conflict (id) do update
set
  student_id = excluded.student_id,
  professional_id = excluded.professional_id,
  title = excluded.title,
  event_date = excluded.event_date,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  location = excluded.location,
  status = excluded.status;

insert into public.assignments (id, student_id, course_id, created_by, title, description, due_at)
values
  ('99999999-9999-9999-9999-999999999991', '44444444-4444-4444-4444-444444444441', null, '11111111-1111-1111-1111-111111111111', 'Lectura diaria', 'Rutina corta de lectura en voz alta.', '2026-03-15'),
  ('99999999-9999-9999-9999-999999999992', '44444444-4444-4444-4444-444444444441', null, '11111111-1111-1111-1111-111111111111', 'Produccion escrita', 'Escribir una breve secuencia guiada.', '2026-03-16'),
  ('99999999-9999-9999-9999-999999999993', '44444444-4444-4444-4444-444444444443', null, '11111111-1111-1111-1111-111111111111', 'Practica fonologica', 'Tarjetas de sonidos iniciales.', '2026-03-15'),
  ('99999999-9999-9999-9999-999999999994', '44444444-4444-4444-4444-444444444444', null, '11111111-1111-1111-1111-111111111111', 'Texto expositivo parte 1', 'Responder preguntas de organizacion del texto.', '2026-03-16'),
  ('99999999-9999-9999-9999-999999999995', '44444444-4444-4444-4444-444444444444', null, '11111111-1111-1111-1111-111111111111', 'Texto expositivo parte 2', 'Resumir ideas principales en vietas.', '2026-03-17'),
  ('99999999-9999-9999-9999-999999999996', '44444444-4444-4444-4444-444444444444', null, '11111111-1111-1111-1111-111111111111', 'Checklist de entrega', 'Completar checklist antes de subir tarea.', '2026-03-18')
on conflict (id) do nothing;
