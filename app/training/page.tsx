import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";

export default function TrainingPage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--text-heading)]">Training</h2>
          <p className="text-[var(--text-muted)]">Training catalog, assignments, and progress.</p>
        </div>
      </AppShell>
    </Providers>
  );
}
