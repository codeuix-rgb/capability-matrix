"use client";

import { Bell, ChevronLeft, ChevronRight, Moon, Search, SunMedium, UserCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { navigationItems } from "@/constants/navigation";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { sidebarCollapsed, searchOpen, theme, setSidebarCollapsed, setSearchOpen, setTheme, user, login, logout } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleAuth = () => {
    if (user) {
      logout();
      return;
    }

    login({ name: "Alicia Chen", email: "alicia.chen@example.com" });
  };

  const pageTitle = useMemo(() => {
    const current = navigationItems.find((item) => item.id === pathname.split("/").filter(Boolean)[0]);
    return current?.label ?? "Dashboard";
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-body)]">
      <div className="flex min-h-screen">
        <aside className={cn("hidden border-r border-[var(--border-subtle)] bg-[var(--bg-section)]/80 lg:flex lg:flex-col sticky top-0 h-screen", sidebarCollapsed ? "w-24" : "w-72")}> 
          <div className="flex items-center justify-between rounded-2xl bg-[linear-gradient(135deg,var(--card-grad-from),var(--card-grad-to))] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden">
                <Image src="/img/logo.kaara.png" alt="Capability Matrix" width={40} height={40} className="object-cover w-auto h-auto" style={{ width: "auto", height: "auto" }} />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="text-sm font-semibold text-[var(--text-heading)]">Capability Matrix</p>
                  <p className="text-xs text-[var(--text-muted)]">Enterprise Ops</p>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
          </div>

          <nav className="mt-6 flex-1 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = (item.href === "/" ? "dashboard" : item.id) === (pathname.split("/").filter(Boolean)[0] ?? "dashboard");
              const linkBase = sidebarCollapsed
                ? "flex w-full items-center justify-center rounded-2xl py-3 text-sm transition px-0"
                : "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition";
              return (
                <Link
                  key={item.id}
                  href={item.href ?? "/"}
                  className={cn(
                    linkBase,
                    active
                      ? "bg-[var(--brand-red)] text-white"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg-section)]/40"
                  )}
                >
                  <Icon size={18} className={sidebarCollapsed ? "mx-auto" : ""} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-card)]/80 p-3 text-sm">
            <p className="font-semibold text-[var(--text-heading)]">Next review</p>
            <p className="mt-1 text-[var(--text-muted)]">8 certifications renew this week</p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--text-light)]">{pageTitle}</p>
                <h1 className="text-xl font-semibold text-[var(--text-heading)]">Workforce capability command center</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setSearchOpen(true)}>
                  <Search size={16} />
                </Button>
                <Button variant="outline" size="icon">
                  <Bell size={16} />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                  {theme === "light" ? <Moon size={16} /> : <SunMedium size={16} />}
                </Button>
                <Button variant="secondary" className="gap-2 rounded-full" onClick={handleAuth}>
                  <UserCircle2 size={16} />
                  <span className="hidden sm:inline">{user ? user.name : "Sign in"}</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
