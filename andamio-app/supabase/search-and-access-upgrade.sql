do $$
begin
  create type public.file_visibility as enum ('Equipo', 'Privado');
exception
  when duplicate_object then null;
end $$;

alter table public.files
add column if not exists visibility public.file_visibility not null default 'Equipo';

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.subjects (name, category, sort_order)
values
  ('General', 'Base', 1),
  ('Lengua', 'Academica', 2),
  ('Lectoescritura', 'Academica', 3),
  ('Comprension lectora', 'Academica', 4),
  ('Produccion escrita', 'Academica', 5),
  ('Conciencia fonologica', 'Apoyo', 6),
  ('Lenguaje', 'Apoyo', 7),
  ('Comunicacion', 'Apoyo', 8),
  ('Matematica', 'Academica', 9),
  ('Resolucion de problemas', 'Academica', 10),
  ('Ciencias Naturales', 'Academica', 11),
  ('Ciencias Sociales', 'Academica', 12),
  ('Ingles', 'Academica', 13),
  ('Musica', 'Especial', 14),
  ('Arte', 'Especial', 15),
  ('Plastica', 'Especial', 16),
  ('Tecnologia', 'Especial', 17),
  ('Educacion Fisica', 'Especial', 18),
  ('Habitos de estudio', 'Apoyo', 19),
  ('Organizacion', 'Apoyo', 20),
  ('Atencion', 'Apoyo', 21),
  ('Memoria', 'Apoyo', 22),
  ('Funciones ejecutivas', 'Apoyo', 23),
  ('Integracion escolar', 'Apoyo', 24),
  ('Gestion', 'Base', 25)
on conflict (name) do update
set
  category = excluded.category,
  sort_order = excluded.sort_order,
  active = true;
