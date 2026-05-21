"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ArticleList } from "@/components/board/article-list";
import { BoardHeader } from "@/components/board/board-header";
import { SourceManager } from "@/components/board/source-manager";

interface BoardPageClientProps {
  board: any;
  articles: any[];
}

export function BoardPageClient({ board, articles }: BoardPageClientProps) {
  const [sourceManagerOpen, setSourceManagerOpen] = useState(false);

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 py-8 md:px-12">
        <BoardHeader
          name={board.name}
          icon={board.icon || "📁"}
          description={board.description || ""}
          count={articles.length}
          onSettingsClick={() => setSourceManagerOpen(true)}
        />
        <div className="mt-6">
          <ArticleList articles={articles} />
        </div>
      </div>
      <SourceManager
        boardId={board.id}
        boardName={board.name}
        open={sourceManagerOpen}
        onOpenChange={setSourceManagerOpen}
      />
    </AppShell>
  );
}
