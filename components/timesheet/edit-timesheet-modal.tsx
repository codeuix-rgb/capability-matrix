"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { X, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { saveTimesheetEntry } from "@/services/mock-api";
import type { TimesheetWeek, TimesheetEntry } from "@/types";

interface EditTimesheetModalProps {
  timesheet: TimesheetWeek;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EditTimesheetModal({ timesheet, isOpen, onClose, onSave }: EditTimesheetModalProps) {
  const [entries, setEntries] = useState<TimesheetEntry[]>(timesheet.entries);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedEntry = selectedEntryIndex !== null ? entries[selectedEntryIndex] : null;

  const handleEntryChange = (field: keyof TimesheetEntry, value: any) => {
    if (selectedEntryIndex === null) return;

    const newEntries = [...entries];
    const updated = { ...newEntries[selectedEntryIndex] };

    if (field === "hours") {
      updated.hours = Math.max(0, Math.min(8, Number(value)));
    } else if (field === "isLeave" || field === "isBench" || field === "isHoliday" || field === "isOnboarding") {
      updated[field] = value;
      // Reset hours if marking as leave/bench/holiday
      if (value && (field === "isLeave" || field === "isBench" || field === "isHoliday")) {
        updated.hours = 0;
      }
    } else if (field === "remarks" || field === "project") {
      updated[field] = value;
    }

    newEntries[selectedEntryIndex] = updated;
    setEntries(newEntries);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save all entries
      await Promise.all(entries.map((entry) => saveTimesheetEntry(entry)));
      onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto">
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-heading)]">Edit Timesheet Entry</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {timesheet.employeeName} - {format(parseISO(timesheet.startDate), "MMM d, yyyy")} to{" "}
              {format(parseISO(timesheet.endDate), "MMM d, yyyy")}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left: Days List */}
            <div className="lg:col-span-1 space-y-2">
              <p className="text-sm font-semibold text-[var(--text-light)] uppercase tracking-wider">Days</p>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {entries.map((entry, index) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedEntryIndex(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      selectedEntryIndex === index
                        ? "bg-[var(--brand-red)] text-white"
                        : "bg-[var(--bg-section)] hover:bg-[var(--bg-section)]/80"
                    }`}
                  >
                    <p className="font-medium">{format(parseISO(entry.date), "EEE, MMM d")}</p>
                    <p className="text-xs opacity-75">{entry.hours} hrs</p>
                  </button>
                ))}
              </div>
              <div className="bg-[var(--bg-section)] rounded-lg p-3 mt-4">
                <p className="text-xs text-[var(--text-muted)] mb-1">Total Hours</p>
                <p className="text-2xl font-bold text-[var(--text-heading)]">
                  {totalHours}
                  <span className="text-xs text-[var(--text-muted)] ml-1">hrs</span>
                </p>
              </div>
            </div>

            {/* Right: Entry Details */}
            <div className="lg:col-span-2">
              {selectedEntry ? (
                <div className="space-y-4 bg-[var(--bg-section)] rounded-2xl p-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wider mb-2">
                      Date
                    </label>
                    <p className="text-lg font-semibold text-[var(--text-heading)]">
                      {format(parseISO(selectedEntry.date), "EEEE, MMMM d, yyyy")}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-card)] cursor-pointer hover:bg-[var(--bg-card)]/80">
                      <input
                        type="checkbox"
                        checked={selectedEntry.isLeave}
                        onChange={(e) => handleEntryChange("isLeave", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-[var(--text-heading)]">On Leave</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-card)] cursor-pointer hover:bg-[var(--bg-card)]/80">
                      <input
                        type="checkbox"
                        checked={selectedEntry.isBench}
                        onChange={(e) => handleEntryChange("isBench", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-[var(--text-heading)]">Bench</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-card)] cursor-pointer hover:bg-[var(--bg-card)]/80">
                      <input
                        type="checkbox"
                        checked={selectedEntry.isHoliday}
                        onChange={(e) => handleEntryChange("isHoliday", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-[var(--text-heading)]">Holiday</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-card)] cursor-pointer hover:bg-[var(--bg-card)]/80">
                      <input
                        type="checkbox"
                        checked={selectedEntry.isOnboarding}
                        onChange={(e) => handleEntryChange("isOnboarding", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-[var(--text-heading)]">Onboarding</span>
                    </label>
                  </div>

                  {!selectedEntry.isLeave && !selectedEntry.isBench && !selectedEntry.isHoliday && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wider mb-2">
                          Project
                        </label>
                        <input
                          type="text"
                          value={selectedEntry.project}
                          onChange={(e) => handleEntryChange("project", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] text-[var(--text-heading)]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wider mb-2">
                          Hours: {selectedEntry.hours} / 8
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="8"
                          step="0.5"
                          value={selectedEntry.hours}
                          onChange={(e) => handleEntryChange("hours", e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-light)] uppercase tracking-wider mb-2">
                      Remarks
                    </label>
                    <textarea
                      value={selectedEntry.remarks}
                      onChange={(e) => handleEntryChange("remarks", e.target.value)}
                      placeholder="Add your remarks here..."
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] text-[var(--text-heading)] min-h-24 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
                  <p>Select a day to edit</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 border-t border-[var(--border-subtle)] pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || timesheet.status === "Approved"}
              className="flex-1 bg-[var(--brand-red)] hover:bg-[var(--brand-red)]/90 text-white"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
