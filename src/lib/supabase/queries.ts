import { createClient } from "./server";
import { mockBoards, mockArticles, mockDailyReport } from "@/lib/demo-data";

export async function getBoards() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mockBoards;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("boards")
    .select("*, sources(count), articles(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getBoardById(id: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mockBoards.find((b) => b.id === id) || null;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("boards")
    .select("*, sources(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function getArticles(boardId?: string, query?: string, limit = 50) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    let articles = [...mockArticles];
    if (boardId) {
      articles = articles.filter((a) => a.board_id === boardId);
    }
    if (query) {
      const q = query.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.summary && a.summary.toLowerCase().includes(q))
      );
    }
    return articles.slice(0, limit);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let dbQuery = supabase
    .from("articles")
    .select("*")
    .eq("user_id", user.id)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (boardId) {
    dbQuery = dbQuery.eq("board_id", boardId);
  }

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,summary.ilike.%${query}%`);
  }

  const { data } = await dbQuery;
  return data || [];
}

export async function getDailyReport(date?: string) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return mockDailyReport;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const targetDate = date || new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("daily_reports")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", targetDate)
    .single();

  return data;
}
