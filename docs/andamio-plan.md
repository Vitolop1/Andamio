# Andamio - Plan Inicial

## Vision

Andamio va a ser una plataforma web privada para organizar el trabajo de psicopedagogas, maestras y profesionales que hoy manejan informacion dispersa entre carpetas, WhatsApp, Drive, mail y papel.

La prioridad del producto es el lado profesional:

- ordenar colegios, cursos y alumnos
- guardar archivos con clasificacion clara
- registrar evaluaciones, observaciones y seguimiento
- administrar horarios y sesiones

El acceso de alumnos y familias existe, pero entra en una segunda etapa.

## Objetivo del MVP

La primera version tiene que resolver esto bien:

1. Login seguro para profesionales.
2. Dashboard con resumen del trabajo diario.
3. Alta y gestion de colegios o instituciones.
4. Alta y gestion de cursos o grupos.
5. Alta y gestion de alumnos.
6. Ficha completa del alumno.
7. Subida de archivos guiada y clasificada.
8. Registro de evaluaciones, observaciones e informes.
9. Agenda basica de horarios o sesiones.

Si esto funciona bien, ya estamos resolviendo el problema principal del negocio.

## Roles iniciales

### Admin

- puede ver todo
- puede crear y editar usuarios
- puede configurar instituciones y permisos

### Profesional

- puede ver solo lo que le corresponde
- crea alumnos, evaluaciones, archivos y agenda
- organiza materiales por colegio, curso y alumno

### Alumno o familia

- entra solo a su espacio
- ve materiales o tareas asignadas
- puede subir entregas si esta habilitado

## Modulos

### 1. Autenticacion y permisos

- login por email y password
- roles por usuario
- acceso privado a datos y archivos

### 2. Instituciones

- crear colegio o institucion
- editar datos basicos
- listar cursos asociados

### 3. Cursos

- crear curso o grupo
- vincularlo a una institucion
- definir ano lectivo, nivel y turno

### 4. Alumnos

- crear alumno
- vincularlo a colegio y curso si corresponde
- ver su ficha general
- ver historial de archivos, evaluaciones y actividades

### 5. Archivos

- subir archivos con asistente guiado
- clasificar por tipo, alumno, curso, institucion y ano
- buscar y filtrar facilmente

### 6. Seguimiento

- evaluaciones
- observaciones
- informes
- historial cronologico

### 7. Agenda

- calendario semanal o diario
- sesiones por alumno
- recordatorio simple de horarios

### 8. Portal alumno

- materiales para practicar en casa
- tareas
- entregas
- estado de cumplimiento

## Stack recomendado

### Frontend y backend

- Next.js
- TypeScript
- Tailwind CSS

### Base de datos, auth y storage

- Supabase

### Deploy

- Vercel

## Por que este stack

- Next.js permite construir frontend y backend en un solo repo.
- TypeScript ayuda a mantener ordenado un sistema con muchos modulos y relaciones.
- Supabase resuelve base Postgres, autenticacion y archivos privados.
- Vercel simplifica mucho el despliegue inicial del proyecto.

## Arquitectura funcional

### Base de datos

Tablas iniciales sugeridas:

- `profiles`
- `institutions`
- `courses`
- `students`
- `student_professionals`
- `student_notes`
- `evaluations`
- `files`
- `schedule_events`
- `assignments`
- `submissions`

### Storage

Los archivos no se guardan dentro de la base.

Se guardan en Supabase Storage y en la base se registra:

- nombre
- ruta
- tipo
- tamano
- quien lo subio
- con que alumno, curso o institucion se relaciona

### Ejemplo de organizacion de archivos

- `institutions/{institutionId}/courses/{courseId}/materials/{file}`
- `students/{studentId}/evaluations/{file}`
- `students/{studentId}/reports/{file}`
- `students/{studentId}/assignments/{file}`
- `students/{studentId}/submissions/{file}`

## Flujo ideal de trabajo

1. La profesional inicia sesion.
2. Entra al dashboard.
3. Crea o selecciona una institucion.
4. Crea o selecciona un curso.
5. Agrega alumnos.
6. Carga archivos, evaluaciones u observaciones.
7. Agenda horarios o sesiones.
8. Opcionalmente comparte tareas o materiales con el alumno.

## Prioridades de construccion

### Fase 1 - Base del sistema

- proyecto Next.js
- UI base
- autenticacion
- roles
- modelo de datos

### Fase 2 - Core profesional

- instituciones
- cursos
- alumnos
- ficha de alumno
- archivos
- evaluaciones y seguimiento

### Fase 3 - Agenda

- calendario
- sesiones
- horarios

### Fase 4 - Portal alumno

- acceso alumno
- materiales
- tareas
- entregas

### Fase 5 - Mejoras

- busqueda global
- etiquetas
- reportes
- exportacion PDF
- notificaciones

## Riesgos y decisiones importantes

- No conviene arrancar haciendo todo junto.
- Los datos son sensibles, asi que los archivos deben ser privados.
- Necesitamos definir bien permisos antes de programar el panel de alumnos.
- La experiencia de carga de archivos tiene que ser guiada; si no, vuelve el desorden.

## Entregables del primer sprint

Si arrancamos ahora, el primer sprint deberia terminar con:

- proyecto base funcionando
- login listo
- roles iniciales
- modelo de datos inicial
- CRUD de instituciones
- CRUD de cursos
- CRUD de alumnos
- ficha basica del alumno

## Entregables del segundo sprint

- subida de archivos
- historial por alumno
- evaluaciones
- observaciones
- agenda basica

## Criterio de exito del MVP

El MVP esta bien si una profesional puede:

1. entrar al sistema sin depender de terceros
2. encontrar rapido un alumno
3. ver su historial
4. subir y recuperar archivos sin confusion
5. registrar seguimiento
6. ordenar su semana de trabajo
