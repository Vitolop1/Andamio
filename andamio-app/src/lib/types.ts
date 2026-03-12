export type Role = "admin" | "profesional" | "alumno";

export type StudentStatus =
  | "al-dia"
  | "requiere-seguimiento"
  | "nuevo-ingreso";

export type EventStatus = "confirmada" | "pendiente" | "reprogramar";

export type FileScope = "Alumno" | "Curso" | "Institucion";
export type FileVisibility = "Equipo" | "Privado";

export type FileKind =
  | "Informe"
  | "Evaluacion"
  | "Material"
  | "Actividad"
  | "Planilla";

export interface ProfessionalProfile {
  id: string;
  name: string;
  role: Role;
  roleLabel: string;
  initials: string;
}

export interface ProfessionalListItem {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Institution {
  id: string;
  name: string;
  city: string;
  province: string;
  lead: string;
  activeStudents: number;
  activeCourses: number;
  lastUpdate: string;
}

export interface Course {
  id: string;
  institutionId: string;
  name: string;
  schoolYear: string;
  level: string;
  shift: string;
  teacher: string;
  studentCount: number;
  subjects: string[];
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  institutionId: string;
  courseId: string;
  professional: string;
  supportFocus: string;
  familyContact: string;
  status: StudentStatus;
  nextSession: string;
  pendingTasks: number;
  notes: string;
  assignedProfessionalIds: string[];
  portalEmail?: string;
  portalInitialPassword?: string;
  portalProfileId?: string;
}

export interface Evaluation {
  id: string;
  studentId: string;
  title: string;
  type: string;
  date: string;
  summary: string;
}

export interface Assignment {
  id: string;
  studentId?: string;
  courseId?: string;
  title: string;
  description: string;
  dueAt?: string;
}

export interface LibraryFile {
  id: string;
  title: string;
  kind: FileKind;
  scope: FileScope;
  visibility: FileVisibility;
  institutionId?: string;
  courseId?: string;
  studentId?: string;
  gradeLabel?: string;
  subject: string;
  year: string;
  sizeLabel: string;
  sizeBytes?: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  professionalId?: string;
  professional: string;
  location: string;
  studentId?: string;
  status: EventStatus;
}
