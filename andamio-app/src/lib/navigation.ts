import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarRange,
  FileStack,
  GraduationCap,
  LayoutDashboard,
  School,
  Upload,
  UsersRound,
} from "lucide-react";

export interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const primaryNavigationItems: NavigationItem[] = [
  {
    href: "/dashboard",
    label: "Inicio",
    icon: LayoutDashboard,
  },
  {
    href: "/upload",
    label: "Subir archivo",
    icon: Upload,
  },
  {
    href: "/students",
    label: "Alumnos",
    icon: GraduationCap,
  },
  {
    href: "/institutions",
    label: "Colegios",
    icon: Building2,
  },
  {
    href: "/schedule",
    label: "Horarios",
    icon: CalendarRange,
  },
];

export const secondaryNavigationItems: NavigationItem[] = [
  {
    href: "/library",
    label: "Biblioteca",
    icon: FileStack,
  },
  {
    href: "/courses",
    label: "Cursos",
    icon: School,
  },
  {
    href: "/professionals",
    label: "Accesos",
    icon: UsersRound,
  },
];
