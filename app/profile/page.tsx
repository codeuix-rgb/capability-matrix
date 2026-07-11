import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";
import { SkillManager } from "@/components/skills/skill-manager";

export default function ProfilePage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[linear-gradient(135deg,var(--card-grad-from),var(--card-grad-to))] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.05)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-red)]">Profile snapshot</p>
            <h2 className="mt-2 text-3xl font-semibold text-[var(--text-heading)]">Submit and manage your monthly capability profile.</h2>
            <p className="mt-3 max-w-2xl text-sm text-[var(--text-muted)]">Update your role, primary skills, certifications, experience, and notes from one consolidated profile editor.</p>
          </div>
          <SkillManager />
        </div>
      </AppShell>
    </Providers>
  );
}
