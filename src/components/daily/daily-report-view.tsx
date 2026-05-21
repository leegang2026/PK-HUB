"use client";

import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArticleList } from "@/components/board/article-list";

export function DailyReportView() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            每日日报
          </h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              2026年5月19日
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              08:00 生成
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded p-1 text-neutral-400 hover:bg-neutral-100">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="rounded p-1 text-neutral-400 hover:bg-neutral-100">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-neutral-900 mb-2">今日概览</h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          今日共收录 35 条资讯。AI 行业迎来 OpenAI GPT-5 预览版发布，引发广泛关注；
          科技领域苹果 WWDC 2025 定档；航天方面 SpaceX 星舰第七次试飞取得部分成功。
          整体市场情绪偏积极，正面资讯占比 60%。
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">35 条资讯</Badge>
          <Badge variant="default" className="text-xs">60% 正面</Badge>
          <Badge variant="secondary" className="text-xs">12 条科技</Badge>
          <Badge variant="secondary" className="text-xs">8 条 AI</Badge>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-neutral-900 mb-3">精选内容</h2>
      <ArticleList articles={[]} />
    </div>
  );
}
