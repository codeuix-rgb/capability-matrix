export type SkillCategory =
  | "Technical"
  | "Functional"
  | "Domain"
  | "Leadership"
  | "Digital"
  | "Cloud"
  | "Data"
  | "DevOps"
  | "Security"
  | "AI";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  manager: string;
  experience: number;
  skills: string[];
  projects: string[];
  availability: "Available" | "Booked" | "On Leave";
  status: "Active" | "Pending" | "Review";
  photo: string;
  proficiency: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  tags: string[];
  owner: string;
  employeesUsing: number;
  demandScore: number;
  averageProficiency: number;
}

export interface Profile {
  id: string;
  userId: string;
  primaryRole: string;
  primarySkillSet: string;
  overallExperienceYears: number;
  secondarySkills: string[];
  certifications: string[];
  notes: string;
  lastSnapshot: string;
  status: "Draft" | "Submitted" | "Approved" | "Revision Requested";
}

export interface Project {
  id: string;
  name: string;
  client: string;
  teamSize: number;
  requiredSkills: string[];
  assignedEmployees: string[];
  skillMatch: number;
  status: "Planning" | "Active" | "At Risk" | "Completed";
}

export interface Certification {
  id: string;
  name: string;
  vendor: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  status: "Active" | "Expiring" | "Expired";
  employee: string;
}

export interface TrainingRecord {
  id: string;
  title: string;
  employee: string;
  completion: number;
  hours: number;
  dueDate: string;
  status: "Assigned" | "In Progress" | "Completed";
}

export interface DashboardSummary {
  totalEmployees: number;
  totalSkills: number;
  skillCategories: number;
  activeCertifications: number;
  expiringCertifications: number;
  trainingCompletion: number;
  employeesAvailable: number;
  employeesOnProjects: number;
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  date: string;
  project: string;
  hours: number;
  remarks: string;
  isLeave: boolean;
  isBench: boolean;
  isHoliday: boolean;
  isOnboarding: boolean;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
}

export interface TimesheetWeek {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail?: string;
  startDate: string;
  endDate: string;
  entries: TimesheetEntry[];
  totalHours: number;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
  submittedDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
}
