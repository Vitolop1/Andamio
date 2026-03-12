# Andamio

Plataforma web para ordenar el trabajo de psicopedagogas, maestras y profesionales que necesitan centralizar alumnos, instituciones, archivos, evaluaciones y agenda.

## Estado actual

Esta primera implementacion deja listo:

- landing inicial del producto
- panel navegable del MVP
- modulos base de `dashboard`, `instituciones`, `cursos`, `alumnos`, `biblioteca` y `agenda`
- datos mock para validar el flujo antes de conectar la base real
- utilidades para integrar Supabase con auth, base de datos y storage
- esquema SQL inicial para el modelo del MVP
- seed SQL para cargar datos de ejemplo

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase SSR + Supabase JS

## Como levantarlo

```bash
npm install
npm run dev
```

Abri `http://localhost:3000`.

## SQL para dejarlo util

Si ya tenes el proyecto creado en Supabase y queres dejarlo listo con datos,
materias y visibilidad de archivos:

1. Corre `supabase/schema.sql`
2. Corre `supabase/seed.sql`
3. Corre `supabase/policies.sql`
4. Corre `supabase/search-and-access-upgrade.sql`
5. Corre `supabase/files-visibility-policies.sql`

Ese ultimo archivo agrega:

- visibilidad por archivo: `Equipo` o `Privado`
- tabla `subjects`
- materias iniciales para busqueda y carga guiada

Y el archivo `files-visibility-policies.sql` reemplaza la politica amplia de
`files` por una mas util:

- admin ve todo
- profesional ve archivos compartidos
- profesional tambien ve sus archivos privados

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Sin esas variables la UI igual levanta usando datos mock, pero la integracion real con Supabase queda en espera.

## Estructura util

- `src/app`: rutas y paginas
- `src/components`: layout y componentes reutilizables
- `src/lib`: tipos, datos mock y utilidades
- `src/lib/supabase`: clientes y helpers para auth/storage
- `supabase/schema.sql`: modelo base para el MVP
- `supabase/seed.sql`: datos iniciales de ejemplo
- `supabase/policies.sql`: politicas RLS iniciales para usuarios autenticados
- `../docs`: definicion funcional y decisiones del producto

## Proximos pasos sugeridos

1. Confirmar campos finales de la ficha del alumno.
2. Crear `.env.local` con tu URL y key publica de Supabase.
3. Cargar `supabase/schema.sql`, despues `supabase/seed.sql` y despues `supabase/policies.sql`.
4. Crear al menos un usuario en Supabase Auth con email y password.
5. Agregar `SUPABASE_SERVICE_ROLE_KEY` si queres dar de alta profesionales desde la web.
6. Verificar que el sidebar muestre `Supabase conectado`.
7. Refinar permisos por rol.
8. Habilitar subida de archivos privados a Storage.

## Deploy recomendado

- Frontend y app: Vercel
- Base de datos, auth y archivos: Supabase

Variables que vas a cargar en Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_ENABLE_DEMO_BYPASS=false`
