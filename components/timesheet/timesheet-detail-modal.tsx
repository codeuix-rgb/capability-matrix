"use client";

import { format, parseISO } from "date-fns";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TimesheetWeek } from "@/types";

interface TimesheetDetailModalProps {
  timesheet: TimesheetWeek;
  isOpen: boolean;
  onClose: () => void;
}

export function TimesheetDetailModal({ timesheet, isOpen, onClose }: TimesheetDetailModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Create CSV data
    const csvContent = [
      ["Timesheet Details"],
      ["Employee Name", timesheet.employeeName],
      ["Employee ID", timesheet.employeeId],
      ["Email", timesheet.employeeEmail],
      ["Week", `${format(parseISO(timesheet.startDate), "MMM d, yyyy")} - ${format(parseISO(timesheet.endDate), "MMM d, yyyy")}`],
      ["Status", timesheet.status],
      [],
      ["Date", "Project", "Hours", "Remarks", "Leave", "Bench", "Holiday", "Onboarding"],
      ...timesheet.entries.map((entry) => [
        format(parseISO(entry.date), "MMM d, yyyy"),
        entry.project,
        entry.hours,
        entry.remarks,
        entry.isLeave ? "Yes" : "No",
        entry.isBench ? "Yes" : "No",
        entry.isHoliday ? "Yes" : "No",
        entry.isOnboarding ? "Yes" : "No",
      ]),
      [],
      ["Total Hours", "", timesheet.totalHours],
    ];

    const csv = csvContent.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Timesheet_${timesheet.employeeName}_${timesheet.startDate}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto">
        <CardHeader className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-heading)]">Timesheet Details</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">{timesheet.employeeName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[var(--bg-section)] rounded-lg">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Employee ID</p>
              <p className="font-semibold text-[var(--text-heading)]">{timesheet.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Email</p>
              <p className="font-semibold text-[var(--text-heading)] truncate">{timesheet.employeeEmail}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Status</p>
              <p className="font-semibold text-[var(--text-heading)]">{timesheet.status}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Total Hours</p>
              <p className="font-semibold text-[var(--text-heading)]">{timesheet.totalHours}h</p>
            </div>
          </div>

          {/* Week Range */}
          <div className="p-4 bg-[var(--bg-section)] rounded-lg">
            <p className="text-xs text-[var(--text-muted)] mb-2">Week</p>
            <p className="text-lg font-semibold text-[var(--text-heading)]">
              {format(parseISO(timesheet.startDate), "MMMM d, yyyy")} - {format(parseISO(timesheet.endDate), "MMMM d, yyyy")}
            </p>
          </div>

          {/* Daily Entries */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-heading)] mb-3">Daily Entries</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {timesheet.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-[var(--bg-section)] rounded-lg border border-[var(--border-light)] hover:border-[var(--border-subtle)] transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-[var(--text-heading)]">
                        {format(parseISO(entry.date), "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">{entry.project}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[var(--text-heading)]">{entry.hours}h</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {entry.isLeave ? "Leave" : entry.isBench ? "Bench" : entry.isHoliday ? "Holiday" : entry.isOnboarding ? "Onboarding" : "Worked"}
                      </p>
                    </div>
                  </div>
                  {entry.remarks && (
                    <p className="text-sm text-[var(--text-muted)]">
                      <span className="font-semibold text-[var(--text-heading)]">Remarks:</span> {entry.remarks}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap mt-2">
                    {entry.isLeave && <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">Leave</span>}
                    {entry.isBench && <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">Bench</span>}
                    {entry.isHoliday && <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Holiday</span>}
                    {entry.isOnboarding && <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">Onboarding</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approval Details */}
          {timesheet.status === "Approved" && (
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="font-semibold text-emerald-900 mb-1">Approved</p>
              <p className="text-sm text-emerald-700">
                Approved by {timesheet.approvedBy} on {format(parseISO(timesheet.approvedDate!), "MMMM d, yyyy")}
              </p>
            </div>
          )}

          {timesheet.status === "Rejected" && timesheet.rejectionReason && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-red-900 mb-1">Rejected</p>
              <p className="text-sm text-red-700">{timesheet.rejectionReason}</p>
            </div>
          )}

          {/* Close Button */}
          <div className="flex gap-3 border-t border-[var(--border-subtle)] pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
