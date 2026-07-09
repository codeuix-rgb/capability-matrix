import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";

export default function SkillsPage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--text-heading)]">Skills</h2>
          <p className="text-[var(--text-muted)]">Master skill library and categories will appear here.</p>
        </div>
      </AppShell>
    </Providers>
  );
}
