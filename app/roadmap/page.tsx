import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/app/providers";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Circle, Sparkles } from "lucide-react";

const roadmapPillars = [
  {
    title: "Employee profile management",
    description: "Editable role, skill, experience, certification, and note fields that form the monthly capability snapshot.",
    status: "In progress",
  },
  {
    title: "Manager-led workflows",
    description: "Monthly update requests, approvals, and revision loops that replace fragmented message chains.",
    status: "Planned",
  },
  {
    title: "Governance and reporting",
    description: "Snapshots, audit logs, exports, and dashboards to make workforce capability visible and reviewable.",
    status: "Planned",
  },
];

const deliveryPhases = [
  {
    title: "Foundation",
    items: ["Finalize requirements", "Define core data model", "Stand up role-based access"],
  },
  {
    title: "Workflow automation",
    items: ["Trigger monthly updates", "Create reminder tasks", "Support manager approvals"],
  },
  {
    title: "Governance and reporting",
    items: ["Add audit history", "Enable exports", "Publish capability dashboards"],
  },
  {
    title: "Expansion",
    items: ["Teams notifications", "Email parsing", "Optional WhatsApp integration"],
  },
];

const nextActions = [
  "Complete the profile submission experience and monthly snapshot model.",
  "Implement the manager-triggered update flow with task creation and reminders.",
  "Add role-aware approval and audit history views.",
];

export default function RoadmapPage() {
  return (
    <Providers>
      <AppShell>
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[linear-gradient(135deg,var(--card-grad-from),var(--card-grad-to))] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-red)]">PRD & roadmap</p>
                <h2 className="mt-2 text-3xl font-semibold text-[var(--text-heading)]">A structured path to deliver the Capability Matrix MVP.</h2>
                <p className="mt-3 max-w-3xl text-sm text-[var(--text-muted)]">
                  This roadmap converts the product brief into a practical delivery plan focused on workflow automation, governance, and reporting for the app.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border-light)] bg-white/70 px-4 py-3 text-sm text-[var(--text-muted)]">
                MVP target: 8–10 weeks
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-heading)]">Product vision</p>
                  <p className="text-sm text-[var(--text-muted)]">Core outcome for the first release</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-[var(--text-body)]">
                  The app will replace ad-hoc capability updates with a structured monthly flow that lets employees submit updates, managers review them, and leaders export reliable capability insight.
                </p>
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-heading)]">
                    <Sparkles size={16} className="text-[var(--brand-red)]" />
                    Key success criteria
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                    <li>• Monthly updates are triggered in a consistent workflow.</li>
                    <li>• Managers can review and approve submissions quickly.</li>
                    <li>• Leadership gets a usable export and dashboard view.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-heading)]">Immediate priorities</p>
                  <p className="text-sm text-[var(--text-muted)]">What to complete next</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {nextActions.map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-2xl border border-[var(--border-subtle)] bg-white/70 px-3 py-3 text-sm">
                    <CheckCircle2 size={16} className="mt-0.5 text-[var(--brand-red)]" />
                    <span className="text-[var(--text-body)]">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {roadmapPillars.map((pillar) => (
              <Card key={pillar.title}>
                <CardHeader>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-heading)]">{pillar.title}</p>
                    <p className="text-sm text-[var(--text-muted)]">{pillar.status}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--text-body)]">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-semibold text-[var(--text-heading)]">Delivery phases</p>
                <p className="text-sm text-[var(--text-muted)]">A practical build sequence for the MVP</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliveryPhases.map((phase) => (
                <div key={phase.title} className="rounded-2xl border border-[var(--border-subtle)] p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-heading)]">
                    <Circle size={14} className="text-[var(--brand-red)]" />
                    {phase.title}
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <ArrowRight size={14} className="text-[var(--brand-red)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </Providers>
  );
}
