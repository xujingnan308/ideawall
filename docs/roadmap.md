# IdeaWall 开发步骤

整个流程分 6 步，每步完成后停下让用户验证，跑通再继续。

## 第 1 步：创建本地项目

**目标：** 本地跑起一个带抽象层骨架的 Next.js 项目。

- 在 `/Users/xujingnan/program/ideawall/` 初始化 Next.js 15 + TypeScript + Tailwind
- 安装依赖：Prisma、Supabase JS 客户端
- 建立 `/lib` 抽象层骨架（暂用 mock 实现）
- 建立 `/prisma/schema.prisma` 空模型
- 配置 `.env.example` 和 `.gitignore`

**验收：** 本地 `npm run dev` 启动，访问 `http://localhost:3000` 能看到首页占位内容。

## 第 2 步：连数据库

**目标：** 通过 Prisma 连上 Supabase PostgreSQL 并建表。

- 用户在 Supabase 控制台创建项目（Region: Singapore）
- 用户把数据库连接串和 API Key 填入 `.env.local`
- 在 `schema.prisma` 定义 `User`、`Post` 模型
- 运行 `prisma migrate dev` 生成迁移并建表
- 写一个临时的 API 验证读写

**验收：** 能从 Prisma Studio 或 API 验证数据写入 Supabase。

## 第 3 步：Google OAuth 登录

**目标：** 能用 Google 账号登录并拿到当前用户。

- 用户在 Google Cloud Console 创建 OAuth 客户端
- 用户在 Supabase Auth 面板启用 Google Provider，填入 Client ID/Secret
- 实现 `/lib/auth.ts` 抽象层（登录、登出、获取当前用户）
- 实现登录页 `/login` 和回调路由
- 首次登录时自动在 `User` 表插入记录

**验收：** 点击登录按钮 → 跳转 Google → 授权回来 → 显示当前用户信息。

## 第 4 步：完整业务功能

**目标：** 首页、发布、我的想法三个页面可用。

- 首页 `/`：列出所有想法（公开）
- 发布页 `/new`：表单发布想法（受保护）
- 我的想法 `/my-posts`：展示本人想法，可删除（受保护）
- API 路由：`GET /api/posts`、`POST /api/posts`、`DELETE /api/posts/[id]`
- Middleware 实现路由保护（未登录跳 `/login`）
- 权限校验（只能删自己的）

**验收：** 走完整链路：登录 → 发布 → 首页看到 → 我的想法看到 → 删除 → 首页没了。

## 第 5 步：部署上线

**目标：** 在 Vercel 上能访问到线上版本。

- 用户在 GitHub 建空仓库 `ideawall`
- 推本地代码到 GitHub
- 在 Vercel 导入仓库
- 在 Vercel 填环境变量
- 在 Supabase 添加 Vercel 回调 URL 到 OAuth 白名单
- 自动部署

**验收：** 访问 `ideawall-xxx.vercel.app`，完整功能可用。

## 第 6 步：分支预览演示

**目标：** 体验 Vercel 的 Preview Deployment。

- 开一个分支（比如改个标题文字）
- 推分支到 GitHub
- 看 Vercel 自动生成的预览 URL
- 验证预览版和生产版相互独立

**验收：** 预览 URL 能看到改动，生产 URL 不受影响。合并分支后生产 URL 更新。

## 预期耗时

- 第 1-2 步：~30 分钟
- 第 3 步：~20 分钟（主要在 Google Cloud 配 OAuth）
- 第 4 步：~1 小时
- 第 5-6 步：~20 分钟

总计约 2-3 小时，不含调试时间。
