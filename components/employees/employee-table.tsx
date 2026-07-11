"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Building2, Briefcase, ChevronDown, Clock3, Eye, Filter, Search, ShieldCheck, AlertTriangle, User2 } from "lucide-react";
import { fetchEmployees } from "@/services/mock-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/types";

export function EmployeeTable() {
  const { data, isLoading } = useQuery({ queryKey: ["employees"], queryFn: fetchEmployees });
  const [globalFilter, setGlobalFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");

  const departmentOptions = useMemo(() => {
    if (!data) return ["All"];
    return ["All", ...Array.from(new Set(data.map((employee) => employee.department)))];
  }, [data]);

  const availabilityOptions = ["All", "Available", "Booked", "On Leave"];

  const filteredEmployees = useMemo(() => {
    if (!data) return [];
    const query = globalFilter.trim().toLowerCase();

    return data.filter((employee) => {
      const matchesDepartment = departmentFilter === "All" || employee.department === departmentFilter;
      const matchesAvailability = availabilityFilter === "All" || employee.availability === availabilityFilter;
      const haystack = `${employee.name} ${employee.email} ${employee.department} ${employee.designation} ${employee.manager}`.toLowerCase();
      const matchesSearch = query === "" || haystack.includes(query);
      return matchesDepartment && matchesAvailability && matchesSearch;
    });
  }, [data, globalFilter, departmentFilter, availabilityFilter]);

  const columns = useMemo<ColumnDef<Employee>[]>(() => [
    {
      accessorKey: "id",
      header: "Employee ID",
      cell: ({ getValue }) => <span className="font-medium text-[var(--text-heading)]">{getValue<string>()}</span>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--border-light)] bg-[var(--bg-section)]">
            {row.original.photo ? (
              <Image
                src={row.original.photo}
                alt={row.original.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
                unoptimized
                onError={(event) => {
                  const target = event.currentTarget as HTMLImageElement;
                  target.src = "/img/avatar-placeholder.svg";
                }}
              />
            ) : (
              <User2 size={20} className="text-[var(--text-muted)]" />
            )}
          </div>
          <div>
            <p className="font-medium text-[var(--text-heading)]">{row.original.name}</p>
            <p className="text-[var(--text-muted)] text-xs">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ getValue }) => (
        <div className="inline-flex items-center gap-2 text-[var(--text-muted)]">
          <Building2 size={14} />
          <span>{getValue<string>()}</span>
        </div>
      ),
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: ({ getValue }) => (
        <div className="inline-flex items-center gap-2 text-[var(--text-muted)]">
          <Briefcase size={14} />
          <span>{getValue<string>()}</span>
        </div>
      ),
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: ({ getValue }) => (
        <div className="inline-flex items-center gap-2 text-[var(--text-muted)]">
          <User2 size={14} />
          <span>{getValue<string>()}</span>
        </div>
      ),
    },
    {
      accessorKey: "experience",
      header: "Experience",
      cell: ({ getValue }) => (
        <div className="inline-flex items-center gap-2 text-[var(--text-muted)]">
          <Clock3 size={14} />
          <span>{getValue<number>()} yrs</span>
        </div>
      ),
    },
    {
      accessorKey: "availability",
      header: "Availability",
      cell: ({ getValue }) => {
        const availability = getValue<string>();
        const isAvailable = availability === "Available";
        return (
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${isAvailable ? "bg-emerald-100 text-emerald-700" : availability === "On Leave" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}>
            <ShieldCheck size={12} />
            {availability}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<string>();
        return (
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status === "Active" ? "bg-[var(--brand-red)]/10 text-[var(--brand-red)]" : status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}>
            {status === "Active" ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
            {status}
          </span>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data: filteredEmployees,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <div className="text-sm text-[var(--text-muted)]">Loading employee directory…</div>;

  return (
    <Card>
      <CardHeader>
        <div>
          <p className="text-sm font-semibold text-[var(--text-heading)]">Employee directory</p>
          <p className="text-sm text-[var(--text-muted)]">Search, filter, and assess workforce capability</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] px-3 py-2">
            <Search size={16} className="text-[var(--text-muted)]" />
            <input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder="Search employees"
              className="w-72 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="relative flex items-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] px-3 py-2 text-sm">
            <Filter size={16} className="text-[var(--text-muted)]" />
            <span className="text-[var(--text-heading)]">Department</span>
            <span className="ml-auto text-[var(--text-muted)]">{departmentFilter}</span>
            <ChevronDown size={16} className="text-[var(--text-muted)]" />
            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-xl border-none bg-transparent px-3 py-2 text-sm text-transparent outline-none"
            >
              {departmentOptions.map((option) => (
                <option key={option} value={option} className="bg-[var(--bg-card)] text-[var(--text-heading)] py-2 pl-4" aria-label={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="relative flex items-center gap-2 rounded-xl border border-[var(--border-light)] bg-[var(--bg-card)] px-3 py-2 text-sm">
            <Filter size={16} className="text-[var(--text-muted)]" />
            <span className="text-[var(--text-heading)]">Availability</span>
            <span className="ml-auto text-[var(--text-muted)]">{availabilityFilter}</span>
            <ChevronDown size={16} className="text-[var(--text-muted)]" />
            <select
              value={availabilityFilter}
              onChange={(event) => setAvailabilityFilter(event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-xl border-none bg-transparent px-3 py-2 text-sm text-transparent outline-none"
            >
              {availabilityOptions.map((option) => (
                <option key={option} value={option} className="bg-[var(--bg-card)] text-[var(--text-heading)] py-2 pl-4" aria-label={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="sm" onClick={() => {
            setGlobalFilter("");
            setDepartmentFilter("All");
            setAvailabilityFilter("All");
          }}>
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-[var(--border-subtle)] text-left text-[var(--text-muted)]">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-3 py-3">
                      {header.isPlaceholder ? null : (
                        <button className="flex items-center gap-1" onClick={header.column.getToggleSortingHandler()}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <ArrowUpDown size={14} />
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-section)]/70">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3 align-top">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--text-muted)]">Showing {table.getRowModel().rows.length} of {data?.length ?? 0}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
