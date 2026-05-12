# IdeaWall 技术决策

本文档记录具体选型，通用原则见 `.kiro/steering/` 目录。

## 技术栈

| 层 | 选择 | 作用 |
|----|------|------|
| 语言 | TypeScript | 类型安全 |
| 框架 | Next.js 15（App Router） | 页面 + API，全栈合一 |
| 样式 | Tailwind CSS | 原子化样式 |
| UI 组件 | shadcn/ui（按需引入） | 按钮、表单等基础组件 |
| ORM | Prisma | 数据库访问和迁移 |
| 数据库 | PostgreSQL（Supabase 提供） | 数据持久化 |
| 认证 | Supabase Auth（Google OAuth） | 用户登录 |
| 部署 | Vercel | 前后端一起托管 |
| 代码托管 | GitHub | 版本管理 + CI 触发 |

## 关键决策

### 为什么 Next.js 全栈而不是单独后端

业务本质是 CRUD，Next.js 的 Route Handlers + Server Actions 足够。拆独立后端会增加运维成本，违反一人公司的"零运维"目标。

### 为什么用 Prisma 而不是 Supabase 客户端查数据

遵循 steering 的可移植性原则：Prisma 直连 PostgreSQL，未来换数据库只改连接串。Supabase 客户端只用于 Auth 的独有能力。

### 为什么不在 MVP 中启用 Supabase Realtime / RLS

这些是 Supabase 平台专属功能，使用后会增加迁移成本。权限校验在应用层做（`/lib/auth.ts` + API 层）。

### 为什么用 Google OAuth 而不是邮箱密码

- 用户体验更好（一键登录）
- 避免自己实现邮箱验证流程
- 直接拿到用户头像和昵称
- Supabase Auth 原生支持，配置简单

## 代码结构

```
ideawall/
  app/
    page.tsx              首页（公开，想法列表）
    login/page.tsx        登录页
    new/page.tsx          发布页（受保护）
    my-posts/page.tsx     我的想法（受保护）
    api/
      posts/route.ts      想法相关 API
      auth/callback/...   OAuth 回调
  lib/
    auth.ts               认证抽象层
    db.ts                 Prisma 客户端（单例）
    supabase/             Supabase 客户端封装（仅供 lib 内部用）
  prisma/
    schema.prisma         数据模型
  docs/
    product.md            产品需求
    tech-decisions.md     本文档
    roadmap.md            开发步骤
  .kiro/
    steering/             软链到 steering-shared
```

## 抽象层范围

当前 MVP 只需要两个抽象：
- `lib/auth.ts` — 封装登录、登出、获取当前用户
- `lib/db.ts` — Prisma 客户端

暂不创建 `storage.ts`、`payment.ts`、`email.ts`，按需添加避免过度设计。

## 环境变量

```
DATABASE_URL=                           # Supabase PostgreSQL 连接串
NEXT_PUBLIC_SUPABASE_URL=               # Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=          # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=              # Supabase service role（仅服务端使用）
```
