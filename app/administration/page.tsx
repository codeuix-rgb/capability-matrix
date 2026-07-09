import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";

export default function AdministrationPage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--text-heading)]">Administration</h2>
          <p className="text-[var(--text-muted)]">Users, roles, departments, and audit logs.</p>
        </div>
      </AppShell>
    </Providers>
  );
}
