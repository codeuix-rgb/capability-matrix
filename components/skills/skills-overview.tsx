"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BrainCircuit, BriefcaseBusiness, Cloud, Code2, Database, Filter, Layers3, Search, ShieldCheck, Sparkles, TrendingUp, Users2, Wrench, X, Zap, type LucideIcon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { fetchSkills } from "@/services/mock-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkillManager } from "@/components/skills/skill-manager";
import type { SkillCategory } from "@/types";

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

export function SkillsOverview() {
  const { data, isLoading } = useQuery({ queryKey: ["skills"], queryFn: fetchSkills });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | SkillCategory>("All");

  const filteredSkills = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((skill) => {
      const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
      const haystack = `${skill.name} ${skill.description} ${skill.category} ${skill.tags.join(" ")}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [data, search, selectedCategory]);

  const summaryCards = useMemo(() => {
    if (!data) {
      return [];
    }

    const categories = new Set(data.map((skill) => skill.category)).size;
    const highDemand = data.filter((skill) => skill.demandScore >= 85).length;
    const avgProficiency = Math.round(data.reduce((sum, skill) => sum + skill.averageProficiency, 0) / data.length);

    return [
      { title: "Total Skills", value: data.length.toString(), hint: "Across the capability library", icon: Layers3 },
      { title: "Skill Categories", value: categories.toString(), hint: "Breadth of capability coverage", icon: Filter },
      { title: "High Demand", value: highDemand.toString(), hint: "Skills with strong delivery pull", icon: TrendingUp },
      { title: "Avg. Proficiency", value: `${avgProficiency}%`, hint: "Current benchmark across talent", icon: Users2 },
    ];
  }, [data]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const prioritySkills = useMemo(() => {
    if (!data) {
      return [];
    }

    return [...data]
      .filter((skill) => skill.averageProficiency < 80)
      .sort((a, b) => b.demandScore - a.demandScore)
      .slice(0, 4);
  }, [data]);

  const totalPages = Math.ceil(filteredSkills.length / pageSize);
  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSkills.slice(start, start + pageSize);
  }, [filteredSkills, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  if (isLoading) {
    return <div className="text-sm text-[var(--text-muted)]">Loading skills library…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-[0_15px_45px_rgba(0,0,0,0.06)] lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--bg-section)]/80 px-3 py-1 text-sm font-medium text-[var(--brand-red)] shadow-sm">
            <Sparkles size={16} />
            Skill intelligence overview
          </div>
          <h2 className="text-2xl font-semibold text-[var(--text-heading)]">Build capability with clarity and confidence</h2>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Discover the most valuable skills, spot gaps quickly, and guide development planning with a polished, insight-rich view of the talent landscape.
          </p>
        </div>
        <Button className="w-fit rounded-full">
          Explore roadmap
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="overflow-hidden">
              <CardContent className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[var(--text-muted)]">{item.title}</p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--text-heading)]">{item.value}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{item.hint}</p>
                </div>
                <div className="rounded-2xl bg-[var(--bg-section)] p-3 text-[var(--brand-red)]">
                  <Icon size={18} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div>
              <p className="text-sm font-semibold text-[var(--text-heading)]">Skill library</p>
              <p className="text-sm text-[var(--text-muted)]">Search, filter, and prioritize capabilities</p>
            </div>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <Button variant="secondary" className="gap-2 rounded-full">
                  <Sparkles size={16} />
                  Manage skills
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[68vw] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                  <div className="flex flex-col gap-4 rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-[var(--text-heading)]">Edit your skill set</Dialog.Title>
                      <Dialog.Description className="mt-1 text-sm text-[var(--text-muted)]">
                        Update your personal capability profile with the live skill manager and save changes instantly.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close asChild>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Close
                      </Button>
                    </Dialog.Close>
                  </div>
                  <div className="mt-6 rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-section)] p-5">
                    <SkillManager />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)]/70 p-3 md:flex-row md:items-center">
              <label className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] px-3 py-2 shadow-sm">
                <Search size={16} className="text-[var(--text-muted)]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search skills or capabilities"
                  className="w-full border-none bg-transparent text-sm outline-none"
                />
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] px-3 py-2 shadow-sm">
                <Filter size={16} className="text-[var(--text-muted)]" />
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value as "All" | SkillCategory)}
                  className="border-none bg-transparent text-sm outline-none"
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "All" ? "All categories" : option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {paginatedSkills.map((skill) => {
                const meta = categoryMeta[skill.category];
                const Icon = meta.icon;
                return (
                  <div key={skill.id} className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
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
              })}
            </div>

            {paginatedSkills.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[var(--border-light)] bg-[var(--bg-section)]/60 p-6 text-center text-sm text-[var(--text-muted)]">
                No skills match that search yet. Try another keyword or category.
              </div>
            )}

            {filteredSkills.length > pageSize && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)]/70 px-4 py-3 text-sm text-[var(--text-muted)]">
                <span>
                  Showing {Math.min(pageSize, filteredSkills.length)} of {filteredSkills.length} results
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((current) => Math.max(current - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((current) => Math.min(current + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-semibold text-[var(--text-heading)]">Development priority</p>
                <p className="text-sm text-[var(--text-muted)]">Where to invest next</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {prioritySkills.map((skill) => (
                <div key={skill.id} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)]/70 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-[var(--text-heading)]">{skill.name}</p>
                      <p className="text-sm text-[var(--text-muted)]">Demand {skill.demandScore}/100</p>
                    </div>
                    <span className="rounded-full bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-[var(--brand-red)]">{skill.averageProficiency}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-[var(--bg-card)]">
                    <div className="h-2 rounded-full bg-[var(--brand-red)]" style={{ width: `${skill.averageProficiency}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-semibold text-[var(--text-heading)]">Top skill clusters</p>
                <p className="text-sm text-[var(--text-muted)]">Popular capability themes</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["Technical", "Cloud", "AI", "Leadership"] as SkillCategory[]).map((category) => {
                const count = data?.filter((skill) => skill.category === category).length ?? 0;
                const meta = categoryMeta[category];
                const Icon = meta.icon;
                return (
                  <div key={category} className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-[var(--bg-section)] p-2 text-[var(--brand-red)]">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-heading)]">{category}</p>
                        <p className="text-sm text-[var(--text-muted)]">{meta.description}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-[var(--bg-section)] px-2.5 py-1 text-xs text-[var(--text-muted)]">{count} skills</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
