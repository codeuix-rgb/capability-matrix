import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";

export default function SettingsPage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--text-heading)]">Settings</h2>
          <p className="text-[var(--text-muted)]">Organization and platform settings.</p>
        </div>
      </AppShell>
    </Providers>
  );
}
