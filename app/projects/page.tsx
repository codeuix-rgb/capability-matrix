import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";

export default function ProjectsPage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--text-heading)]">Projects</h2>
          <p className="text-[var(--text-muted)]">Project listings and staffing recommendations appear here.</p>
        </div>
      </AppShell>
    </Providers>
  );
}
