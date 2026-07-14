"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, CalendarDays, ExternalLink, Search, ShieldCheck, Sparkles, TrendingUp, UserRound } from "lucide-react";
import { fetchCertifications } from "@/services/mock-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Certification } from "@/types";

const statusFilters = ["All", "Active", "Expiring", "Expired"] as const;

type CertificationStatusFilter = (typeof statusFilters)[number];

const statusStyles: Record<Certification["status"], string> = {
  Active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  Expiring: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  Expired: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
};

export function CertificationHub() {
  const { data, isLoading } = useQuery({ queryKey: ["certifications"], queryFn: fetchCertifications });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CertificationStatusFilter>("All");
  const [visibleCount, setVisibleCount] = useState(3);

  const filteredCertifications = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((cert) => {
      const haystack = `${cert.name} ${cert.vendor} ${cert.employee} ${cert.status}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || cert.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const visibleCertifications = filteredCertifications.slice(0, visibleCount);
  const hasMoreCertifications = visibleCount < filteredCertifications.length;

  useEffect(() => {
    setVisibleCount(3);
  }, [search, statusFilter]);

  const summary = useMemo(() => {
    if (!data) {
      return { active: 0, expiring: 0, expired: 0, total: 0 };
    }

    return {
      total: data.length,
      active: data.filter((cert) => cert.status === "Active").length,
      expiring: data.filter((cert) => cert.status === "Expiring").length,
      expired: data.filter((cert) => cert.status === "Expired").length,
    };
  }, [data]);

  if (isLoading) {
    return <div className="text-sm text-[var(--text-muted)]">Loading certification hub…</div>;
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-[linear-gradient(135deg,var(--bg-card),var(--bg-section))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--bg-section)]/90 px-3 py-1 text-sm font-medium text-[var(--brand-red)]">
              <Sparkles size={16} />
              Certification assurance hub
            </div>
            <h2 className="text-2xl font-semibold text-[var(--text-heading)]">Keep credentials current and visible for every team</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
              Monitor renewals, spotlight expiring credentials, and give managers a dependable view of compliance readiness across the workforce.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" className="rounded-full">
              <CalendarDays size={16} />
              Renewal calendar
            </Button>
            <Button className="rounded-full">
              <ShieldCheck size={16} />
              Compliance review
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Managed credentials", value: summary.total.toString(), hint: "Across the workforce", icon: Award },
          { title: "Active", value: summary.active.toString(), hint: "Currently valid", icon: ShieldCheck },
          { title: "Expiring", value: summary.expiring.toString(), hint: "Need action soon", icon: TrendingUp },
          { title: "Expired", value: summary.expired.toString(), hint: "Require follow-up", icon: CalendarDays },
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
        <div>
          <p className="text-lg font-semibold text-[var(--text-heading)]">Credential inventory</p>
          <p className="text-sm text-[var(--text-muted)]">Search by expertise, employee, or renewal status</p>
        </div>
        <label className="flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--bg-section)] px-3 py-2 text-sm text-[var(--text-muted)]">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search certification"
            className="w-52 border-none bg-transparent outline-none"
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

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.85fr]">
        <div className="space-y-4">
          {visibleCertifications.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-[var(--text-heading)]">{cert.name}</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[cert.status]}`}>{cert.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">{cert.vendor} • {cert.credentialId}</p>
                  </div>
                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] bg-[var(--bg-section)] px-3 py-2 text-sm font-medium text-[var(--text-heading)]">
                    <ExternalLink size={16} />
                    View credential
                  </a>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)]/70 p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-light)]">Issued</p>
                    <p className="mt-2 font-semibold text-[var(--text-heading)]">{cert.issueDate}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)]/70 p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-light)]">Renewal</p>
                    <p className="mt-2 font-semibold text-[var(--text-heading)]">{cert.expiryDate}</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)]/70 p-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-light)]">Owner</p>
                    <div className="mt-2 flex items-center gap-2">
                      <UserRound size={16} className="text-[var(--brand-red)]" />
                      <span className="font-semibold text-[var(--text-heading)]">{cert.employee}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredCertifications.length === 0 && (
            <div className="rounded-[24px] border border-dashed border-[var(--border-light)] bg-[var(--bg-section)]/60 p-8 text-center text-sm text-[var(--text-muted)]">
              No credentials match this search yet. Try another keyword or status.
            </div>
          )}

          {hasMoreCertifications && (
            <Button variant="outline" className="w-full rounded-full" onClick={() => setVisibleCount((count) => Math.min(count + 3, filteredCertifications.length))}>
              Show more credentials
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-semibold text-[var(--text-heading)]">Renewal watchlist</p>
                <p className="text-sm text-[var(--text-muted)]">Priority actions this week</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Azure Fundamentals", detail: "Needs renewal in 10 days", tone: "Expiring" },
                { title: "AWS Architect", detail: "Review evidence and re-issue", tone: "Active" },
                { title: "CISSP", detail: "Expired credential requires manager follow-up", tone: "Expired" },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)]/70 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-[var(--text-heading)]">{item.title}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[item.tone as Certification["status"]]}`}>{item.tone}</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-semibold text-[var(--text-heading)]">Compliance posture</p>
                <p className="text-sm text-[var(--text-muted)]">A forward-looking snapshot</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[linear-gradient(135deg,var(--bg-section),var(--bg-card))] p-4">
                <p className="text-sm font-semibold text-[var(--text-heading)]">Renewal readiness</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                  The credential base is healthy, with most roles staying current and a manageable number of certifications entering renewal in the next cycle.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 text-sm text-[var(--text-muted)]">
                Use this hub to prepare manager nudges, maintain audit confidence, and surface the right training and certification investments.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
