import Link from "next/link";
import { Newspaper, ChevronRight, Clock } from "lucide-react";

interface DailyReportCardProps {
  report: any;
}

export function DailyReportCard({ report }: DailyReportCardProps) {
  if (!report) {
    return (
      <div className="flex items-center gap-4 rounded-lg border border-dashed border-neutral-300 p-4 text-neutral-400">
        <Newspaper className="h-5 w-5" />
        <span className="text-sm">今日日报尚未生成，每天早上 8:00 自动推送</span>
      </div>
    );
  }

  return (
    <Link
      href="/daily"
      className="group flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4 transition-all hover:shadow-sm hover:border-neutral-300"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
        <Newspaper className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-neutral-900">{report.title || "今日日报"}</h3>
        <p className="mt-0.5 text-sm text-neutral-500 truncate">
          {report.summary || `共 ${report.article_count} 条资讯`}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1 text-xs text-neutral-400">
          <Clock className="h-3 w-3" />
          {report.created_at
            ? new Date(report.created_at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
            : "08:00"}{" "}
          生成
        </span>
        <ChevronRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
