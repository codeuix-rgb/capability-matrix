import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";

export default function ReportsPage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--text-heading)]">Reports</h2>
          <p className="text-[var(--text-muted)]">Exportable reports: Excel, CSV, PDF.</p>
        </div>
      </AppShell>
    </Providers>
  );
}
