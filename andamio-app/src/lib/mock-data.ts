import type {
  Course,
  Evaluation,
  Institution,
  LibraryFile,
  ProfessionalProfile,
  ScheduleEvent,
  Student,
} from "@/lib/types";

export const currentProfessional: ProfessionalProfile = {
  id: "prof-1",
  name: "Lic. Valentina Alvarez",
  roleLabel: "Psicopedagoga coordinadora",
  initials: "VA",
};

export const institutions: Institution[] = [
  {
    id: "inst-andamio",
    name: "Consultorio Andamio",
    city: "Salta",
    province: "Salta",
    lead: "Lic. Valentina Alvarez",
    activeStudents: 1,
    activeCourses: 1,
    lastUpdate: "Actualizado hoy",
  },
  {
    id: "inst-santo-tomas",
    name: "Colegio Santo Tomas de Aquino",
    city: "Salta",
    province: "Salta",
    lead: "Prof. Natalia Figueroa",
    activeStudents: 2,
    activeCourses: 2,
    lastUpdate: "Ultima visita hace 2 dias",
  },
  {
    id: "inst-belgrano",
    name: "Colegio Belgrano",
    city: "Salta",
    province: "Salta",
    lead: "Prof. Rocio Guzman",
    activeStudents: 1,
    activeCourses: 1,
    lastUpdate: "Seguimiento cargado ayer",
  },
  {
    id: "inst-san-pablo",
    name: "Colegio San Pablo",
    city: "Salta",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
  {
    id: "inst-santa-maria",
    name: "Colegio Santa Maria",
    city: "Salta",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
  {
    id: "inst-santa-teresa",
    name: "Colegio Santa Teresa de Jesus",
    city: "Salta",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
  {
    id: "inst-verbum",
    name: "Colegio Verbum",
    city: "Salta",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
  {
    id: "inst-san-cayetano",
    name: "Colegio San Cayetano",
    city: "Salta",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
  {
    id: "inst-dante",
    name: "Colegio Dante Alighieri",
    city: "Salta",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
  {
    id: "inst-uzzi",
    name: "Uzzi College",
    city: "Salta",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
  {
    id: "inst-sagrado-corazon",
    name: "Colegio Sagrado Corazon (San Lorenzo Chico)",
    city: "San Lorenzo Chico",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
  {
    id: "inst-san-isidro",
    name: "San Isidro College (San Lorenzo Chico)",
    city: "San Lorenzo Chico",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
  {
    id: "inst-santisima-trinidad",
    name: "Colegio Santisima Trinidad (San Lorenzo)",
    city: "San Lorenzo",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
  {
    id: "inst-codesa",
    name: "CODESA",
    city: "Salta",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
  {
    id: "inst-bachi",
    name: "Bachillerato Humanista Moderno (BACHI)",
    city: "Salta",
    province: "Salta",
    lead: "Equipo Andamio",
    activeStudents: 0,
    activeCourses: 0,
    lastUpdate: "Pendiente de carga inicial",
  },
];

export const courses: Course[] = [
  {
    id: "course-3a",
    institutionId: "inst-santo-tomas",
    name: "3ro A",
    schoolYear: "2026",
    level: "Primaria",
    shift: "Manana",
    teacher: "Soledad Cruz",
    studentCount: 12,
    subjects: ["Lectoescritura", "Comprension", "Apoyo escolar"],
  },
  {
    id: "course-5b",
    institutionId: "inst-santo-tomas",
    name: "5to B",
    schoolYear: "2026",
    level: "Primaria",
    shift: "Tarde",
    teacher: "Marina Flores",
    studentCount: 9,
    subjects: ["Organizacion", "Matematica", "Habitos de estudio"],
  },
  {
    id: "course-taller-lenguaje",
    institutionId: "inst-andamio",
    name: "Taller de lenguaje",
    schoolYear: "2026",
    level: "Consultorio",
    shift: "Mixto",
    teacher: "Valentina Alvarez",
    studentCount: 8,
    subjects: ["Lenguaje", "Conciencia fonologica"],
  },
  {
    id: "course-apoyo-secundario",
    institutionId: "inst-belgrano",
    name: "Apoyo secundario",
    schoolYear: "2026",
    level: "Secundaria",
    shift: "Tarde",
    teacher: "Rocio Guzman",
    studentCount: 6,
    subjects: ["Comprension", "Planificacion", "Produccion escrita"],
  },
];

export const students: Student[] = [
  {
    id: "student-juana-rivera",
    firstName: "Juana",
    lastName: "Rivera",
    age: 9,
    institutionId: "inst-santo-tomas",
    courseId: "course-3a",
    professional: "Lic. Valentina Alvarez",
    supportFocus: "Lectoescritura",
    familyContact: "Laura Rivera - 387 512 0014",
    status: "requiere-seguimiento",
    nextSession: "2026-03-12T15:00:00",
    pendingTasks: 2,
    notes:
      "Necesita sostener la secuencia de lectura diaria y seguimiento de produccion escrita.",
  },
  {
    id: "student-mateo-campos",
    firstName: "Mateo",
    lastName: "Campos",
    age: 11,
    institutionId: "inst-santo-tomas",
    courseId: "course-5b",
    professional: "Lic. Valentina Alvarez",
    supportFocus: "Organizacion y estudio",
    familyContact: "Juan Campos - 387 443 1882",
    status: "al-dia",
    nextSession: "2026-03-13T17:30:00",
    pendingTasks: 0,
    notes:
      "Viene sosteniendo muy bien la planificacion semanal y la entrega de tareas en tiempo.",
  },
  {
    id: "student-pilar-soria",
    firstName: "Pilar",
    lastName: "Soria",
    age: 8,
    institutionId: "inst-andamio",
    courseId: "course-taller-lenguaje",
    professional: "Lic. Valentina Alvarez",
    supportFocus: "Conciencia fonologica",
    familyContact: "Micaela Soria - 387 411 9200",
    status: "nuevo-ingreso",
    nextSession: "2026-03-14T10:00:00",
    pendingTasks: 1,
    notes:
      "Ingreso reciente. Falta cargar observacion inicial completa y material para casa.",
  },
  {
    id: "student-santino-diaz",
    firstName: "Santino",
    lastName: "Diaz",
    age: 14,
    institutionId: "inst-belgrano",
    courseId: "course-apoyo-secundario",
    professional: "Lic. Valentina Alvarez",
    supportFocus: "Comprension lectora",
    familyContact: "Carla Diaz - 387 478 3321",
    status: "requiere-seguimiento",
    nextSession: "2026-03-12T18:15:00",
    pendingTasks: 3,
    notes:
      "Le cuesta sostener la entrega digital; conviene reforzar consignas claras y checklist.",
  },
];

export const evaluations: Evaluation[] = [
  {
    id: "eval-1",
    studentId: "student-juana-rivera",
    title: "Seguimiento comprension lectora",
    type: "Observacion",
    date: "2026-03-09",
    summary:
      "Mejora en fluidez lectora, todavia necesita apoyo para sostener inferencias simples.",
  },
  {
    id: "eval-2",
    studentId: "student-juana-rivera",
    title: "Produccion escrita guiada",
    type: "Evaluacion",
    date: "2026-03-04",
    summary:
      "Responde mejor con apoyos visuales. Se recomienda rutina corta de escritura en casa.",
  },
  {
    id: "eval-3",
    studentId: "student-mateo-campos",
    title: "Chequeo de agenda y habitos",
    type: "Seguimiento",
    date: "2026-03-08",
    summary:
      "La organizacion semanal quedo estable. Puede empezar a autogestionar entregas simples.",
  },
  {
    id: "eval-4",
    studentId: "student-pilar-soria",
    title: "Entrevista inicial con familia",
    type: "Ingreso",
    date: "2026-03-07",
    summary:
      "Se relevaron antecedentes y se definio foco inicial en conciencia fonologica y vocabulario.",
  },
  {
    id: "eval-5",
    studentId: "student-santino-diaz",
    title: "Plan de apoyo para textos expositivos",
    type: "Planificacion",
    date: "2026-03-10",
    summary:
      "Se acordaron consignas fragmentadas y entrega por etapas para bajar la frustracion.",
  },
];

export const libraryFiles: LibraryFile[] = [
  {
    id: "file-1",
    title: "Informe trimestral de Juana",
    kind: "Informe",
    scope: "Alumno",
    visibility: "Privado",
    institutionId: "inst-santo-tomas",
    courseId: "course-3a",
    studentId: "student-juana-rivera",
    subject: "Lectoescritura",
    year: "2026",
    sizeLabel: "1.8 MB",
    uploadedAt: "2026-03-10",
    uploadedBy: "Lic. Valentina Alvarez",
  },
  {
    id: "file-2",
    title: "Rutina semanal 5to B",
    kind: "Material",
    scope: "Curso",
    visibility: "Equipo",
    institutionId: "inst-santo-tomas",
    courseId: "course-5b",
    subject: "Habitos de estudio",
    year: "2026",
    sizeLabel: "850 KB",
    uploadedAt: "2026-03-09",
    uploadedBy: "Marina Flores",
  },
  {
    id: "file-3",
    title: "Planilla de asistencia marzo",
    kind: "Planilla",
    scope: "Institucion",
    visibility: "Equipo",
    institutionId: "inst-andamio",
    subject: "Gestion",
    year: "2026",
    sizeLabel: "420 KB",
    uploadedAt: "2026-03-08",
    uploadedBy: "Lic. Valentina Alvarez",
  },
  {
    id: "file-4",
    title: "Actividad casa Santino",
    kind: "Actividad",
    scope: "Alumno",
    visibility: "Privado",
    institutionId: "inst-belgrano",
    courseId: "course-apoyo-secundario",
    studentId: "student-santino-diaz",
    subject: "Comprension",
    year: "2026",
    sizeLabel: "2.1 MB",
    uploadedAt: "2026-03-10",
    uploadedBy: "Lic. Valentina Alvarez",
  },
  {
    id: "file-5",
    title: "Evaluacion inicial Pilar",
    kind: "Evaluacion",
    scope: "Alumno",
    visibility: "Equipo",
    institutionId: "inst-andamio",
    courseId: "course-taller-lenguaje",
    studentId: "student-pilar-soria",
    subject: "Lenguaje",
    year: "2026",
    sizeLabel: "1.1 MB",
    uploadedAt: "2026-03-07",
    uploadedBy: "Lic. Valentina Alvarez",
  },
];

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: "event-1",
    title: "Sesion individual - Juana Rivera",
    date: "2026-03-12",
    startTime: "15:00",
    endTime: "15:45",
    professional: "Lic. Valentina Alvarez",
    location: "Consultorio Andamio",
    studentId: "student-juana-rivera",
    status: "confirmada",
  },
  {
    id: "event-2",
    title: "Revision con docente 5to B",
    date: "2026-03-12",
    startTime: "16:15",
    endTime: "16:45",
    professional: "Lic. Valentina Alvarez",
    location: "Llamada virtual",
    status: "pendiente",
  },
  {
    id: "event-3",
    title: "Sesion grupal - Taller de lenguaje",
    date: "2026-03-14",
    startTime: "10:00",
    endTime: "11:00",
    professional: "Lic. Valentina Alvarez",
    location: "Consultorio Andamio",
    studentId: "student-pilar-soria",
    status: "confirmada",
  },
  {
    id: "event-4",
    title: "Sesion individual - Santino Diaz",
    date: "2026-03-12",
    startTime: "18:15",
    endTime: "19:00",
    professional: "Lic. Valentina Alvarez",
    location: "Colegio Belgrano",
    studentId: "student-santino-diaz",
    status: "reprogramar",
  },
  {
    id: "event-5",
    title: "Sesion individual - Mateo Campos",
    date: "2026-03-13",
    startTime: "17:30",
    endTime: "18:15",
    professional: "Lic. Valentina Alvarez",
    location: "Consultorio Andamio",
    studentId: "student-mateo-campos",
    status: "confirmada",
  },
];

export const uploadWizardSteps = [
  {
    step: "Paso 1",
    title: "Elegir tipo de archivo",
    description:
      "Definir si se trata de material, evaluacion, informe, planilla o actividad.",
  },
  {
    step: "Paso 2",
    title: "Clasificar destino",
    description:
      "Asignar institucion, curso y alumno para evitar archivos sueltos o duplicados.",
  },
  {
    step: "Paso 3",
    title: "Completar metadatos",
    description:
      "Guardar ano, area, profesional responsable y observaciones importantes.",
  },
  {
    step: "Paso 4",
    title: "Publicar o dejar interno",
    description:
      "Elegir si el archivo queda solo para profesionales o tambien visible para familias.",
  },
];

export function getInstitutionById(institutionId: string) {
  return institutions.find((institution) => institution.id === institutionId);
}

export function getCourseById(courseId: string) {
  return courses.find((course) => course.id === courseId);
}

export function getStudentById(studentId: string) {
  return students.find((student) => student.id === studentId);
}

export function getStudentFullName(studentId: string) {
  const student = getStudentById(studentId);
  return student ? `${student.firstName} ${student.lastName}` : "Alumno";
}

export function getEvaluationsForStudent(studentId: string) {
  return evaluations.filter((evaluation) => evaluation.studentId === studentId);
}

export function getFilesForStudent(studentId: string) {
  return libraryFiles.filter((file) => file.studentId === studentId);
}

export function getEventsForStudent(studentId: string) {
  return scheduleEvents.filter((event) => event.studentId === studentId);
}
