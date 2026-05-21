import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateDailyReport } from "@/lib/ai/processor";
import type { ModelConfig } from "@/components/settings/ai-settings";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminClient();

  try {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: boardsData } = await supabase
      .from("boards")
      .select("user_id");

    if (!boardsData || boardsData.length === 0) {
      return NextResponse.json({ message: "No users found" });
    }

    // Get default AI model config
    const { data: modelConfigs } = await supabase
      .from("model_configs")
      .select("*")
      .eq("enabled", true)
      .eq("is_default", true)
      .single();

    const aiCfg: ModelConfig | null = modelConfigs
      ? {
          id: modelConfigs.id,
          alias: modelConfigs.alias,
          provider: modelConfigs.provider,
          apiKey: modelConfigs.api_key,
          baseUrl: modelConfigs.base_url || "",
          model: modelConfigs.model,
          temperature: modelConfigs.temperature ?? 0.3,
          maxTokens: modelConfigs.max_tokens ?? 800,
          systemPrompt: modelConfigs.system_prompt || "",
          enabled: modelConfigs.enabled,
          isDefault: modelConfigs.is_default,
        }
      : null;

    const userIds = [...new Set(boardsData.map((b: any) => b.user_id))].map((id) => ({ user_id: id }));
    const reports: any[] = [];

    for (const { user_id } of userIds) {
      const { data: articles } = await supabase
        .from("articles")
        .select("title, summary, tags, importance_score, sentiment")
        .eq("user_id", user_id)
        .gte("created_at", yesterday)
        .order("importance_score", { ascending: false })
        .limit(50);

      if (!articles || articles.length === 0) continue;

      let reportData: { title: string; summary: string; topArticles: any[] };

      if (aiCfg && aiCfg.apiKey) {
        reportData = await generateDailyReport(
          articles.map((a) => ({
            title: a.title,
            summary: a.summary || "",
            tags: a.tags || [],
            importance: a.importance_score,
          })),
          aiCfg
        );
      } else {
        const posCount = articles.filter((a) => a.sentiment === "positive").length;
        const negCount = articles.filter((a) => a.sentiment === "negative").length;
        reportData = {
          title: `${today} 日报`,
          summary: `今日共收录 ${articles.length} 条资讯。正面 ${posCount} 条，负面 ${negCount} 条，中性 ${articles.length - posCount - negCount} 条。`,
          topArticles: articles.slice(0, 5),
        };
      }

      const { data: savedReport } = await supabase
        .from("daily_reports")
        .upsert({
          user_id,
          date: today,
          title: reportData.title,
          summary: reportData.summary,
          article_count: articles.length,
          top_articles: reportData.topArticles,
          is_sent: false,
        })
        .select()
        .single();

      const wecomKey = process.env.WECOM_WEBHOOK_KEY;
      if (wecomKey && savedReport) {
        await sendWeComMessage(wecomKey, savedReport);
        await supabase
          .from("daily_reports")
          .update({ is_sent: true, sent_at: new Date().toISOString() })
          .eq("id", savedReport.id);
      }

      reports.push({ user_id, title: reportData.title, articles: articles.length });
    }

    return NextResponse.json({ success: true, reports });
  } catch (err: any) {
    console.error("Daily cron error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function sendWeComMessage(key: string, report: any) {
  const url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`;
  const content = `📰 ${report.title}\n\n${report.summary}\n\n共 ${report.article_count} 条资讯，点击查看详情 →`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      msgtype: "text",
      text: { content },
    }),
  });
}
