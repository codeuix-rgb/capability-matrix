import { AppShell } from "@/components/layout/app-shell";
import { EmployeeTable } from "@/components/employees/employee-table";
import { Providers } from "@/app/providers";

export default function EmployeesPage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--text-heading)]">Employees</h2>
          <EmployeeTable />
        </div>
      </AppShell>
    </Providers>
  );
}
