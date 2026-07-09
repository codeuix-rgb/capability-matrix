"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Filter, Search } from "lucide-react";
import { fetchEmployees } from "@/services/mock-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/types";

export function EmployeeTable() {
  const { data, isLoading } = useQuery({ queryKey: ["employees"], queryFn: fetchEmployees });
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<Employee>[]>(() => [
    { accessorKey: "id", header: "Employee ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "department", header: "Department" },
    { accessorKey: "designation", header: "Designation" },
    { accessorKey: "manager", header: "Manager" },
    { accessorKey: "experience", header: "Experience" },
    { accessorKey: "availability", header: "Availability" },
    { accessorKey: "status", header: "Status" },
  ], []);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (isLoading) return <div className="text-sm text-[var(--text-muted)]">Loading employee directory…</div>;

  return (
    <Card>
      <CardHeader>
        <div>
          <p className="text-sm font-semibold text-[var(--text-heading)]">Employee directory</p>
          <p className="text-sm text-[var(--text-muted)]">Search, filter, and assess workforce capability</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-light)] px-3 py-2">
            <Search size={16} className="text-[var(--text-muted)]" />
            <input value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} placeholder="Search employees" className="bg-transparent text-sm outline-none" />
          </div>
          <Button variant="outline"><Filter size={16} /> Filter</Button>
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
                <tr key={row.id} className="border-b border-[var(--border-subtle)] last:border-0">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
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
