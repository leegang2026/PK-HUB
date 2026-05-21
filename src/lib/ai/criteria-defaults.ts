export interface CriteriaSection {
  enabled: boolean;
  title: string;
  description: string;
  prompt: string;
}

export interface ImportanceLevel {
  min: number;
  max: number;
  label: string;
  description: string;
}

export interface JudgmentCriteria {
  id?: string;
  user_id?: string;
  name: string;
  is_default: boolean;
  // 相关性
  relevance_enabled: boolean;
  relevance_prompt: string;
  // 重要性
  importance_enabled: boolean;
  importance_prompt: string;
  importance_levels: ImportanceLevel[];
  // 去重
  duplicate_enabled: boolean;
  duplicate_prompt: string;
  // 情感
  sentiment_enabled: boolean;
  sentiment_prompt: string;
  // 摘要
  summary_enabled: boolean;
  summary_prompt: string;
  summary_max_length: number;
  // 标签
  tags_enabled: boolean;
  tags_prompt: string;
  tags_max_count: number;
  // 完整系统提示词（拼接后）
  full_system_prompt: string;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_IMPORTANCE_LEVELS: ImportanceLevel[] = [
  { min: 95, max: 100, label: "行业里程碑", description: "重大政策发布、行业颠覆性事件、市场剧变" },
  { min: 80, max: 94, label: "重要", description: "重要产品发布、关键数据、大公司战略调整" },
  { min: 60, max: 79, label: "一般", description: "常规更新、minor 进展、行业观察分析" },
  { min: 0, max: 59, label: "低价值", description: "花边新闻、重复信息、低价值内容、软文广告" },
];

export const DEFAULT_CRITERIA: JudgmentCriteria = {
  name: "默认标准",
  is_default: true,
  relevance_enabled: true,
  relevance_prompt: `【相关性判断】
判断文章内容是否与板块主题高度相关。
- 高度相关：文章核心主题与板块直接匹配
- 中度相关：涉及板块相关领域，但不是核心
- 低度相关：仅在边缘提及板块关键词
- 不相关：与板块主题无关

注意：只看核心主题匹配，排除边缘话题和蹭热度的内容。`,
  importance_enabled: true,
  importance_prompt: `【重要性判断】
基于以下维度给出 0-100 的评分：
1. 影响力：对行业/市场/用户的影响范围和深度
2. 稀缺性：独家信息 vs 全网都在发
3. 紧急度：是否需要立即关注

评分标准：
- 95-100 行业里程碑：重大政策、颠覆性技术、市场剧变
- 80-94 重要：重要产品发布、关键数据、大公司战略调整
- 60-79 一般：常规更新、minor 进展、行业观察
- 0-59 低价值：花边新闻、重复信息、软文广告`,
  importance_levels: DEFAULT_IMPORTANCE_LEVELS,
  duplicate_enabled: true,
  duplicate_prompt: `【去重判断】
判断是否与已有文章报道的是同一件事。
- 即使标题不同，但核心事件相同 → 标记为重复
- 同一事件的不同角度报道 → 标记为重复
- 不同事件的相似主题 → 不重复
- 后续进展/更新 → 不重复（视为新信息）`,
  sentiment_enabled: true,
  sentiment_prompt: `【情感判断】
判断文章对行业/市场/用户的整体倾向：
- positive（正面）：利好、突破、增长、成功
- negative（负面）：利空、衰退、事故、监管收紧
- neutral（中性）：纯事实陈述、无明显倾向`,
  summary_enabled: true,
  summary_prompt: `【摘要生成】
提取文章核心事实，生成简洁摘要：
- 必须包含关键数据、时间、主体
- 不是改写标题，而是提炼核心信息
- 去除营销话术和修饰词`,
  summary_max_length: 100,
  tags_enabled: true,
  tags_prompt: `【标签提取】
提取 3-5 个最精准的中文标签：
- 每个标签不超过 3 个字
- 优先使用行业通用术语
- 包含主体（公司/产品）和主题（技术/领域）`,
  tags_max_count: 5,
  full_system_prompt: "",
};

// 行业模板
export const INDUSTRY_TEMPLATES: { name: string; criteria: Partial<JudgmentCriteria> }[] = [
  {
    name: "科技投资",
    criteria: {
      relevance_prompt: `【相关性判断】
判断文章是否与科技投资领域相关。
重点关注：AI、半导体、新能源、互联网巨头的商业动态。
排除：纯技术教程、非上市小公司产品、娱乐八卦。`,
      importance_prompt: `【重要性判断】
从投资角度评估重要性：
1. 对股价/估值的潜在影响
2. 行业竞争格局变化
3. 政策监管风险

评分标准：
- 95-100 重大：并购、IPO、重大监管政策、技术突破
- 80-94 重要：财报超预期、重大合同、核心人事变动
- 60-79 一般：产品更新、合作公告、行业报告
- 0-59 低价值：公关稿、预测分析、花边`,
      sentiment_prompt: `【情感判断】
从投资者视角判断：
- positive：利好股价的因素（增长、突破、政策支持）
- negative：利空因素（监管、亏损、竞争加剧）
- neutral：事实陈述、无明显投资影响`,
    },
  },
  {
    name: "程序员技术",
    criteria: {
      relevance_prompt: `【相关性判断】
判断是否与软件开发、AI 编程、技术架构相关。
重点关注：新框架、编程语言特性、开源项目、工程实践。
排除：纯商业新闻、非技术类教程、软广。`,
      importance_prompt: `【重要性判断】
从开发者实用性评估：
1. 是否改变日常开发方式
2. 是否解决常见痛点
3. 社区关注度和采纳潜力

评分标准：
- 95-100 重大：颠覆性语言/框架、重大安全漏洞
- 80-94 重要：主流工具重大更新、重要标准发布
- 60-79 一般：常规版本更新、技巧分享、趋势分析
- 0-59 低价值：Hello World、过时内容、推广`,
      tags_prompt: `【标签提取】
提取技术标签：
- 语言/框架名（如 React、Rust、Go）
- 领域（如 前端、后端、AI、DevOps）
- 类型（如 教程、新闻、工具）`,
    },
  },
  {
    name: "宏观财经",
    criteria: {
      relevance_prompt: `【相关性判断】
判断是否与宏观经济、货币政策、全球市场相关。
重点关注：央行政策、通胀数据、汇率、地缘政治对经济的影响。
排除：个股分析、纯行业新闻、理财广告。`,
      importance_prompt: `【重要性判断】
从宏观经济影响评估：
1. 对全球/国内经济走势的影响
2. 对大类资产（股债汇商）的影响
3. 政策转向信号

评分标准：
- 95-100 重大：央行利率决策、重大地缘政治、金融危机
- 80-94 重要：重要经济数据、政策微调、大国博弈
- 60-79 一般：常规数据发布、分析师预测、市场评论
- 0-59 低价值：传闻、非核心数据、个人观点`,
      sentiment_prompt: `【情感判断】
从经济和市场情绪判断：
- positive：宽松政策、增长超预期、风险缓和
- negative：紧缩、衰退信号、风险事件
- neutral：数据发布、政策解读、中性分析`,
    },
  },
];

// 拼接完整系统提示词
export function buildFullSystemPrompt(criteria: JudgmentCriteria): string {
  const parts: string[] = [
    "你是一个专业的信息筛选和分析助手。你的任务是分析文章并返回结构化结果。",
    "",
    "请严格按以下 JSON 格式返回（不要 Markdown 代码块）：",
    "{",
    '  "isRelevant": boolean,',
    '  "relevanceReason": "string, 为什么相关或不相关，20字以内",',
    '  "isDuplicate": boolean,',
    '  "duplicateOf": "string or null, 如果是重复，填已有文章的 hash；否则 null",',
    '  "importance": number,',
    '  "summary": "string",',
    '  "tags": ["string"],',
    '  "sentiment": "positive" | "neutral" | "negative"',
    "}",
    "",
  ];

  if (criteria.relevance_enabled) {
    parts.push(criteria.relevance_prompt, "");
  }

  if (criteria.importance_enabled) {
    parts.push(criteria.importance_prompt, "");
    parts.push("重要性评分必须严格在 0-100 之间。");
    parts.push("");
  }

  if (criteria.duplicate_enabled) {
    parts.push(criteria.duplicate_prompt, "");
  }

  if (criteria.sentiment_enabled) {
    parts.push(criteria.sentiment_prompt, "");
  }

  if (criteria.summary_enabled) {
    parts.push(criteria.summary_prompt, "");
    parts.push(`摘要长度严格控制在 ${criteria.summary_max_length} 字以内。`, "");
  }

  if (criteria.tags_enabled) {
    parts.push(criteria.tags_prompt, "");
    parts.push(`标签数量严格控制在 ${criteria.tags_max_count} 个以内。`, "");
  }

  return parts.join("\n");
}
