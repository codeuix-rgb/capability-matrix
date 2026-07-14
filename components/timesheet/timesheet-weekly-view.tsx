"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Edit2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { fetchTimesheets } from "@/services/mock-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TimesheetWeek } from "@/types";
// import { EditTimesheetModal } from "./edit-timesheet-modal";

export function TimesheetWeeklyView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetWeek | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekStartStr = format(weekStart, "yyyy-MM-dd");

  const { data: timesheets, isLoading, refetch } = useQuery({
    queryKey: ["timesheets", weekStartStr],
    queryFn: () => fetchTimesheets(weekStartStr),
  });

  const weekDays = useMemo(() => {
    const days = [];
    const current = new Date(weekStart);
    while (current <= weekEnd) {
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        days.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [weekStart, weekEnd]);

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const handleEdit = (timesheet: TimesheetWeek) => {
    setSelectedTimesheet(timesheet);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsModalOpen(false);
    setSelectedTimesheet(null);
    refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 border-emerald-200";
      case "Submitted":
        return "bg-blue-50 border-blue-200";
      case "Rejected":
        return "bg-red-50 border-red-200";
      default:
        return "bg-amber-50 border-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="text-emerald-600" size={16} />;
      case "Submitted":
        return <Clock className="text-blue-600" size={16} />;
      case "Rejected":
        return <AlertCircle className="text-red-600" size={16} />;
      default:
        return <AlertCircle className="text-amber-600" size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-emerald-700";
      case "Submitted":
        return "text-blue-700";
      case "Rejected":
        return "text-red-700";
      default:
        return "text-amber-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[var(--text-muted)]">Loading timesheets...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft size={18} />
          </Button>
          <div className="text-center">
            <p className="text-sm text-[var(--text-muted)]">Week of</p>
            <p className="text-lg font-semibold text-[var(--text-heading)]">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight size={18} />
          </Button>
        </div>

        {/* Timesheets Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {timesheets?.map((timesheet) => (
            <Card
              key={timesheet.id}
              className={`cursor-pointer transition hover:shadow-lg border-2 ${getStatusColor(timesheet.status)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--text-heading)] truncate">{timesheet.employeeName}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{timesheet.employeeEmail}</p>
                  </div>
                  <div className="flex items-center gap-1">{getStatusIcon(timesheet.status)}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Day-wise hours */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[var(--text-light)] uppercase tracking-wider">Daily Hours</p>
                  <div className="grid grid-cols-5 gap-1">
                    {weekDays.map((day) => {
                      const dayEntry = timesheet.entries.find(
                        (e) => e.date === format(day, "yyyy-MM-dd")
                      );
                      return (
                        <div
                          key={format(day, "yyyy-MM-dd")}
                          className="flex flex-col items-center rounded-lg bg-[var(--bg-card)]/50 p-2 text-center"
                        >
                          <p className="text-xs font-semibold text-[var(--text-muted)]">{format(day, "EEE").substring(0, 2)}</p>
                          <p className="text-sm font-bold text-[var(--text-heading)]">{dayEntry?.hours ?? 0}h</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total Hours */}
                <div className="rounded-lg bg-[var(--bg-card)]/50 p-3">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Total Hours</p>
                  <p className="text-2xl font-bold text-[var(--text-heading)]">
                    {timesheet.totalHours}
                    <span className="text-xs text-[var(--text-muted)] ml-1">hrs</span>
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusText(timesheet.status)}`}>
                    {getStatusIcon(timesheet.status)}
                    {timesheet.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleEdit(timesheet)}
                  disabled={timesheet.status === "Approved"}
                >
                  <Edit2 size={14} className="mr-2" />
                  {timesheet.status === "Approved" ? "View" : "Edit"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {timesheets?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[var(--text-muted)]">No timesheets found for this week.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Modal */}
      {/* {isModalOpen && selectedTimesheet && (
        <EditTimesheetModal timesheet={selectedTimesheet} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
      )} */}
    </>
  );
}
