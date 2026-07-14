import type { Certification, DashboardSummary, Employee, Project, Profile, Skill, TrainingRecord, TimesheetEntry, TimesheetWeek } from "@/types";

const firstNames = ["Ava", "Noah", "Mia", "Liam", "Sophia", "Ethan", "Emma", "Lucas", "Olivia", "Mason", "Isabella", "James", "Harper", "Benjamin", "Evelyn", "Elijah", "Amelia", "Logan", "Charlotte", "Henry"];
const lastNames = ["Patel", "Nguyen", "Johnson", "Kim", "Lee", "Garcia", "Chen", "Singh", "Brown", "Davis", "Wilson", "Martinez", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Clark", "Lewis"];
const departments = ["Engineering", "Design", "Analytics", "Operations", "Finance", "People", "Sales", "Security"];
const designations = ["Principal Engineer", "Product Designer", "Data Scientist", "Program Manager", "Finance Lead", "HR Business Partner", "Solution Architect", "Security Analyst"];
const managers = ["Nina Foster", "Adrian Cole", "Priya Menon", "Marcus Lin", "Lena Ortiz", "Daniel Brooks", "Sofia Green", "Robert Kim"];
const skills = ["React", "TypeScript", "Node.js", "Python", "Figma", "Azure", "Salesforce", "Data Modeling", "Kubernetes", "AI Strategy", "Security Review", "Compliance", "Leadership", "Product Thinking"];
const certificationsPool = ["Azure Fundamentals", "AWS Solutions Architect", "Certified ScrumMaster", "Google Cloud Professional", "CISSP", "Salesforce Administrator"];
const roles = ["Software Engineer", "Data Analyst", "Product Manager", "Cloud Architect", "Security Lead", "Solution Architect", "Engineering Manager"];
const projectNames = ["Kaara One", "Kaara Internal Project", "Microsoft", "Azure Migration", "Platform Modernization", "Data Analytics", "Security Audit", "Cloud Integration"];
const skillCategories: Array<"Technical" | "Functional" | "Domain" | "Leadership" | "Digital" | "Cloud" | "Data" | "DevOps" | "Security" | "AI"> = ["Technical", "Functional", "Domain", "Leadership", "Digital", "Cloud", "Data", "DevOps", "Security", "AI"];

const employeeAvatars = [
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=120&h=120&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
];

export function generateEmployees(count = 100): Employee[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `EMP-${String(index + 1).padStart(4, "0")}`,
    name: `${firstNames[index % firstNames.length]} ${lastNames[(index + 3) % lastNames.length]}`,
    email: `person${index + 1}@example.com`,
    department: departments[index % departments.length],
    designation: designations[index % designations.length],
    manager: managers[index % managers.length],
    experience: 2 + (index % 15),
    skills: Array.from(new Set([skills[index % skills.length], skills[(index + 2) % skills.length], skills[(index + 5) % skills.length]])),
    projects: [`Project ${index % 8 + 1}`, `Platform ${index % 5 + 1}`],
    availability: index % 5 === 0 ? "Booked" : index % 7 === 0 ? "On Leave" : "Available",
    status: index % 6 === 0 ? "Pending" : index % 9 === 0 ? "Review" : "Active",
    photo: employeeAvatars[index % employeeAvatars.length],
    proficiency: 60 + (index % 40),
  }));
}

export function generateProfile(userId = "EMP-0001"): Profile {
  const primaryRole = roles[Math.floor(Math.random() * roles.length)];
  const primarySkillSet = `${skills[Math.floor(Math.random() * skills.length)]}, ${skills[Math.min(Math.floor(Math.random() * skills.length), skills.length - 1)]}`;
  const secondarySkills = [skills[(Math.floor(Math.random() * skills.length) + 3) % skills.length], skills[(Math.floor(Math.random() * skills.length) + 5) % skills.length]];
  const certifications = [certificationsPool[Math.floor(Math.random() * certificationsPool.length)], certificationsPool[(Math.floor(Math.random() * certificationsPool.length) + 1) % certificationsPool.length]];

  return {
    id: `PROF-${userId}`,
    userId,
    primaryRole,
    primarySkillSet,
    overallExperienceYears: 4 + (Math.floor(Math.random() * 12)),
    secondarySkills,
    certifications,
    notes: "Strong delivery experience with enterprise SaaS and modern cloud platforms.",
    lastSnapshot: new Date().toISOString().split("T")[0],
    status: "Draft",
  };
}

export function generateSkills(count = 200): Skill[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `SKILL-${String(index + 1).padStart(4, "0")}`,
    name: `${skills[index % skills.length]} ${index + 1}`,
    description: `${skills[index % skills.length]} capability for enterprise delivery and modernization.`,
    category: skillCategories[index % skillCategories.length],
    tags: [skills[index % skills.length], "enterprise", "growth"],
    owner: managers[index % managers.length],
    employeesUsing: 20 + (index % 60),
    demandScore: 70 + (index % 30),
    averageProficiency: 55 + (index % 40),
  }));
}

export function generateProjects(count = 25): Project[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `PRJ-${String(index + 1).padStart(3, "0")}`,
    name: `Transformation ${index + 1}`,
    client: `Client ${index % 7 + 1}`,
    teamSize: 4 + (index % 10),
    requiredSkills: [skills[index % skills.length], skills[(index + 3) % skills.length]],
    assignedEmployees: [`EMP-${String((index % 10) + 1).padStart(4, "0")}`, `EMP-${String((index % 20) + 1).padStart(4, "0")}`],
    skillMatch: 72 + (index % 20),
    status: index % 4 === 0 ? "At Risk" : index % 6 === 0 ? "Completed" : index % 3 === 0 ? "Planning" : "Active",
  }));
}

export function generateCertifications(count = 50): Certification[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `CERT-${String(index + 1).padStart(3, "0")}`,
    name: `${skills[index % skills.length]} Certification`,
    vendor: ["Microsoft", "AWS", "Google", "Scrum.org", "Cisco", "Oracle"][index % 6],
    issueDate: `2024-0${(index % 9) + 1}-10`,
    expiryDate: `2026-0${(index % 9) + 1}-10`,
    credentialId: `CRD-${index + 100}`,
    credentialUrl: `https://example.com/cert/${index + 1}`,
    status: index % 5 === 0 ? "Expiring" : index % 8 === 0 ? "Expired" : "Active",
    employee: `EMP-${String((index % 10) + 1).padStart(4, "0")}`,
  }));
}

export function generateTraining(count = 30): TrainingRecord[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `TRN-${String(index + 1).padStart(3, "0")}`,
    title: `${skills[index % skills.length]} Foundations`,
    employee: `EMP-${String((index % 15) + 1).padStart(4, "0")}`,
    completion: 40 + (index % 60),
    hours: 8 + (index % 12),
    dueDate: `2026-0${(index % 8) + 1}-14`,
    status: index % 4 === 0 ? "Completed" : index % 5 === 0 ? "Assigned" : "In Progress",
  }));
}

export function buildDashboardSummary(employees: Employee[], skills: Skill[], certifications: Certification[]): DashboardSummary {
  return {
    totalEmployees: employees.length,
    totalSkills: skills.length,
    skillCategories: new Set(skills.map((skill) => skill.category)).size,
    activeCertifications: certifications.filter((item) => item.status === "Active").length,
    expiringCertifications: certifications.filter((item) => item.status === "Expiring").length,
    trainingCompletion: 78,
    employeesAvailable: employees.filter((item) => item.availability === "Available").length,
    employeesOnProjects: employees.filter((item) => item.projects.length > 0).length,
  };
}

export function generateTimesheetEntries(employeeId: string, startDate: string, dayCount = 7): TimesheetEntry[] {
  const entries: TimesheetEntry[] = [];
  const start = new Date(startDate);

  for (let i = 0; i < dayCount; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    // Skip weekends (Saturday = 6, Sunday = 0)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    const isLeave = Math.random() < 0.05;
    const isBench = Math.random() < 0.1;
    const isHoliday = Math.random() < 0.02;
    const isOnboarding = Math.random() < 0.03;

    let hours = 0;
    let remarks = "";

    if (isLeave) {
      hours = 0;
      remarks = "On Leave";
    } else if (isBench) {
      hours = 0;
      remarks = "Bench";
    } else if (isHoliday) {
      hours = 0;
      remarks = "Holiday";
    } else if (isOnboarding) {
      hours = 8;
      remarks = "Onboarding activities";
    } else {
      hours = 8;
      const project = projectNames[Math.floor(Math.random() * (projectNames.length - 1))];
      remarks = `Working on ${project}`;
    }

    entries.push({
      id: `TS-${employeeId}-${dateStr}`,
      employeeId,
      date: dateStr,
      project: isLeave || isBench || isHoliday ? "N/A" : projectNames[Math.floor(Math.random() * (projectNames.length - 1))],
      hours,
      remarks,
      isLeave,
      isBench,
      isHoliday,
      isOnboarding,
      status: Math.random() < 0.3 ? "Submitted" : Math.random() < 0.1 ? "Approved" : "Draft",
    });
  }

  return entries;
}

export function generateTimesheetWeek(employeeId: string, employeeName: string, employeeEmail: string, startDate: string): TimesheetWeek {
  const entries = generateTimesheetEntries(employeeId, startDate);
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  const end = new Date(startDate);
  end.setDate(end.getDate() + 6);
  const endDateStr = end.toISOString().split("T")[0];

  const statuses: Array<"Draft" | "Submitted" | "Approved" | "Rejected"> = ["Draft", "Submitted", "Approved"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: `TSW-${employeeId}-${startDate}`,
    employeeId,
    employeeName,
    employeeEmail,
    startDate,
    endDate: endDateStr,
    entries,
    totalHours,
    status,
    submittedDate: status !== "Draft" ? new Date().toISOString().split("T")[0] : undefined,
    approvedBy: status === "Approved" ? managers[Math.floor(Math.random() * managers.length)] : undefined,
    approvedDate: status === "Approved" ? new Date().toISOString().split("T")[0] : undefined,
  };
}

export function generateTimesheets(weekStartDate: string): TimesheetWeek[] {
  const employees = generateEmployees(20); // Generate 20 timesheets
  return employees.map((emp) => generateTimesheetWeek(emp.id, emp.name, emp.email, weekStartDate));
}

export function generateTimesheetForApproval(weekStartDate: string): TimesheetWeek[] {
  const timesheets = generateTimesheets(weekStartDate);
  // Set some for manager approval
  return timesheets.map((ts, index) => {
    if (index % 3 === 0) {
      ts.status = "Submitted";
      ts.submittedDate = new Date().toISOString().split("T")[0];
    }
    return ts;
  });
}
