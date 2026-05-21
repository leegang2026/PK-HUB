import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("boardId");
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let dbQuery = supabase
      .from("articles")
      .select("*")
      .eq("user_id", user.id)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (boardId) {
      dbQuery = dbQuery.eq("board_id", boardId);
    }

    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,summary.ilike.%${query}%`);
    }

    const { data, error } = await dbQuery;

    if (error) throw error;

    return NextResponse.json({ articles: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
