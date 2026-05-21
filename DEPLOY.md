# News Hub 部署指南

## 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)，注册/登录
2. 点击 "New Project"，选择免费套餐
3. 等待项目创建完成
4. 进入 Project Settings → API，复制：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. 进入 SQL Editor，新建查询，粘贴 `src/lib/db/schema.sql` 中的全部内容并执行

## 2. 部署到 Vercel

1. 将本代码推送到 GitHub 仓库
2. 访问 [vercel.com](https://vercel.com)，导入该仓库
3. 在 Environment Variables 中添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `CRON_SECRET`（随意设置，至少 32 位随机字符）
4. 点击 Deploy

## 3. 配置定时任务

部署完成后，Vercel 会自动读取 `vercel.json` 中的 Cron 配置：
- 每小时执行一次信息抓取
- 每天早上 8:00 生成并推送日报

## 4. 配置 AI 功能（可选）

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 创建 API Key
3. 在 Vercel 环境变量中添加 `GEMINI_API_KEY`

## 5. 配置微信推送（可选）

1. 下载企业微信 App，注册企业
2. 在目标群聊中点击右上角「···」→「群机器人」→「添加机器人」
3. 复制 Webhook 地址中的 `key=xxxx` 部分
4. 在 Vercel 环境变量中添加 `WECOM_WEBHOOK_KEY`
5. 在网站设置页打开「启用日报推送」

## 6. 首次使用

1. 打开部署后的网站地址
2. 注册账号（邮箱+密码）
3. 进入「设置」→「板块管理」→ 新建板块
4. 在板块中添加来源（RSS 链接或网页地址）
5. 等待定时任务自动抓取，或手动刷新

## 技术栈

- 前端：Next.js 16 + Tailwind CSS + shadcn/ui
- 后端：Next.js API Routes + Vercel Cron
- 数据库：Supabase PostgreSQL
- 认证：Supabase Auth
- AI：Google Gemini（免费层）
- 推送：企业微信 Webhook
