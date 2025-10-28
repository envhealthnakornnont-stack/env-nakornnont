import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession({ req, ...authOptions });
    const role = session?.user.role?.toUpperCase() || null;
    const userId = session ? Number(session.user.id) : null;

    const item = await prisma.news.findUnique({
      where: { id: id },
      include: {
        author: {
          select: {
            firstname: true,
            lastname: true,
            department: true,
            avatar: true,
            email: true,
          },
        },
        tags: { select: { name: true, slug: true } },
      },
    });

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // ต้องเป็น PUBLISHED + มี publishedAt และถึงเวลาแล้ว จึงถือว่า public
    const isPublic =
      item.status === "PUBLISHED" &&
      !!item.publishedAt &&
      item.publishedAt <= new Date();

    if (!session && !isPublic) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (session && role !== "SUPERUSER" && item.authorId !== userId && !isPublic) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ item }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error fetching" }, { status: 500 });
  }
}
