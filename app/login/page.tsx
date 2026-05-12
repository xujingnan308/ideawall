// @AI_GENERATED
"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const handleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold">登录 IdeaWall</h1>
      <p className="mt-2 text-gray-600">使用 Google 账号一键登录</p>
      <button
        onClick={handleLogin}
        className="mt-8 rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 transition-colors"
      >
        使用 Google 登录
      </button>
    </main>
  );
}
// @AI_GENERATED: end
