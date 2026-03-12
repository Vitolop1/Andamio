# Andamio

Plataforma web para organizar el trabajo de psicopedagogas, maestras y profesionales que necesitan centralizar colegios, cursos, alumnos, archivos, evaluaciones y horarios en un solo lugar.

## Que incluye este repo

- `andamio-app/`: app principal en Next.js
- `docs/`: notas funcionales y definicion del proyecto

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth + Database + Storage
- Vercel para deploy

## Como levantarlo local

```bash
cd andamio-app
npm install
npm run dev
```

Abrir:

- `http://localhost:3000`
- `http://localhost:3000/login`

## Cuentas iniciales del equipo

Despues de sincronizar usuarios, quedan estas cuentas base:

- `emilia@andamio.app`
- `rosario@andamio.app`
- `agustina@andamio.app`
- `admin@andamio.app`

Para recrearlas o actualizarlas desde tu computadora:

```bash
cd andamio-app
npm run sync:accounts
```

## Variables de entorno

En `andamio-app/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_ENABLE_DEMO_BYPASS=false
```

## SQL para dejar Supabase listo

Correr estos archivos en este orden:

1. `andamio-app/supabase/schema.sql`
2. `andamio-app/supabase/seed.sql`
3. `andamio-app/supabase/policies.sql`
4. `andamio-app/supabase/search-and-access-upgrade.sql`
5. `andamio-app/supabase/files-visibility-policies.sql`

## GitHub

Si vas a subir este repo completo:

```bash
cd C:\Users\PC\Andamio
git init -b main
git add .
git commit -m "feat: initial Andamio MVP"
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Antes de hacer `git push`, crea el repo vacio en GitHub sin README, sin `.gitignore` y sin license.

## GitHub Desktop

Si queres manejar este repo con GitHub Desktop en tu compu:

1. Abri GitHub Desktop.
2. Hace click en `File > Add local repository`.
3. Elegi `C:\Users\PC\Andamio`.
4. Acepta publicar o vincular el repo a `Vitolop1/Andamio`.
5. Cada vez que cambies algo, vas a ver los archivos modificados.
6. Escribi un resumen, hace `Commit to main` y despues `Push origin`.

GitHub Desktop no tiene que estar abierto todo el dia. Solo lo abris cuando queres revisar cambios, commitear o subir.

## Deploy online

La forma recomendada es:

1. Subir este repo a GitHub
2. Entrar a Vercel
3. Importar el repo
4. En `Root Directory`, elegir `andamio-app`
5. Cargar las variables de entorno
6. Deploy

Variables para Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_ENABLE_DEMO_BYPASS=false`

## Estado actual

Ya funciona:

- login simple
- dashboard simplificado
- alta de colegios
- alta de alumnos
- alta de profesionales
- biblioteca con filtros
- subida guiada de archivos
- visibilidad de archivos `Equipo` o `Privado`

## Fuentes oficiales

- Vercel monorepos y root directory: https://vercel.com/docs/monorepos/
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Next.js on Vercel: https://vercel.com/docs/frameworks/nextjs
- GitHub subir código local: https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
