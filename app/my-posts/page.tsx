// @AI_GENERATED
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string; avatarUrl: string | null };
}

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/posts?mine=true")
      .then((res) => res.json())
      .then((data) => {
        // Filter will be done properly once we have user context on client
        // For now we fetch all and the page is protected by middleware
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条想法吗？")) return;

    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts(posts.filter((p) => p.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || "删除失败");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <p className="text-gray-400">加载中...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的想法</h1>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-600 hover:text-black"
        >
          ← 返回首页
        </button>
      </div>

      <div className="mt-8 space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-400">
            你还没有发布过想法
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString("zh-CN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-sm text-red-400 hover:text-red-600"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
// @AI_GENERATED: end
