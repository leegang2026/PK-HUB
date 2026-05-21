import { BoardPageClient } from "@/components/board/board-page-client";
import { getBoardById, getArticles } from "@/lib/supabase/queries";

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const board = await getBoardById(id);
  const articles = await getArticles(id);

  if (!board) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-500">
        板块不存在或无权访问
      </div>
    );
  }

  return <BoardPageClient board={board} articles={articles} />;
}
