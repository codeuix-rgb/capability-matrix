import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";
import { SkillManager } from "@/components/skills/skill-manager";
import { SkillsOverview } from "@/components/skills/skills-overview";

export default function SkillsPage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-6">
          <SkillsOverview />
          {/* <SkillManager /> */}
        </div>
      </AppShell>
    </Providers>
  );
}
