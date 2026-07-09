import { AppShell } from "@/components/layout/app-shell";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { EmployeeTable } from "@/components/employees/employee-table";
import { Providers } from "@/app/providers";

export default function HomePage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[linear-gradient(135deg,var(--card-grad-from),var(--card-grad-to))] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-red)]">Executive overview</p>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--text-heading)]">Align talent, skills, and delivery with confidence.</h2>
                <p className="mt-3 max-w-2xl text-sm text-[var(--text-muted)]">Surface gaps, match people to projects, and manage certifications from one premium control center.</p>
              </div>
              <div className="rounded-2xl border border-[var(--border-light)] bg-white/70 px-4 py-3 text-sm text-[var(--text-muted)]">
                Organization health: 92% aligned
              </div>
            </div>
          </div>

          <DashboardOverview />
          <EmployeeTable />
        </div>
      </AppShell>
    </Providers>
  );
}
