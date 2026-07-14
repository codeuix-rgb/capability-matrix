"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BriefcaseBusiness, CalendarClock, Search, Sparkles, TrendingUp, Users2, Wrench } from "lucide-react";
import { fetchProjects } from "@/services/mock-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Project } from "@/types";

const tabs = ["Portfolio", "Pipeline"] as const;
const statusFilters = ["All", "Active", "At Risk", "Planning", "Completed"] as const;

type ProjectTab = (typeof tabs)[number];
type ProjectStatusFilter = (typeof statusFilters)[number];

const statusStyles: Record<Project["status"], string> = {
  Planning: "bg-[var(--bg-section)] text-[var(--text-muted)]",
  Active: "bg-[var(--bg-section)] text-[var(--brand-red)]",
  "At Risk": "bg-[var(--bg-section)] text-amber-600",
  Completed: "bg-[var(--bg-section)] text-emerald-600",
};

export function ProjectPortfolio() {
  const { data, isLoading } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const [activeTab, setActiveTab] = useState<ProjectTab>("Portfolio");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("All");
  const [visibleCount, setVisibleCount] = useState(3);

  const filteredProjects = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((project) => {
      const haystack = `${project.name} ${project.client} ${project.requiredSkills.join(" ")}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < filteredProjects.length;

  useEffect(() => {
    setVisibleCount(3);
  }, [search, statusFilter, activeTab]);

  const summary = useMemo(() => {
    if (!data) {
      return { total: 0, active: 0, atRisk: 0, avgMatch: 0, teamSize: 0 };
    }

    const avgMatch = Math.round(data.reduce((sum, project) => sum + project.skillMatch, 0) / data.length);
    const teamSize = data.reduce((sum, project) => sum + project.teamSize, 0);

    return {
      total: data.length,
      active: data.filter((project) => project.status === "Active").length,
      atRisk: data.filter((project) => project.status === "At Risk").length,
      avgMatch,
      teamSize,
    };
  }, [data]);

  if (isLoading) {
    return <div className="text-sm text-[var(--text-muted)]">Loading project portfolio…</div>;
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-[linear-gradient(135deg,var(--bg-card),var(--bg-section))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--bg-section)]/90 px-3 py-1 text-sm font-medium text-[var(--brand-red)]">
              <Sparkles size={16} />
              Project readiness center
            </div>
            <h2 className="text-2xl font-semibold text-[var(--text-heading)]">Turn capability demand into a confident delivery plan</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
              Track delivery momentum, identify staffing risk early, and keep project teams aligned with the right mix of skills and expertise.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" className="rounded-full">
              <CalendarClock size={16} />
              Review schedule
            </Button>
            <Button className="rounded-full">
              Open staffing view
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Live projects", value: summary.total.toString(), hint: "Across the portfolio", icon: BriefcaseBusiness },
          { title: "Active delivery", value: summary.active.toString(), hint: "Projects in motion", icon: TrendingUp },
          { title: "At risk", value: summary.atRisk.toString(), hint: "Need attention this cycle", icon: Wrench },
          { title: "Avg. match", value: `${summary.avgMatch}%`, hint: "Skill fit to demand", icon: Users2 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
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

      <div className="flex flex-col gap-4 rounded-[24px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[0_15px_45px_rgba(0,0,0,0.05)] md:flex-row md:items-center md:justify-between">
        <div className="inline-flex rounded-full border border-[var(--border-light)] bg-[var(--bg-section)] p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab ? "bg-[var(--brand-red)] text-white" : "text-[var(--text-muted)]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--bg-section)] px-3 py-2 text-sm text-[var(--text-muted)]">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search project or client"
            className="w-44 border-none bg-transparent outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 shadow-[0_8px_25px_rgba(0,0,0,0.04)]">
        {statusFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setStatusFilter(filter)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${statusFilter === filter ? "bg-[var(--brand-red)] text-white" : "bg-[var(--bg-section)] text-[var(--text-muted)]"}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {activeTab === "Portfolio" ? (
        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="space-y-4">
            {visibleProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-[var(--text-heading)]">{project.name}</p>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[project.status]}`}>{project.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">{project.client} • {project.teamSize} teammates</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--bg-section)] px-3 py-2 text-sm font-semibold text-[var(--text-heading)]">
                      {project.skillMatch}% fit
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-[var(--text-muted)]">Capability alignment</span>
                        <span className="font-semibold text-[var(--text-heading)]">{project.skillMatch}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[var(--bg-section)]">
                        <div className="h-2 rounded-full bg-[var(--brand-red)]" style={{ width: `${project.skillMatch}%` }} />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)] px-3 py-2 text-sm text-[var(--text-muted)]">
                      {project.assignedEmployees.length} assigned staff
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.requiredSkills.map((skill) => (
                      <span key={skill} className="rounded-full border border-[var(--border-light)] bg-[var(--bg-card)] px-2.5 py-1 text-xs text-[var(--text-muted)]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredProjects.length === 0 && (
              <div className="rounded-[24px] border border-dashed border-[var(--border-light)] bg-[var(--bg-section)]/60 p-8 text-center text-sm text-[var(--text-muted)]">
                No projects match this search yet. Try a different client or capability keyword.
              </div>
            )}

            {hasMoreProjects && (
              <Button variant="outline" className="w-full rounded-full" onClick={() => setVisibleCount((count) => Math.min(count + 3, filteredProjects.length))}>
                Show more projects
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-heading)]">Delivery pulse</p>
                  <p className="text-sm text-[var(--text-muted)]">What needs attention right now</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Cross-team staffing review", detail: "3 projects need additional cloud capacity" },
                  { label: "Training handoff", detail: "2 delivery leads need AI enablement" },
                  { label: "Client readiness", detail: "1 engagement is behind on capability coverage" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)]/70 p-3">
                    <p className="font-medium text-[var(--text-heading)]">{item.label}</p>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{item.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-heading)]">Portfolio momentum</p>
                  <p className="text-sm text-[var(--text-muted)]">Capacity and opportunity overview</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)]/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-muted)]">Shared team coverage</span>
                    <span className="text-lg font-semibold text-[var(--text-heading)]">{summary.teamSize} people</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-[var(--bg-card)]">
                    <div className="h-2 rounded-full bg-[var(--brand-red)]" style={{ width: "74%" }} />
                  </div>
                </div>
                <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 text-sm text-[var(--text-muted)]">
                  Teams are trending well on delivery readiness, with strongest momentum in cloud, data, and leadership-focused engagements.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-semibold text-[var(--text-heading)]">Upcoming delivery focus</p>
                <p className="text-sm text-[var(--text-muted)]">Where the next wave of capability investment is needed</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Cloud modernization sprint", detail: "5 specialists needed in Azure, Kubernetes, and platform reliability", badge: "Next 30 days" },
                { title: "AI adoption enablement", detail: "Leadership and delivery teams need targeted coaching coverage", badge: "High priority" },
                { title: "Governance uplift", detail: "Compliance readiness for three new client engagements", badge: "Watchlist" },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)]/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-[var(--text-heading)]">{item.title}</p>
                    <span className="rounded-full bg-[var(--bg-card)] px-2.5 py-1 text-xs font-medium text-[var(--brand-red)]">{item.badge}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-semibold text-[var(--text-heading)]">Executive view</p>
                <p className="text-sm text-[var(--text-muted)]">A guided snapshot for leaders</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[linear-gradient(135deg,var(--bg-section),var(--bg-card))] p-4">
                <p className="text-sm font-semibold text-[var(--text-heading)]">Capacity outlook</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                  The current portfolio is stable, but demand clusters suggest a short-term need for specialists in cloud and AI delivery.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 text-sm text-[var(--text-muted)]">
                Use this view to prioritize staffing conversations, align training investments, and improve client confidence with a visible roadmap.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
