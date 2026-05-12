// @AI_GENERATED
/**
 * Authentication abstraction layer.
 * Uses Supabase Auth with Google OAuth.
 */

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

/** Get the currently logged-in user (returns null if not authenticated) */
export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  // Ensure user exists in our database
  const dbUser = await prisma.user.upsert({
    where: { email: user.email },
    update: {
      name: user.user_metadata?.full_name || user.email,
      avatarUrl: user.user_metadata?.avatar_url || null,
    },
    create: {
      email: user.email,
      name: user.user_metadata?.full_name || user.email,
      avatarUrl: user.user_metadata?.avatar_url || null,
    },
  });

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    avatarUrl: dbUser.avatarUrl,
  };
}
// @AI_GENERATED: end
