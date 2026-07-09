import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({ title, value, change, icon: Icon, className }: { title: string; value: string; change: string; icon: LucideIcon; className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--text-muted)]">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--text-heading)]">{value}</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--bg-section)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]">
            <ArrowUpRight size={12} />
            {change}
          </div>
        </div>
        <div className="rounded-2xl bg-[var(--bg-section)] p-3 text-[var(--brand-red)]">
          <Icon size={18} />
        </div>
      </CardContent>
    </Card>
  );
}
