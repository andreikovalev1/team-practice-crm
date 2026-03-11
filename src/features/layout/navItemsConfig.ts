import { ROUTES } from "@/app/configs/routesConfig";
import EmployeesIcon from "@/components/icons/Employee.svg";
import SkillsIcon from "@/components/icons/Skills.svg";
import LanguagesIcon from "@/components/icons/Language.svg";
import CVsIcon from "@/components/icons/CVs.svg";

export const NAV_ITEMS = [
  { name: "Employees", href: ROUTES.HOME, icon: EmployeesIcon },
  { name: "Skills", href: ROUTES.SKILLS, icon: SkillsIcon },
  { name: "Languages", href: ROUTES.LANGUAGES, icon: LanguagesIcon },
  { name: "CVs", href: ROUTES.CVS, icon: CVsIcon },
];