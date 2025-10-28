import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session ? Number(session.user.id) : null;
    const role = session?.user.role?.toUpperCase() || null;

    const url = new URL(req.url);
    const q = url.searchParams.get("q")?.trim();
    const tag = url.searchParams.get("tag")?.trim();
    const statusParam = url.searchParams.get("status")?.toUpperCase() || "PUBLISHED";
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize") || 12)));
    const sort = url.searchParams.get("sort") || "latest";

    const whereBase: any = {};
    // การมองเห็นตามสิทธิ์
    if (!session) {
      whereBase.status = "PUBLISHED";
      whereBase.publishedAt = { lte: new Date() };
    } else if (role === "SUPERUSER") {
      // no filter
    } else {
      // USER: ของตัวเองทั้งหมด + ของสาธารณะ
      whereBase.OR = [
        { authorId: userId },
        { status: "PUBLISHED", publishedAt: { lte: new Date() } },
      ];
    }

    // ฟิลเตอร์สถานะถ้าส่งมา (admin view)
    if (session && role === "SUPERUSER" && statusParam) {
      whereBase.status = statusParam;
    }

    if (q) {
      whereBase.OR = [
        ...(whereBase.OR ?? []),
        { title: { contains: q } },
        { description: { contains: q } },
        { contentHtml: { contains: q } },
      ];
    }

    if (tag) {
      whereBase.tags = { some: { slug: tag } };
    }

    const orderBy =
      sort === "oldest" ? { createdAt: "asc" as const } :
        sort === "latest" ? { createdAt: "desc" as const } :
          { createdAt: "desc" as const };

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where: whereBase,
        include: {
          author: { select: { firstname: true, lastname: true, department: true } },
          tags: { select: { name: true, slug: true } },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.news.count({ where: whereBase }),
    ]);

    return NextResponse.json({ items, total, page, pageSize }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}