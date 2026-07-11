import { BriefcaseBusiness, FileText, GraduationCap, LayoutDashboard, Settings, ShieldCheck, Sparkles, Users2, BadgeCheck, Route, UserCircle2 } from "lucide-react";

export const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "employees", label: "Employees", icon: Users2, href: "/employees" },
  { id: "skills", label: "Skills", icon: Sparkles, href: "/skills" },
  { id: "profile", label: "Profile", icon: UserCircle2, href: "/profile" },
  { id: "projects", label: "Projects", icon: BriefcaseBusiness, href: "/projects" },
  { id: "certifications", label: "Certifications", icon: BadgeCheck, href: "/certifications" },
  { id: "training", label: "Training", icon: GraduationCap, href: "/training" },
  { id: "reports", label: "Reports", icon: FileText, href: "/reports" },
  { id: "roadmap", label: "Roadmap", icon: Route, href: "/roadmap" },
  { id: "administration", label: "Administration", icon: ShieldCheck, href: "/administration" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export const skillCategories = ["Technical", "Functional", "Domain", "Leadership", "Digital", "Cloud", "Data", "DevOps", "Security", "AI"];

export const departmentOptions = ["Engineering", "Design", "Analytics", "Operations", "Finance", "People", "Sales", "Security"];
