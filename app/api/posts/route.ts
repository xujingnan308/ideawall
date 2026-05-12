// @AI_GENERATED
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/posts — list posts (public, supports ?mine=true for current user's posts)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mine = searchParams.get("mine");

  if (mine === "true") {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  }

  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

// POST /api/posts — create a new post (requires auth)
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const content = body.content?.trim();

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  if (content.length > 500) {
    return NextResponse.json(
      { error: "Content must be 500 characters or less" },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      content,
      authorId: user.id,
    },
    include: { author: true },
  });

  return NextResponse.json(post, { status: 201 });
}
// @AI_GENERATED: end
