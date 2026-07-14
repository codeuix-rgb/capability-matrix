import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";
import { ProjectPortfolio } from "@/components/projects/project-portfolio";

export default function ProjectsPage() {
  return (
    <Providers>
      <AppShell>
        <ProjectPortfolio />
      </AppShell>
    </Providers>
  );
}
