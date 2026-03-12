import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarRange,
  FileStack,
  GraduationCap,
  LayoutDashboard,
  School,
  Settings2,
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
    href: "/library",
    label: "Biblioteca",
    icon: FileStack,
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
    href: "/courses",
    label: "Cursos",
    icon: School,
  },
  {
    href: "/professionals",
    label: "Accesos",
    icon: UsersRound,
  },
  {
    href: "/settings",
    label: "Configuracion",
    icon: Settings2,
  },
];
