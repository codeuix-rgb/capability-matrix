import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";
import { CertificationHub } from "@/components/certifications/certification-hub";

export default function CertificationsPage() {
  return (
    <Providers>
      <AppShell>
        <CertificationHub />
      </AppShell>
    </Providers>
  );
}
