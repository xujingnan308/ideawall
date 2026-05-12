// @AI_GENERATED
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function HomePage() {
  const user = await getCurrentUser();
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">IdeaWall 💡</h1>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.name}</span>
              <Link
                href="/new"
                className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
              >
                发布想法
              </Link>
              <Link
                href="/my-posts"
                className="text-sm text-gray-600 hover:text-black"
              >
                我的想法
              </Link>
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-gray-400 hover:text-black"
                >
                  登出
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              登录
            </Link>
          )}
        </nav>
      </div>
      <p className="mt-4 text-gray-600">
        一面公开的想法墙。所有人的灵感，汇聚于此。
      </p>

      <div className="mt-8 space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-400">
            还没有人发布想法，来做第一个吧！
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                {post.author.avatarUrl && (
                  <img
                    src={post.author.avatarUrl}
                    alt=""
                    className="h-5 w-5 rounded-full"
                  />
                )}
                <span>{post.author.name}</span>
                <span>·</span>
                <span>
                  {new Date(post.createdAt).toLocaleString("zh-CN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
// @AI_GENERATED: end
