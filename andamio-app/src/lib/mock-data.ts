import type {
  Assignment,
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
  name: "Lic. Emilia Maidana",
  role: "admin",
  roleLabel: "Administradora",
  initials: "EM",
};

export const institutions: Institution[] = [
  {
    id: "inst-andamio",
    name: "Andamio",
    city: "Salta",
    province: "Salta",
    lead: "Lic. Emilia Maidana",
    activeStudents: 1,
    activeCourses: 1,
    lastUpdate: "Actualizado hoy",
  },
  {
    id: "inst-santo-tomas",
    name: "Colegio Santo Tomas de Aquino",
    city: "Salta",
    province: "Salta",
    lead: "Prof. Rosario Maidana",
    activeStudents: 2,
    activeCourses: 2,
    lastUpdate: "Ultima visita hace 2 dias",
  },
  {
    id: "inst-belgrano",
    name: "Colegio Belgrano",
    city: "Salta",
    province: "Salta",
    lead: "Prof. Agustina Esquiu",
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
    teacher: "Emilia Maidana",
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
    teacher: "Agustina Esquiu",
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
    professional: "Prof. Rosario Maidana",
    supportFocus: "Lectoescritura",
    familyContact: "Laura Rivera - 387 512 0014",
    status: "requiere-seguimiento",
    nextSession: "2026-03-12T15:00:00",
    pendingTasks: 2,
    assignedProfessionalIds: ["11111111-1111-1111-1111-111111111112"],
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
    professional: "Prof. Rosario Maidana",
    supportFocus: "Organizacion y estudio",
    familyContact: "Juan Campos - 387 443 1882",
    status: "al-dia",
    nextSession: "2026-03-13T17:30:00",
    pendingTasks: 0,
    assignedProfessionalIds: ["11111111-1111-1111-1111-111111111112"],
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
    professional: "Lic. Emilia Maidana",
    supportFocus: "Conciencia fonologica",
    familyContact: "Micaela Soria - 387 411 9200",
    status: "nuevo-ingreso",
    nextSession: "2026-03-14T10:00:00",
    pendingTasks: 1,
    assignedProfessionalIds: ["11111111-1111-1111-1111-111111111111"],
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
    professional: "Prof. Agustina Esquiu",
    supportFocus: "Comprension lectora",
    familyContact: "Carla Diaz - 387 478 3321",
    status: "requiere-seguimiento",
    nextSession: "2026-03-12T18:15:00",
    pendingTasks: 3,
    assignedProfessionalIds: ["11111111-1111-1111-1111-111111111113"],
    notes:
      "Le cuesta sostener la entrega digital; conviene reforzar consignas claras y checklist.",
  },
];

export const assignments: Assignment[] = [
  {
    id: "assignment-1",
    studentId: "student-juana-rivera",
    title: "Lectura diaria",
    description: "Rutina corta de lectura en voz alta para sostener fluidez.",
    dueAt: "2026-03-15",
  },
  {
    id: "assignment-2",
    studentId: "student-juana-rivera",
    title: "Produccion escrita",
    description: "Escribir una secuencia breve guiada con apoyo visual.",
    dueAt: "2026-03-16",
  },
  {
    id: "assignment-3",
    studentId: "student-pilar-soria",
    title: "Practica fonologica",
    description: "Tarjetas de sonidos iniciales y lectura compartida.",
    dueAt: "2026-03-15",
  },
  {
    id: "assignment-4",
    studentId: "student-santino-diaz",
    title: "Texto expositivo parte 1",
    description: "Responder preguntas de organizacion del texto.",
    dueAt: "2026-03-16",
  },
  {
    id: "assignment-5",
    studentId: "student-santino-diaz",
    title: "Texto expositivo parte 2",
    description: "Resumir ideas principales en vietas.",
    dueAt: "2026-03-17",
  },
  {
    id: "assignment-6",
    studentId: "student-santino-diaz",
    title: "Checklist de entrega",
    description: "Completar checklist antes de subir tarea.",
    dueAt: "2026-03-18",
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
    gradeLabel: "3er grado",
    subject: "Lectoescritura",
    year: "2026",
    sizeLabel: "1.8 MB",
    uploadedAt: "2026-03-10",
    uploadedBy: "Lic. Emilia Maidana",
  },
  {
    id: "file-2",
    title: "Rutina semanal 5to B",
    kind: "Material",
    scope: "Curso",
    visibility: "Equipo",
    institutionId: "inst-santo-tomas",
    courseId: "course-5b",
    gradeLabel: "5to grado",
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
    uploadedBy: "Lic. Emilia Maidana",
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
    uploadedBy: "Lic. Emilia Maidana",
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
    uploadedBy: "Lic. Emilia Maidana",
  },
  {
    id: "file-6",
    title: "Cuadernillo compartido 1er grado",
    kind: "Material",
    scope: "Curso",
    visibility: "Equipo",
    gradeLabel: "1er grado",
    subject: "Lectoescritura",
    year: "2026",
    sizeLabel: "980 KB",
    uploadedAt: "2026-03-11",
    uploadedBy: "Lic. Emilia Maidana",
  },
  {
    id: "file-7",
    title: "Lecturas de 1er grado Santa Maria",
    kind: "Material",
    scope: "Curso",
    visibility: "Equipo",
    institutionId: "inst-santa-maria",
    gradeLabel: "1er grado",
    subject: "Lectoescritura",
    year: "2026",
    sizeLabel: "760 KB",
    uploadedAt: "2026-03-11",
    uploadedBy: "Lic. Emilia Maidana",
  },
];

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: "event-1",
    title: "Sesion individual - Juana Rivera",
    date: "2026-03-12",
    startTime: "15:00",
    endTime: "15:45",
    professionalId: "11111111-1111-1111-1111-111111111112",
    professional: "Prof. Rosario Maidana",
    location: "Andamio",
    studentId: "student-juana-rivera",
    status: "confirmada",
  },
  {
    id: "event-2",
    title: "Revision con docente 5to B",
    date: "2026-03-12",
    startTime: "16:15",
    endTime: "16:45",
    professionalId: "11111111-1111-1111-1111-111111111112",
    professional: "Prof. Rosario Maidana",
    location: "Llamada virtual",
    status: "pendiente",
  },
  {
    id: "event-3",
    title: "Sesion grupal - Taller de lenguaje",
    date: "2026-03-14",
    startTime: "10:00",
    endTime: "11:00",
    professionalId: "11111111-1111-1111-1111-111111111111",
    professional: "Lic. Emilia Maidana",
    location: "Andamio",
    studentId: "student-pilar-soria",
    status: "confirmada",
  },
  {
    id: "event-4",
    title: "Sesion individual - Santino Diaz",
    date: "2026-03-12",
    startTime: "18:15",
    endTime: "19:00",
    professionalId: "11111111-1111-1111-1111-111111111113",
    professional: "Prof. Agustina Esquiu",
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
    professionalId: "11111111-1111-1111-1111-111111111112",
    professional: "Prof. Rosario Maidana",
    location: "Andamio",
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
