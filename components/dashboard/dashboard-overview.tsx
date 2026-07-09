"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Award, BriefcaseBusiness, GraduationCap, TrendingUp, Users2, Wrench } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchDashboardData } from "@/services/mock-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";

const chartColors = ["#E51E25", "#1C1D1D", "#6B7280", "#C8C8C8", "#525252"];

export function DashboardOverview() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: fetchDashboardData });

  if (isLoading || !data) {
    return <div className="text-sm text-[var(--text-muted)]">Loading dashboard…</div>;
  }

  const skillTrend = [
    { name: "Q1", value: 54 },
    { name: "Q2", value: 61 },
    { name: "Q3", value: 74 },
    { name: "Q4", value: 81 },
  ];

  const deptSkills = [
    { name: "Engineering", value: 142 },
    { name: "Analytics", value: 96 },
    { name: "Design", value: 74 },
    { name: "Operations", value: 88 },
  ];

  const allocation = [
    { name: "Available", value: data.summary.employeesAvailable },
    { name: "Booked", value: data.summary.employeesOnProjects },
    { name: "Leave", value: 12 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Employees" value={data.summary.totalEmployees.toString()} change="12% vs last quarter" icon={Users2} />
        <KpiCard title="Total Skills" value={data.summary.totalSkills.toString()} change="+18 new skills" icon={Wrench} />
        <KpiCard title="Active Certifications" value={data.summary.activeCertifications.toString()} change="94% renewal rate" icon={Award} />
        <KpiCard title="Training Completion" value={`${data.summary.trainingCompletion}%`} change="7.2h avg weekly" icon={GraduationCap} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div>
              <p className="text-sm font-semibold text-[var(--text-heading)]">Capability growth</p>
              <p className="text-sm text-[var(--text-muted)]">Skill depth across the organization</p>
            </div>
            <div className="rounded-full bg-[var(--bg-section)] px-3 py-1 text-xs text-[var(--text-muted)]">Quarterly</div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={skillTrend}>
                  <CartesianGrid stroke="var(--grid-line)" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="var(--brand-red)" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <p className="text-sm font-semibold text-[var(--text-heading)]">Resource utilization</p>
              <p className="text-sm text-[var(--text-muted)]">Current staffing mix</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} fill="#E51E25">
                    {allocation.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <div>
              <p className="text-sm font-semibold text-[var(--text-heading)]">Department skill density</p>
              <p className="text-sm text-[var(--text-muted)]">Concentration of capability by function</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptSkills}>
                  <CartesianGrid stroke="var(--grid-line)" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="var(--brand-red)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-semibold text-[var(--text-heading)]">Recent activity</p>
                <p className="text-sm text-[var(--text-muted)]">Latest actions in the platform</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "5 certifications renewed", time: "12 mins ago" },
                { label: "Project staffing updated", time: "48 mins ago" },
                { label: "Training recommendation sent", time: "2 hrs ago" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-[var(--bg-section)] px-3 py-3 text-sm">
                  <span className="text-[var(--text-body)]">{item.label}</span>
                  <span className="text-[var(--text-muted)]">{item.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <p className="text-sm font-semibold text-[var(--text-heading)]">Upcoming renewals</p>
                <p className="text-sm text-[var(--text-muted)]">Approaching expiry dates</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.certifications.slice(0, 3).map((cert) => (
                <div key={cert.id} className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] px-3 py-3 text-sm">
                  <div>
                    <p className="font-medium text-[var(--text-heading)]">{cert.name}</p>
                    <p className="text-[var(--text-muted)]">{cert.vendor}</p>
                  </div>
                  <span className="rounded-full bg-[var(--bg-section)] px-2.5 py-1 text-xs text-[var(--text-muted)]">{cert.expiryDate}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
