"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Rss, Globe, FileJson, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Source {
  id: string;
  name: string;
  type: "rss" | "web" | "api" | "wechat";
  url: string;
  keywords: string;
  excludeKeywords: string;
  minImportance: number;
  selector?: string;
}

const typeIcons = {
  rss: Rss,
  web: Globe,
  api: FileJson,
  wechat: MessageCircle,
};

const typeLabels = {
  rss: "RSS 订阅",
  web: "网页抓取",
  api: "API 接口",
  wechat: "微信公众号",
};

interface SourceManagerProps {
  boardId: string;
  boardName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockSources: Record<string, Source[]> = {
  "demo-1": [
    { id: "s1", name: "36氪", type: "rss", url: "https://36kr.com/feed", keywords: "科技,AI,创业", excludeKeywords: "广告", minImportance: 50 },
    { id: "s2", name: "TechCrunch 中文", type: "rss", url: "https://techcrunch.com/feed/", keywords: "", excludeKeywords: "", minImportance: 60 },
    { id: "s3", name: "BBC 科技", type: "web", url: "https://www.bbc.com/news/technology", keywords: "中国,AI,芯片", excludeKeywords: "体育", minImportance: 55, selector: ".gs-c-promo" },
  ],
  "demo-2": [
    { id: "s4", name: "机器之心", type: "rss", url: "https://www.jiqizhixin.com/rss", keywords: "大模型,OpenAI,Claude", excludeKeywords: "招聘", minImportance: 60 },
    { id: "s5", name: "Paper Digest", type: "api", url: "https://api.paperdigest.org/daily", keywords: "", excludeKeywords: "", minImportance: 70 },
  ],
  "demo-3": [
    { id: "s6", name: "财新网", type: "rss", url: "https://caixin.com/feed", keywords: "央行,股市,基金", excludeKeywords: "房产", minImportance: 65 },
    { id: "s7", name: "华尔街见闻", type: "wechat", url: "https://mp.weixin.qq.com/s/xxx", keywords: "美联储,A股,港股", excludeKeywords: "", minImportance: 60 },
  ],
};

export function SourceManager({ boardId, boardName, open, onOpenChange }: SourceManagerProps) {
  const [sources, setSources] = useState<Source[]>(mockSources[boardId] || []);
  const [editing, setEditing] = useState<Source | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState<Partial<Source>>({
    type: "rss",
    keywords: "",
    excludeKeywords: "",
    minImportance: 50,
  });

  const resetForm = () => {
    setForm({ type: "rss", keywords: "", excludeKeywords: "", minImportance: 50 });
    setEditing(null);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!form.name?.trim() || !form.url?.trim()) {
      toast.error("请填写名称和 URL");
      return;
    }

    if (editing) {
      setSources(sources.map((s) => (s.id === editing.id ? { ...s, ...form } as Source : s)));
      toast.success("来源已更新");
    } else {
      const newSource: Source = {
        id: "src-" + Date.now(),
        name: form.name.trim(),
        type: form.type as Source["type"],
        url: form.url.trim(),
        keywords: form.keywords || "",
        excludeKeywords: form.excludeKeywords || "",
        minImportance: form.minImportance || 50,
        selector: form.selector,
      };
      setSources([...sources, newSource]);
      toast.success("来源已添加");
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
    toast.success("来源已删除");
  };

  const startEdit = (source: Source) => {
    setEditing(source);
    setForm({ ...source });
    setIsAdding(true);
  };

  const startAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>管理来源 — {boardName}</DialogTitle>
        </DialogHeader>

        {isAdding ? (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">名称</label>
              <Input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="例如：36氪"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">类型</label>
              <div className="flex gap-2">
                {( ["rss", "web", "api", "wechat"] as const ).map((t) => {
                  const Icon = typeIcons[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, type: t })}
                      className={`flex items-center gap-1 rounded-md border px-3 py-2 text-xs transition-colors ${
                        form.type === t
                          ? "border-neutral-800 bg-neutral-800 text-white"
                          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {typeLabels[t]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                {form.type === "wechat" ? "公众号文章链接 / 搜狗搜索链接" : "URL 地址"}
              </label>
              <Input
                value={form.url || ""}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder={form.type === "rss" ? "https://example.com/feed" : "https://example.com"}
              />
            </div>

            {form.type === "web" && (
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">CSS 选择器（可选）</label>
                <Input
                  value={form.selector || ""}
                  onChange={(e) => setForm({ ...form, selector: e.target.value })}
                  placeholder="例如：article, .post-item"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">包含关键词（逗号分隔）</label>
                <Input
                  value={form.keywords || ""}
                  onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                  placeholder="AI, 科技"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">排除关键词（逗号分隔）</label>
                <Input
                  value={form.excludeKeywords || ""}
                  onChange={(e) => setForm({ ...form, excludeKeywords: e.target.value })}
                  placeholder="广告, 招聘"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">最小重要度：{form.minImportance || 50}</label>
              <input
                type="range"
                min={0}
                max={100}
                value={form.minImportance || 50}
                onChange={(e) => setForm({ ...form, minImportance: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={resetForm}>
                取消
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                {editing ? "保存修改" : "添加来源"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            {sources.length === 0 ? (
              <div className="py-8 text-center text-sm text-neutral-400">
                暂无来源，点击下方按钮添加
              </div>
            ) : (
              sources.map((source) => {
                const Icon = typeIcons[source.type];
                return (
                  <div
                    key={source.id}
                    className="flex items-center gap-3 rounded-md border border-neutral-100 bg-neutral-50 px-3 py-2.5"
                  >
                    <Icon className="h-4 w-4 text-neutral-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-900">{source.name}</span>
                        <span className="text-[10px] text-neutral-400 border border-neutral-200 rounded px-1">
                          {typeLabels[source.type]}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400 truncate">{source.url}</div>
                      {(source.keywords || source.excludeKeywords) && (
                        <div className="flex gap-2 mt-0.5">
                          {source.keywords && (
                            <span className="text-[10px] text-green-600">包含: {source.keywords}</span>
                          )}
                          {source.excludeKeywords && (
                            <span className="text-[10px] text-red-500">排除: {source.excludeKeywords}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(source)}>
                        <Edit2 className="h-3.5 w-3.5 text-neutral-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(source.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}

            <Button variant="outline" className="w-full gap-1 mt-2" onClick={startAdd}>
              <Plus className="h-4 w-4" />
              添加来源
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
