import Link from "next/link";
import { ExternalLink, Heart, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: string;
  title: string;
  summary: string | null;
  url: string;
  author: string | null;
  published_at: string;
  importance_score: number;
  sentiment: string;
  tags: string[];
  is_read: boolean;
}

interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
        <p className="text-sm">暂无文章</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {articles.map((article) => (
        <div
          key={article.id}
          className={`group rounded-lg border p-4 transition-all hover:shadow-sm ${
            article.is_read
              ? "border-neutral-100 bg-neutral-50/50"
              : "border-neutral-200 bg-white"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {!article.is_read && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )}
                <Link
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-neutral-900 hover:underline line-clamp-1"
                >
                  {article.title}
                </Link>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-neutral-600 line-clamp-2">
                {article.summary || "暂无摘要"}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                {article.author && <span>{article.author}</span>}
                <span>
                  {article.published_at
                    ? new Date(article.published_at).toLocaleString("zh-CN")
                    : ""}
                </span>
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {(article.tags || []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge
                variant={article.sentiment === "positive" ? "default" : "secondary"}
                className="text-[10px]"
              >
                {article.sentiment === "positive"
                  ? "正面"
                  : article.sentiment === "negative"
                  ? "负面"
                  : "中性"}
              </Badge>
              <span className="text-xs font-medium text-neutral-500">
                重要度 {article.importance_score}
              </span>
              <button className="rounded p-1 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
