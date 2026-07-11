import { buildDashboardSummary, generateCertifications, generateEmployees, generateProfile, generateProjects, generateSkills, generateTraining } from "@/lib/mock-data";

export async function fetchDashboardData() {
  const employees = generateEmployees(100);
  const skills = generateSkills(200);
  const certifications = generateCertifications(50);
  const projects = generateProjects(25);
  const trainings = generateTraining(30);

  return {
    summary: buildDashboardSummary(employees, skills, certifications),
    employees,
    skills,
    projects,
    certifications,
    trainings,
  };
}

export async function fetchEmployees() {
  return generateEmployees(100);
}

export async function fetchSkills() {
  return generateSkills(200);
}

export async function fetchProfile(userId = "EMP-0001") {
  return generateProfile(userId);
}

export async function saveProfile(profile: import("@/types").Profile) {
  return profile;
}

export async function fetchProjects() {
  return generateProjects(25);
}

export async function fetchCertifications() {
  return generateCertifications(50);
}

export async function fetchTraining() {
  return generateTraining(30);
}
