// @AI_GENERATED
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "发布失败");
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold">发布新想法</h1>
      <form onSubmit={handleSubmit} className="mt-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="你在想什么？"
          maxLength={500}
          rows={5}
          className="w-full rounded-lg border border-gray-300 p-4 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none resize-none"
          required
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-400">{content.length}/500</span>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "发布中..." : "发布"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-600 hover:bg-gray-50"
          >
            取消
          </button>
        </div>
      </form>
    </main>
  );
}
// @AI_GENERATED: end
