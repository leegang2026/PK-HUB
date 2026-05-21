"use client";

import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  Gauge,
  Copy,
  Hash,
  Tag,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  DEFAULT_CRITERIA,
  INDUSTRY_TEMPLATES,
  buildFullSystemPrompt,
  type JudgmentCriteria,
  type ImportanceLevel,
} from "@/lib/ai/criteria-defaults";

type SectionKey = "relevance" | "importance" | "duplicate" | "sentiment" | "summary" | "tags";

interface SectionConfig {
  key: SectionKey;
  enabledKey: keyof JudgmentCriteria;
  promptKey: keyof JudgmentCriteria;
  title: string;
  icon: React.ReactNode;
  color: string;
}

const sections: SectionConfig[] = [
  {
    key: "relevance",
    enabledKey: "relevance_enabled",
    promptKey: "relevance_prompt",
    title: "相关性判断",
    icon: <Target className="h-4 w-4" />,
    color: "text-blue-600",
  },
  {
    key: "importance",
    enabledKey: "importance_enabled",
    promptKey: "importance_prompt",
    title: "重要性判断",
    icon: <Gauge className="h-4 w-4" />,
    color: "text-orange-600",
  },
  {
    key: "duplicate",
    enabledKey: "duplicate_enabled",
    promptKey: "duplicate_prompt",
    title: "去重判断",
    icon: <Copy className="h-4 w-4" />,
    color: "text-purple-600",
  },
  {
    key: "sentiment",
    enabledKey: "sentiment_enabled",
    promptKey: "sentiment_prompt",
    title: "情感判断",
    icon: <AlertTriangle className="h-4 w-4" />,
    color: "text-red-600",
  },
  {
    key: "summary",
    enabledKey: "summary_enabled",
    promptKey: "summary_prompt",
    title: "摘要生成",
    icon: <FileText className="h-4 w-4" />,
    color: "text-green-600",
  },
  {
    key: "tags",
    enabledKey: "tags_enabled",
    promptKey: "tags_prompt",
    title: "标签提取",
    icon: <Tag className="h-4 w-4" />,
    color: "text-teal-600",
  },
];

export interface CriteriaEditorProps {
  criteria: JudgmentCriteria;
  onChange: (criteria: JudgmentCriteria) => void;
  compact?: boolean;
}

export function CriteriaEditor({ criteria, onChange, compact }: CriteriaEditorProps) {
  const [expandedSection, setExpandedSection] = useState<SectionKey | null>("relevance");
  const [showPreview, setShowPreview] = useState(false);

  const updateField = <K extends keyof JudgmentCriteria>(
    field: K,
    value: JudgmentCriteria[K]
  ) => {
    onChange({ ...criteria, [field]: value });
  };

  const updateLevel = (index: number, updates: Partial<ImportanceLevel>) => {
    onChange({
      ...criteria,
      importance_levels: criteria.importance_levels.map((l, i) =>
        i === index ? { ...l, ...updates } : l
      ),
    });
  };

  const fullPrompt = buildFullSystemPrompt(criteria);

  return (
    <div className="space-y-3">
      {!compact && (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            快速应用行业模板
          </h2>
          <div className="flex flex-wrap gap-2">
            {INDUSTRY_TEMPLATES.map((t, i) => (
              <Button
                key={t.name}
                variant="outline"
                size="sm"
                onClick={() =>
                  onChange({ ...criteria, ...t.criteria })
                }
                className="text-xs"
              >
                {t.name}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(DEFAULT_CRITERIA)}
              className="text-xs text-red-500 hover:text-red-600"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              重置默认
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sections.map((section) => {
          const enabled = criteria[section.enabledKey as keyof JudgmentCriteria] as boolean;
          const prompt = criteria[section.promptKey as keyof JudgmentCriteria] as string;
          const isExpanded = expandedSection === section.key;

          return (
            <div
              key={section.key}
              className={`rounded-lg border transition-colors ${
                isExpanded ? "border-neutral-300 bg-neutral-50" : "border-neutral-100 bg-white"
              }`}
            >
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.key)}
                className="flex items-center gap-3 w-full px-4 py-3 text-left"
              >
                <span className={section.color}>{section.icon}</span>
                <span className="text-sm font-medium text-neutral-900 flex-1">
                  {section.title}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateField(
                        section.enabledKey as keyof JudgmentCriteria,
                        !enabled as any
                      );
                    }}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      enabled ? "bg-neutral-800" : "bg-neutral-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {section.key === "importance" && (
                    <div className="space-y-2 mb-3">
                      <label className="text-xs font-medium text-neutral-600">
                        重要性等级定义
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {criteria.importance_levels.map((level, i) => (
                          <div
                            key={i}
                            className="rounded-md border border-neutral-200 bg-white p-2.5 space-y-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <Input
                                value={level.label}
                                onChange={(e) =>
                                  updateLevel(i, { label: e.target.value })
                                }
                                className="h-6 text-xs font-medium"
                              />
                              <span className="text-xs text-neutral-400 shrink-0">
                                {level.min}-{level.max}
                              </span>
                            </div>
                            <Input
                              value={level.description}
                              onChange={(e) =>
                                updateLevel(i, { description: e.target.value })
                              }
                              className="h-6 text-xs text-neutral-500"
                              placeholder="等级描述"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(section.key === "summary" || section.key === "tags") && (
                    <div className="flex items-center gap-3">
                      <label className="text-xs text-neutral-600">
                        {section.key === "summary" ? "最大字数" : "最大标签数"}:
                      </label>
                      <input
                        type="number"
                        value={
                          section.key === "summary"
                            ? criteria.summary_max_length
                            : criteria.tags_max_count
                        }
                        onChange={(e) =>
                          updateField(
                            section.key === "summary"
                              ? "summary_max_length"
                              : "tags_max_count",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 rounded border border-neutral-200 px-2 py-1 text-xs"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      判断标准提示词
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) =>
                        updateField(
                          section.promptKey as keyof JudgmentCriteria,
                          e.target.value as any
                        )
                      }
                      rows={compact ? 4 : 6}
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-neutral-400 focus:outline-none resize-none font-mono leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!compact && (
        <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center justify-between w-full px-6 py-3 text-left hover:bg-neutral-50 transition-colors"
          >
            <h2 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              完整提示词预览
            </h2>
            {showPreview ? (
              <ChevronUp className="h-4 w-4 text-neutral-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            )}
          </button>
          {showPreview && (
            <div className="px-6 pb-4">
              <div className="relative">
                <pre className="rounded-lg bg-neutral-900 text-neutral-200 p-4 text-xs leading-relaxed overflow-auto max-h-[400px] font-mono whitespace-pre-wrap">
                  {fullPrompt}
                </pre>
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                这是实际发送给大模型的完整系统提示词。所有启用的分段会按顺序拼接。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CriteriaSettings() {
  const [criteria, setCriteria] = useState<JudgmentCriteria>(DEFAULT_CRITERIA);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("judgment_criteria");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCriteria({ ...DEFAULT_CRITERIA, ...parsed });
      } catch {
        // ignore
      }
    }
  }, []);

  const handleChange = (next: JudgmentCriteria) => {
    setCriteria(next);
    setHasChanges(true);
  };

  const handleReset = () => {
    if (confirm("确定要重置为默认配置吗？所有自定义修改将丢失。")) {
      setCriteria(DEFAULT_CRITERIA);
      localStorage.removeItem("judgment_criteria");
      setHasChanges(false);
      toast.success("已重置为默认配置");
    }
  };

  const handleSave = () => {
    const fullPrompt = buildFullSystemPrompt(criteria);
    const toSave = { ...criteria, full_system_prompt: fullPrompt };
    localStorage.setItem("judgment_criteria", JSON.stringify(toSave));
    setHasChanges(false);
    toast.success("判断标准已保存");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">全局默认配置</p>
        <p className="text-blue-600 text-xs leading-relaxed">
          这里设置的是「默认判断标准」，新建板块时会自动继承此配置。
          如果某个板块需要单独调整标准，可在「板块管理」的编辑弹窗中修改，该板块会覆盖默认配置。
        </p>
      </div>

      <CriteriaEditor criteria={criteria} onChange={handleChange} />

      <div className="flex justify-end gap-2">
        {hasChanges && (
          <span className="flex items-center gap-1 text-xs text-orange-500 mr-2">
            <AlertTriangle className="h-3.5 w-3.5" />
            有未保存的修改
          </span>
        )}
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          重置
        </Button>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-3.5 w-3.5 mr-1" />
          保存配置
        </Button>
      </div>
    </div>
  );
}
