"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BrainCircuit, BriefcaseBusiness, Cloud, Code2, Database, Filter, Layers3, Search, ShieldCheck, Sparkles, TrendingUp, Users2, Wrench, Zap, type LucideIcon } from "lucide-react";
import { fetchSkills } from "@/services/mock-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import type { Skill, SkillCategory } from "@/types";

const categoryMeta: Record<SkillCategory, { icon: LucideIcon; description: string }> = {
  Technical: { icon: Code2, description: "Engineering and delivery capabilities" },
  Functional: { icon: Layers3, description: "Process and business operations" },
  Domain: { icon: BriefcaseBusiness, description: "Industry and solution expertise" },
  Leadership: { icon: Sparkles, description: "People and strategic influence" },
  Digital: { icon: Zap, description: "Modern digital transformation" },
  Cloud: { icon: Cloud, description: "Cloud architecture and enablement" },
  Data: { icon: Database, description: "Insights, analytics, and models" },
  DevOps: { icon: Wrench, description: "Automation and platform reliability" },
  Security: { icon: ShieldCheck, description: "Risk, compliance, and resilience" },
  AI: { icon: BrainCircuit, description: "AI strategy and implementation" },
};

const categoryOptions: Array<"All" | SkillCategory> = ["All", "Technical", "Functional", "Domain", "Leadership", "Digital", "Cloud", "Data", "DevOps", "Security", "AI"];

function SkillCard({ skill }: { skill: Skill }) {
  const Icon = categoryMeta[skill.category].icon;

  return (
    <div className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[var(--bg-section)] p-2.5 text-[var(--brand-red)]">
            <Icon size={18} />
          </div>
          <div>
            <p className="font-semibold text-[var(--text-heading)]">{skill.name}</p>
            <p className="text-xs text-[var(--text-muted)]">{skill.category}</p>
          </div>
        </div>
        <span className="rounded-full bg-[var(--bg-section)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">{skill.demandScore}/100</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{skill.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {skill.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-[var(--border-light)] bg-[var(--bg-section)] px-2.5 py-1 text-xs text-[var(--text-muted)]">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--text-muted)]">Proficiency</span>
          <span className="font-medium text-[var(--text-heading)]">{skill.averageProficiency}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-[var(--bg-section)]">
          <div className="h-2 rounded-full bg-[var(--brand-red)]" style={{ width: `${skill.averageProficiency}%` }} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-muted)]">
        <span>{skill.employeesUsing} active users</span>
        <span>{skill.owner}</span>
      </div>
    </div>
  );
}

export function SkillManager() {
  const { user, login, logout } = useAppStore();
  const { data, isLoading } = useQuery({ queryKey: ["skills"], queryFn: fetchSkills });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | SkillCategory>("All");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const filteredSkills = useMemo(() => {
    if (!data) return [];
    return data.filter((skill) => {
      const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
      const haystack = `${skill.name} ${skill.description} ${skill.category} ${skill.tags.join(" ")}`.toLowerCase();
      return matchesCategory && haystack.includes(search.toLowerCase());
    });
  }, [data, search, selectedCategory]);

  const selectedSkillOptions = useMemo(() => {
    if (!selectedSkill) return [];
    return [
      { label: "Update proficiency", value: `${selectedSkill.averageProficiency}%` },
      { label: "Review demand score", value: `${selectedSkill.demandScore}/100` },
      { label: "Team adoption", value: `${selectedSkill.employeesUsing} users` },
    ];
  }, [selectedSkill]);

  if (isLoading) {
    return <div className="text-sm text-[var(--text-muted)]">Loading skill manager…</div>;
  }

  const [signinName, setSigninName] = useState("");
  const [signinEmail, setSigninEmail] = useState("");

  function handleSignin() {
    if (!signinName || !signinEmail) return;
    login({ name: signinName, email: signinEmail });
    setSigninName("");
    setSigninEmail("");
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <p className="text-sm font-semibold text-[var(--text-heading)]">Your skill toolkit</p>
            <p className="text-sm text-[var(--text-muted)]">Personalize your skills once you are logged in.</p>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-sm">
                  <div className="font-medium text-[var(--text-heading)]">{user.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{user.email}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  placeholder="Name"
                  value={signinName}
                  onChange={(e) => setSigninName(e.target.value)}
                  className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-sm outline-none"
                />
                <input
                  placeholder="Email"
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                  className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-sm outline-none"
                />
                <Button variant="secondary" size="sm" onClick={handleSignin}>
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Search skills</span>
              <input
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-section)] px-3 py-3 text-sm text-[var(--text-body)] outline-none"
                placeholder="Search skill tags or categories"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Category</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value as "All" | SkillCategory)}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-section)] px-3 py-3 text-sm text-[var(--text-body)] outline-none"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "All" ? "All skill categories" : option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredSkills.slice(0, 4).map((skill) => (
                  <div key={skill.id} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--text-heading)]">{skill.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{skill.category}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setSelectedSkill(skill)}>
                        Select
                      </Button>
                    </div>
                    <div className="mt-3 text-sm text-[var(--text-muted)]">{skill.description}</div>
                  </div>
                ))}
              </div>
              {filteredSkills.length === 0 && (
                <div className="rounded-2xl border border-dashed border-[var(--border-light)] bg-[var(--bg-section)]/60 p-6 text-center text-sm text-[var(--text-muted)]">
                  No skills match this search. Refine your query or select another category.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)] p-4">
              <p className="text-sm font-semibold text-[var(--text-heading)]">Selected skill</p>
              {selectedSkill ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl bg-[var(--bg-card)] p-4">
                    <p className="font-semibold text-[var(--text-heading)]">{selectedSkill.name}</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{selectedSkill.description}</p>
                  </div>
                  <div className="grid gap-3">
                    {selectedSkillOptions.map((item) => (
                      <div key={item.label} className="rounded-2xl bg-[var(--bg-card)] p-4">
                        <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
                        <p className="mt-1 font-semibold text-[var(--text-heading)]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <Button disabled={!user} className="w-full rounded-full">
                    {user ? "Save changes" : "Sign in to save"}
                  </Button>
                  {!user && <p className="text-xs text-[var(--text-muted)]">You need to sign in with your credentials to make updates.</p>}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-4 text-sm text-[var(--text-muted)]">
                  Select a skill card to see details and update recommendations.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
