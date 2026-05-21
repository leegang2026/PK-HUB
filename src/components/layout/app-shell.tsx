"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Newspaper,
  Search,
  Settings,
  Menu,
  X,
  Plus,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const navItems = [
  { name: "首页", href: "/", icon: LayoutDashboard },
  { name: "日报", href: "/daily", icon: Newspaper },
  { name: "搜索", href: "/search", icon: Search },
];

const mockBoards = [
  { id: "demo-1", name: "科技新闻", icon: "💻" },
  { id: "demo-2", name: "AI 动态", icon: "🤖" },
  { id: "demo-3", name: "投资财经", icon: "📈" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [boards, setBoards] = useState<any[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setBoards(mockBoards);
          return;
        }

        const { data } = await supabase
          .from("boards")
          .select("id, name, icon")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setBoards(data);
        } else {
          setBoards(mockBoards);
        }
      } catch {
        setBoards(mockBoards);
      }
    };
    fetchBoards();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    toast.success("已退出登录");
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-neutral-200 bg-[#f7f6f3] transition-transform duration-200 md:relative",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"
        )}
      >
        {/* Logo */}
        <div className="flex h-12 items-center border-b border-neutral-200/60 px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-800 text-xs font-bold text-white">
              N
            </div>
            <span className="text-sm font-semibold text-neutral-800">
              News Hub
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden"
          >
            <X className="h-4 w-4 text-neutral-500" />
          </button>
        </div>

        <ScrollArea className="flex-1 px-2 py-2">
          {/* Main Nav */}
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-neutral-200/60 font-medium text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-200/40"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Boards Section */}
          <div className="mt-6">
            <div className="mb-1 flex items-center px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                我的板块
              </span>
              <Link
                href="/settings?tab=boards"
                className="ml-auto rounded p-0.5 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600"
              >
                <Plus className="h-3.5 w-3.5" />
              </Link>
            </div>
            <nav className="space-y-0.5">
              {boards.map((board) => {
                const isActive = pathname === `/boards/${board.id}`;
                return (
                  <Link
                    key={board.id}
                    href={`/boards/${board.id}`}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-neutral-200/60 font-medium text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-200/40"
                    )}
                  >
                    <span className="text-sm">{board.icon || "📁"}</span>
                    <span className="truncate">{board.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </ScrollArea>

        {/* Bottom Actions */}
        <div className="border-t border-neutral-200/60 p-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
              pathname === "/settings"
                ? "bg-neutral-200/60 font-medium text-neutral-900"
                : "text-neutral-600 hover:bg-neutral-200/40"
            )}
          >
            <Settings className="h-4 w-4" />
            设置
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-200/40"
          >
            <LogOut className="h-4 w-4" />
            退出
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex h-12 items-center border-b border-neutral-200/60 bg-white px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-3 md:hidden"
          >
            <Menu className="h-5 w-5 text-neutral-600" />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-3 hidden md:block"
          >
            <Menu className="h-5 w-5 text-neutral-400" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Link href="/settings?tab=boards">
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" />
                新建板块
              </Button>
            </Link>
            <div className="h-4 w-px bg-neutral-200" />
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <User className="h-4 w-4 text-neutral-500" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
