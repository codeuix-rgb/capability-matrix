"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BrainCircuit, BriefcaseBusiness, Cloud, Code2, Database, Filter, Layers3, Search, ShieldCheck, Sparkles, Users2, Wrench, Zap, type LucideIcon } from "lucide-react";
import { fetchProfile, fetchSkills, saveProfile } from "@/services/mock-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import type { Profile, Skill, SkillCategory } from "@/types";

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

function buildTagList(items: string[]) {
  return items.join(", ");
}

function parseTagList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function SkillCard({ skill, selected, onSelect }: { skill: Skill; selected: boolean; onSelect: () => void }) {
  const Icon = categoryMeta[skill.category].icon;

  return (
    <div className={`group rounded-2xl border p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-200 ${selected ? "border-[var(--brand-red)] bg-[var(--bg-section)]" : "border-[var(--border-subtle)] bg-[var(--bg-card)]"} hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]`}>
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
      <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-muted)]">
        <span>{skill.employeesUsing} active users</span>
        <span>{skill.owner}</span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm text-[var(--text-muted)]">{skill.averageProficiency}% proficiency</span>
        <Button size="sm" variant="outline" onClick={onSelect}>
          Select
        </Button>
      </div>
    </div>
  );
}

export function SkillManager() {
  const { user, login, logout } = useAppStore();
  const queryClient = useQueryClient();

  const profileQuery = useQuery<Profile>({
    queryKey: ["profile", "EMP-0001"],
    queryFn: () => fetchProfile("EMP-0001"),
  });

  const skillsQuery = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  const saveMutation = useMutation({
    mutationFn: saveProfile,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["profile", "EMP-0001"] }),
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | SkillCategory>("All");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [profileForm, setProfileForm] = useState({
    primaryRole: "",
    primarySkillSet: "",
    overallExperienceYears: 0,
    secondarySkills: "",
    certifications: "",
    notes: "",
  });
  const [saveMessage, setSaveMessage] = useState("");
  const [selectionMessage, setSelectionMessage] = useState("");

  useEffect(() => {
    if (profileQuery.data) {
      setProfileForm({
        primaryRole: profileQuery.data.primaryRole,
        primarySkillSet: profileQuery.data.primarySkillSet,
        overallExperienceYears: profileQuery.data.overallExperienceYears,
        secondarySkills: buildTagList(profileQuery.data.secondarySkills),
        certifications: buildTagList(profileQuery.data.certifications),
        notes: profileQuery.data.notes,
      });
    }
  }, [profileQuery.data]);

  const filteredSkills = useMemo(() => {
    if (!skillsQuery.data) return [];
    return skillsQuery.data.filter((skill) => {
      const matchesCategory = selectedCategory === "All" || skill.category === selectedCategory;
      const haystack = `${skill.name} ${skill.description} ${skill.category} ${skill.tags.join(" ")}`.toLowerCase();
      return matchesCategory && haystack.includes(search.toLowerCase());
    });
  }, [skillsQuery.data, search, selectedCategory]);

  const selectedSkillOptions = useMemo(() => {
    if (!selectedSkill) return [];
    return [
      { label: "Proficiency", value: `${selectedSkill.averageProficiency}%` },
      { label: "Demand score", value: `${selectedSkill.demandScore}/100` },
      { label: "Team adoption", value: `${selectedSkill.employeesUsing} users` },
    ];
  }, [selectedSkill]);

  const isLoading = profileQuery.isLoading || skillsQuery.isLoading;
  const isSaving = saveMutation.isPending ?? false;

  const handleSave = async () => {
    if (!profileQuery.data || !user) return;
    const payload: Profile = {
      ...profileQuery.data,
      primaryRole: profileForm.primaryRole,
      primarySkillSet: profileForm.primarySkillSet,
      overallExperienceYears: profileForm.overallExperienceYears,
      secondarySkills: parseTagList(profileForm.secondarySkills),
      certifications: parseTagList(profileForm.certifications),
      notes: profileForm.notes,
      status: "Submitted",
      lastSnapshot: new Date().toISOString().split("T")[0],
    };

    await saveMutation.mutateAsync(payload);
    setSaveMessage("Capability snapshot saved successfully.");
    setSelectionMessage("");
  };

  const handleSignin = () => {
    login({ name: "Jane Doe", email: "jane.doe@example.com" });
  };

  if (isLoading) {
    return <div className="text-sm text-[var(--text-muted)]">Loading capability manager…</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <p className="text-sm font-semibold text-[var(--text-heading)]">Capability profile</p>
            <p className="text-sm text-[var(--text-muted)]">Update your role, skills, experience, certifications, and notes for the current snapshot.</p>
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
              <Button variant="secondary" size="sm" onClick={handleSignin}>
                Sign in to edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1.2fr_0.95fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-heading)]">Snapshot status</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{profileQuery.data?.status} • last updated {profileQuery.data?.lastSnapshot}</p>
                </div>
                <span className="rounded-full bg-[var(--bg-card)] px-3 py-1 text-xs font-semibold text-[var(--text-heading)]">{profileQuery.data?.status}</span>
              </div>
            </div>

            <div className="grid gap-4">
              <label className="flex flex-col gap-2 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Primary role</span>
                <input
                  value={profileForm.primaryRole}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, primaryRole: event.target.value }))}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-section)] px-3 py-3 text-sm outline-none"
                  placeholder="e.g. Cloud Architect"
                />
              </label>

              <label className="flex flex-col gap-2 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Primary skill set</span>
                <input
                  value={profileForm.primarySkillSet}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, primarySkillSet: event.target.value }))}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-section)] px-3 py-3 text-sm outline-none"
                  placeholder="E.g. Azure, Kubernetes, DevOps"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Overall IT experience</span>
                  <input
                    type="number"
                    min={0}
                    value={profileForm.overallExperienceYears}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, overallExperienceYears: Number(event.target.value) }))}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-section)] px-3 py-3 text-sm outline-none"
                  />
                </label>
                <label className="flex flex-col gap-2 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Secondary skills</span>
                  <input
                    value={profileForm.secondarySkills}
                    onChange={(event) => setProfileForm((prev) => ({ ...prev, secondarySkills: event.target.value }))}
                    className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-section)] px-3 py-3 text-sm outline-none"
                    placeholder="Add optional secondary skills"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Certifications</span>
                <input
                  value={profileForm.certifications}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, certifications: event.target.value }))}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-section)] px-3 py-3 text-sm outline-none"
                  placeholder="Comma-separated certifications"
                />
              </label>

              <label className="flex flex-col gap-2 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Notes</span>
                <textarea
                  value={profileForm.notes}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, notes: event.target.value }))}
                  rows={4}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-section)] px-3 py-3 text-sm outline-none"
                  placeholder="Write a brief capability summary or update note"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2">
                <Button
                  className="rounded-full"
                  onClick={handleSave}
                  disabled={!user || isSaving}
                >
                  {isSaving ? "Saving snapshot…" : user ? "Save capability snapshot" : "Sign in to save"}
                </Button>
                {selectionMessage && <p className="text-sm text-[var(--text-muted)]">{selectionMessage}</p>}
              </div>
              {saveMessage && <p className="text-sm text-[var(--text-muted)]">{saveMessage}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
              <CardHeader>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-heading)]">Skill library snapshot</p>
                  <p className="text-sm text-[var(--text-muted)]">Browse capabilities to align your profile updates.</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {filteredSkills.slice(0, 4).map((skill) => (
                    <SkillCard key={skill.id} skill={skill} selected={selectedSkill?.id === skill.id} onSelect={() => {
                      setSelectedSkill(skill);
                      setSelectionMessage(`${skill.name} selected.`);
                    }} />
                  ))}
                </div>
                {filteredSkills.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[var(--border-light)] bg-[var(--bg-section)]/60 p-4 text-sm text-[var(--text-muted)]">
                    No skills match this search. Refine your query or select another category.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-section)]">
              <CardHeader>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-heading)]">Selected skill details</p>
                  <p className="text-sm text-[var(--text-muted)]">Reference the chosen capability while editing your snapshot.</p>
                </div>
              </CardHeader>
              <CardContent>
                {selectedSkill ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-[var(--bg-card)] p-4">
                      <p className="font-semibold text-[var(--text-heading)]">{selectedSkill.name}</p>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">{selectedSkill.description}</p>
                    </div>
                    <div className="space-y-2">
                      {selectedSkillOptions.map((option) => (
                        <div key={option.label} className="rounded-2xl bg-[var(--bg-card)] p-4">
                          <p className="text-sm text-[var(--text-muted)]">{option.label}</p>
                          <p className="mt-1 font-semibold text-[var(--text-heading)]">{option.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)] p-4 text-sm text-[var(--text-muted)]">
                    Select a skill card to see details and align your profile snapshot with the capability library.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
