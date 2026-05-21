"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ArticleList } from "@/components/board/article-list";
import { createClient } from "@/lib/supabase/client";
import { mockArticles } from "@/lib/demo-data";

interface SearchResultsProps {
  initialQuery?: string;
}

export function SearchResults({ initialQuery = "" }: SearchResultsProps) {
  const [query, setQuery] = useState(initialQuery);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setArticles([]);
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);

      // Demo mode: filter local mock data
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        const q = query.trim().toLowerCase();
        const filtered = mockArticles.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            (a.summary && a.summary.toLowerCase().includes(q))
        );
        setArticles(filtered);
        setLoading(false);
        return;
      }

      // Real mode: query Supabase
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("user_id", user.id)
        .or(`title.ilike.%${query.trim()}%,summary.ilike.%${query.trim()}%`)
        .order("published_at", { ascending: false })
        .limit(50);

      setArticles(data || []);
      setLoading(false);
    };

    const timer = setTimeout(fetchArticles, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="输入关键词搜索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-400 focus:outline-none hover:border-neutral-300"
        />
      </div>

      {query ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              {loading ? "搜索中..." : `找到 ${articles.length} 条结果`}
            </span>
          </div>
          <ArticleList articles={articles} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <Search className="h-8 w-8 mb-2" />
          <p className="text-sm">输入关键词开始搜索</p>
        </div>
      )}
    </div>
  );
}
