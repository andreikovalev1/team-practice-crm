import { ROUTES } from "@/app/configs/routesConfig";
import EmployeesIcon from "@/components/icons/Employee.svg";
import SkillsIcon from "@/components/icons/Skills.svg";
import LanguagesIcon from "@/components/icons/Language.svg";
import CVsIcon from "@/components/icons/CVs.svg";
import EmployeesIconDark from "@/components/icons/EmployeeDarkTheme.svg"
import SkillsIconDark from "@/components/icons/SkillsDarkTheme.svg";
import LanguagesIconDark from "@/components/icons/LanguageDarkTheme.svg";
import CVsIconDark from "@/components/icons/CVsDarkTheme.svg";
import DepartmentsIcon from "@/components/icons/departments.svg"
import DepartmentsIconDark from "@/components/icons/departmentsDark.svg"
import PositionsIcon from "@/components/icons/position.svg"
import PositionsIconDark from "@/components/icons/positionDark.svg"
import ProjectsIcon from "@/components/icons/project.svg"
import ProjectsIconDark from "@/components/icons/projectDark.svg"

export const NAV_ITEMS = (isDarkMode: boolean) =>[
  { name: "Employees", href: ROUTES.HOME, icon: isDarkMode ? EmployeesIconDark : EmployeesIcon },
  { name: "Skills", href: ROUTES.SKILLS, icon: isDarkMode ? SkillsIconDark : SkillsIcon },
  { name: "Departments", href: ROUTES.DEPARTMENTS, icon: isDarkMode ? DepartmentsIconDark : DepartmentsIcon, isAdminOnly: true },
  { name: "Positions", href: ROUTES.POSITIONS, icon: isDarkMode ? PositionsIconDark : PositionsIcon, isAdminOnly: true },
  { name: "Languages", href: ROUTES.LANGUAGES, icon: isDarkMode ? LanguagesIconDark : LanguagesIcon },
  { name: "Projects", href: ROUTES.PROJECTS, icon: isDarkMode ? ProjectsIconDark : ProjectsIcon, isAdminOnly: true },
  { name: "CVs", href: ROUTES.CVS, icon: isDarkMode ? CVsIconDark : CVsIcon },
];