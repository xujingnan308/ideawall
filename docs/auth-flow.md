<!-- @AI_GENERATED -->
# Google OAuth 登录流程

## 四个角色

| 角色 | 是什么 | 职责 |
|------|--------|------|
| **用户** | 真人，想用 IdeaWall | 提供身份证明（Google 账号密码） |
| **IdeaWall 应用** | 我们写的 Next.js 应用 | 需要知道"你是谁"，但不想自己管密码 |
| **Supabase Auth** | 认证中间件服务 | 帮 IdeaWall 处理 OAuth 协议细节，管理登录状态（session） |
| **Google** | 身份提供商（Identity Provider） | 验证用户身份，告诉外界"这个人是张三" |

## 它们之间的关系

```
┌──────────┐         ┌──────────────┐         ┌──────────────┐         ┌──────────┐
│   用户   │         │   IdeaWall   │         │   Supabase   │         │  Google  │
│ （浏览器）│         │  （我们的应用）│         │  （Auth 服务）│         │（身份验证）│
└────┬─────┘         └──────┬───────┘         └──────┬───────┘         └────┬─────┘
     │                      │                        │                      │
     │  1. 点击"Google登录"  │                        │                      │
     │─────────────────────>│                        │                      │
     │                      │                        │                      │
     │  2. 跳转到 Google 授权页                       │                      │
     │<─────────────────────────────────────────────────────────────────────│
     │                      │                        │                      │
     │  3. 用户输入 Google 账号密码，点同意            │                      │
     │─────────────────────────────────────────────────────────────────────>│
     │                      │                        │                      │
     │  4. Google 验证通过，带着授权码跳回 Supabase    │                      │
     │                      │                        │<─────────────────────│
     │                      │                        │                      │
     │                      │                        │  5. Supabase 用       │
     │                      │                        │     Client Secret     │
     │                      │                        │     换取用户信息       │
     │                      │                        │─────────────────────>│
     │                      │                        │                      │
     │                      │                        │  6. Google 返回       │
     │                      │                        │     邮箱/头像/昵称    │
     │                      │                        │<─────────────────────│
     │                      │                        │                      │
     │  7. Supabase 创建 session，跳回 IdeaWall       │                      │
     │<─────────────────────────────────────────────-│                      │
     │                      │                        │                      │
     │  8. IdeaWall 读取 session，知道你是谁了        │                      │
     │<─────────────────────│                        │                      │
     │                      │                        │                      │
     │  9. 显示"欢迎，张三"  │                        │                      │
     │<─────────────────────│                        │                      │
```

## 为什么需要这么多角色

**为什么不让 IdeaWall 直接管密码？**
- 用户不信任小网站，不想注册新账号
- 我们不想承担存储密码的安全责任
- Google 登录体验更好（一键完成）

**为什么需要 Supabase，IdeaWall 不能直接对接 Google？**
- OAuth 协议有很多安全细节（PKCE、nonce、token 刷新），自己实现容易出漏洞
- Supabase 帮我们管 session（JWT 自动刷新、cookie 设置、多设备管理）
- 以后想加 GitHub 登录、微信登录，只需要在 Supabase 面板开启，代码不用改

**为什么 Google 不直接把用户信息给 IdeaWall？**
- 安全原因：需要两步验证（先给授权码，再用 Secret 换信息）
- 防止有人伪造请求冒充 IdeaWall 骗取用户信息
- Client Secret 只有服务端知道，浏览器里拿不到

## 配置时做的事情

| 我们做了什么 | 对应哪两方的信任关系 |
|-------------|-------------------|
| 在 Google 创建 OAuth 客户端，拿到 Client ID + Secret | Google 认识了 IdeaWall："这对钥匙代表 IdeaWall" |
| 在 Google 填写重定向 URI（指向 Supabase） | Google 信任 Supabase："授权后可以把用户送到这个地址" |
| 在 Supabase 填入 Client ID + Secret | Supabase 能代表 IdeaWall 向 Google 换取用户信息 |
| 在 Google 添加测试用户 | Google 允许这些邮箱在应用未审核时使用 OAuth |

## 代码对应

| 文件 | 职责 |
|------|------|
| `lib/supabase/client.ts` | 浏览器端 Supabase 客户端，发起登录跳转 |
| `lib/supabase/server.ts` | 服务端 Supabase 客户端，读取/刷新 session |
| `lib/auth.ts` | 认证抽象层，获取当前用户并同步到我们的数据库 |
| `app/login/page.tsx` | 登录页，点击按钮触发 Google OAuth |
| `app/auth/callback/route.ts` | OAuth 回调路由，用授权码换 session |
| `app/auth/signout/route.ts` | 登出路由，清除 session |
| `middleware.ts` | 路由保护（未登录跳登录页）+ session 自动刷新 |

## 注意事项

- Google 应用在"测试"状态时，只有添加为测试用户的邮箱能登录
- 要让所有人都能登录，需要在 Google Console 提交应用审核（发布到生产）
- 重定向 URI 必须精确匹配，多一个斜杠都不行
<!-- @AI_GENERATED: end -->
