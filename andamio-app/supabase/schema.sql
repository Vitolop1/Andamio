create extension if not exists "pgcrypto";

do $$
begin
  create type public.app_role as enum ('admin', 'profesional', 'alumno');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.student_status as enum ('al-dia', 'requiere-seguimiento', 'nuevo-ingreso');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.file_scope as enum ('Alumno', 'Curso', 'Institucion');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.file_kind as enum ('Informe', 'Evaluacion', 'Material', 'Actividad', 'Planilla');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.file_visibility as enum ('Equipo', 'Privado');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.event_status as enum ('confirmada', 'pendiente', 'reprogramar');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key,
  full_name text not null,
  email text unique not null,
  role public.app_role not null default 'profesional',
  created_at timestamptz not null default now()
);

create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  province text,
  lead_name text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  name text not null,
  school_year text not null,
  level text,
  shift text,
  teacher_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  first_name text not null,
  last_name text not null,
  birth_date date,
  family_contact text,
  support_focus text,
  notes text,
  status public.student_status not null default 'nuevo-ingreso',
  created_at timestamptz not null default now()
);

create table if not exists public.student_professionals (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  professional_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (student_id, professional_id)
);

create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  title text not null,
  evaluation_type text not null,
  summary text,
  evaluated_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references public.profiles(id),
  institution_id uuid references public.institutions(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  student_id uuid references public.students(id) on delete set null,
  title text not null,
  storage_path text not null,
  kind public.file_kind not null,
  scope public.file_scope not null,
  visibility public.file_visibility not null default 'Equipo',
  grade_label text,
  subject text,
  file_size_label text,
  school_year text,
  created_at timestamptz not null default now()
);

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

create table if not exists public.schedule_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete set null,
  professional_id uuid references public.profiles(id) on delete set null,
  title text not null,
  event_date date not null,
  start_time time not null,
  end_time time not null,
  location text,
  status public.event_status not null default 'pendiente',
  created_at timestamptz not null default now()
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  created_by uuid references public.profiles(id),
  title text not null,
  description text,
  due_at date,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  file_id uuid references public.files(id) on delete set null,
  comment text,
  submitted_at timestamptz not null default now()
);

comment on table public.files is 'Metadata de archivos guardados en Supabase Storage.';
comment on table public.schedule_events is 'Agenda base del MVP para sesiones y reuniones.';
