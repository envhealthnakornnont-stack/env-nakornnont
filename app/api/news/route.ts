import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    const userId = session ? Number(session.user.id) : null;
    const role = session?.user.role?.toUpperCase() || null;

    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();
    const tag = (url.searchParams.get("tag") || "").trim();
    const statusParam = (url.searchParams.get("status") || "").toUpperCase(); // ← เปล่าเป็นดีฟอลต์
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize") || 12)));
    const sort = url.searchParams.get("sort") || "latest"; // latest|oldest|published

    // 1) เงื่อนไขการมองเห็น (visibility)
    let visibilityWhere: any = {};
    if (!session) {
      visibilityWhere = {
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
      };
    } else if (role === "SUPERUSER") {
      visibilityWhere = {};
    } else {
      visibilityWhere = {
        OR: [
          { authorId: userId },
          { status: "PUBLISHED", publishedAt: { lte: new Date() } },
        ],
      };
    }

    // 2) ฟิลเตอร์อื่น ๆ (จะ AND กับ visibility)
    const filters: any[] = [];

    if (session && role === "SUPERUSER" && statusParam) {
      filters.push({ status: statusParam });
    }

    if (tag) {
      filters.push({ tags: { some: { slug: tag } } });
    }

    if (q) {
      filters.push({
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { contentHtml: { contains: q, mode: "insensitive" } },
        ],
      });
    }

    const where = filters.length ? { AND: [visibilityWhere, ...filters] } : visibilityWhere;

    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" as const }
        : sort === "published"
          ? { publishedAt: "desc" as const }
          : { createdAt: "desc" as const };

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          author: { select: { firstname: true, lastname: true, department: true } },
          tags: { select: { name: true, slug: true } },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, pageSize }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
