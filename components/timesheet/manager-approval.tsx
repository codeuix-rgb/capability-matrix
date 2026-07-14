"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { fetchTimesheetsForApproval, approveTimesheet, rejectTimesheet } from "@/services/mock-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TimesheetWeek } from "@/types";
import { TimesheetDetailModal } from "./timesheet-detail-modal";

interface ManagerApprovalProps {
  weekStartDate?: string;
}

export function ManagerApproval({ weekStartDate }: ManagerApprovalProps) {
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetWeek | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectingId, setIsRejectingId] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const startDate = weekStartDate || format(startOfWeek(new Date()), "yyyy-MM-dd");

  const { data: timesheets, isLoading, refetch } = useQuery({
    queryKey: ["timesheets-approval", startDate],
    queryFn: () => fetchTimesheetsForApproval(startDate),
  });

  const pendingTimesheets = useMemo(() => {
    return timesheets?.filter((ts) => ts.status === "Submitted") || [];
  }, [timesheets]);

  const approvedTimesheets = useMemo(() => {
    return timesheets?.filter((ts) => ts.status === "Approved") || [];
  }, [timesheets]);

  const rejectedTimesheets = useMemo(() => {
    return timesheets?.filter((ts) => ts.status === "Rejected") || [];
  }, [timesheets]);

  const handleViewDetails = (timesheet: TimesheetWeek) => {
    setSelectedTimesheet(timesheet);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async (timesheetId: string) => {
    setIsApproving(true);
    try {
      await approveTimesheet(timesheetId, "Manager");
      refetch();
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (timesheetId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    try {
      await rejectTimesheet(timesheetId, rejectionReason);
      setRejectionReason("");
      setIsRejectingId(null);
      refetch();
    } catch (error) {
      console.error("Failed to reject timesheet:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[var(--text-muted)]">Loading timesheets for approval...</div>
      </div>
    );
  }

  const renderTimesheetCard = (timesheet: TimesheetWeek, showRejectForm: boolean = false) => (
    <Card key={timesheet.id} className="border-2 border-[var(--border-light)] hover:shadow-lg transition">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--text-heading)] truncate">{timesheet.employeeName}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{timesheet.employeeEmail}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {format(parseISO(timesheet.startDate), "MMM d")} - {format(parseISO(timesheet.endDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hours Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[var(--bg-section)] p-3">
            <p className="text-xs text-[var(--text-muted)] mb-1">Total Hours</p>
            <p className="text-2xl font-bold text-[var(--text-heading)]">{timesheet.totalHours}h</p>
          </div>
          <div className="rounded-lg bg-[var(--bg-section)] p-3">
            <p className="text-xs text-[var(--text-muted)] mb-1">Days Logged</p>
            <p className="text-2xl font-bold text-[var(--text-heading)]">{timesheet.entries.length}</p>
          </div>
        </div>

        {/* Submission Info */}
        {timesheet.submittedDate && (
          <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-section)] p-2 rounded">
            Submitted on {format(parseISO(timesheet.submittedDate), "MMM d, yyyy")}
          </div>
        )}

        {/* Rejection reason for rejected timesheets */}
        {timesheet.rejectionReason && (
          <div className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
            <p className="font-semibold mb-1">Rejection Reason:</p>
            {timesheet.rejectionReason}
          </div>
        )}

        {/* Approval Info */}
        {timesheet.approvedDate && (
          <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
            Approved by {timesheet.approvedBy} on {format(parseISO(timesheet.approvedDate), "MMM d, yyyy")}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleViewDetails(timesheet)}
          >
            <Eye size={14} className="mr-2" />
            View Details
          </Button>

          {timesheet.status === "Submitted" && !showRejectForm && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleApprove(timesheet.id)}
                disabled={isApproving}
              >
                <CheckCircle size={14} className="mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setIsRejectingId(timesheet.id)}
              >
                <XCircle size={14} className="mr-1" />
                Reject
              </Button>
            </div>
          )}

          {showRejectForm && (
            <div className="space-y-2 p-3 bg-[var(--bg-section)] rounded-lg">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full px-2 py-1 rounded border border-[var(--border-light)] bg-[var(--bg-card)] text-[var(--text-heading)] text-sm min-h-20 resize-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleReject(timesheet.id)}
                >
                  Confirm Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsRejectingId(null);
                    setRejectionReason("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Pending Approval Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-[var(--text-heading)]">Pending Approval</h3>
            {pendingTimesheets.length > 0 && (
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                {pendingTimesheets.length}
              </span>
            )}
          </div>

          {pendingTimesheets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingTimesheets.map((timesheet) => (
                <div key={timesheet.id}>
                  {renderTimesheetCard(timesheet, isRejectingId === timesheet.id)}
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-[var(--border-light)]">
              <CardContent className="py-12 text-center">
                <CheckCircle className="mx-auto text-emerald-600 mb-2" size={32} />
                <p className="text-[var(--text-muted)]">No timesheets pending approval</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Approved Timesheets Section */}
        {approvedTimesheets.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-emerald-600" size={20} />
              <h3 className="text-lg font-semibold text-[var(--text-heading)]">Approved Timesheets</h3>
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-bold">
                {approvedTimesheets.length}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {approvedTimesheets.map((timesheet) => renderTimesheetCard(timesheet))}
            </div>
          </div>
        )}

        {/* Rejected Timesheets Section */}
        {rejectedTimesheets.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="text-red-600" size={20} />
              <h3 className="text-lg font-semibold text-[var(--text-heading)]">Rejected Timesheets</h3>
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-600 text-white text-xs font-bold">
                {rejectedTimesheets.length}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rejectedTimesheets.map((timesheet) => renderTimesheetCard(timesheet))}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedTimesheet && (
        <TimesheetDetailModal
          timesheet={selectedTimesheet}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </>
  );
}
