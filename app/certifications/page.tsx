import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";

export default function CertificationsPage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[var(--text-heading)]">Certifications</h2>
          <p className="text-[var(--text-muted)]">Certification tracker and expiry dashboard.</p>
        </div>
      </AppShell>
    </Providers>
  );
}
