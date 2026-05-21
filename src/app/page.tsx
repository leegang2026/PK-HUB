import { AppShell } from "@/components/layout/app-shell";
import { BoardCard } from "@/components/dashboard/board-card";
import { DailyReportCard } from "@/components/dashboard/daily-report-card";
import { SearchBar } from "@/components/dashboard/search-bar";
import { getBoards, getDailyReport } from "@/lib/supabase/queries";
import Link from "next/link";

export default async function Home() {
  const boards = await getBoards();
  const dailyReport = await getDailyReport();

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-8 md:px-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            首页
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            整合你的所有信息源，实时追踪关注动态
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Daily Report */}
        <div className="mb-8">
          <DailyReportCard report={dailyReport} />
        </div>

        {/* Boards Grid */}
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            我的板块
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board: any) => (
              <BoardCard
                key={board.id}
                id={board.id}
                name={board.name}
                icon={board.icon || "📁"}
                description={board.description || ""}
                count={board.articles?.[0]?.count || 0}
                updatedAt={new Date(board.updated_at).toLocaleDateString("zh-CN")}
              />
            ))}
            <Link
              href="/settings?tab=boards"
              className="flex items-center justify-center rounded-lg border border-dashed border-neutral-300 p-6 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
            >
              <div className="flex flex-col items-center gap-1 text-neutral-400">
                <span className="text-2xl">+</span>
                <span className="text-sm">新建板块</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
