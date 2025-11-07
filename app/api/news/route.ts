import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Prisma, PublishStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    const userId = session ? Number(session.user.id) : null;
    const role = session?.user.role?.toUpperCase() || null;

    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();
    const tag = (url.searchParams.get("tag") || "").trim();

    const statusStr = (url.searchParams.get("status") || "").trim().toUpperCase();
    const statusParam: PublishStatus | undefined =
      statusStr === "DRAFT" ? PublishStatus.DRAFT :
        statusStr === "PUBLISHED" ? PublishStatus.PUBLISHED :
          statusStr === "ARCHIVED" ? PublishStatus.ARCHIVED :
            undefined;

    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize") || 12)));
    const sortParam = (url.searchParams.get("sort") || "latest").toLowerCase(); // latest|oldest|published

    // 1) visibility
    const visibilityWhere: Prisma.NewsWhereInput = !session
      ? { status: PublishStatus.PUBLISHED, publishedAt: { lte: new Date() } }
      : role === "SUPERUSER"
        ? {}
        : {
          OR: [
            { authorId: userId ?? -1 },
            { status: PublishStatus.PUBLISHED, publishedAt: { lte: new Date() } },
          ],
        };

    // 2) filters
    const filters: Prisma.NewsWhereInput[] = [];

    if (session && role === "SUPERUSER" && statusParam) {
      filters.push({ status: statusParam });
    }

    if (tag) {
      filters.push({ tags: { some: { slug: tag } } });
    }

    if (q) {
      filters.push({
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { slug: { contains: q } },
          { contentHtml: { contains: q } },
          {
            // relation to-one => ใช้ is: { ... }
            author: {
              is: {
                OR: [
                  { firstname: { contains: q } },
                  { lastname: { contains: q } },
                  { department: { contains: q } },
                ],
              },
            },
          },
          {
            tags: {
              some: {
                OR: [
                  { name: { contains: q } },
                  { slug: { contains: q } },
                ],
              },
            },
          },
          // หมายเหตุ: authorSnapshot เป็น JSON — อย่าฟรีเท็กซ์ใน JSON ตรง ๆ
        ],
      });
    }

    const where: Prisma.NewsWhereInput = filters.length ? { AND: [visibilityWhere, ...filters] } : visibilityWhere;

    // 3) orderBy
    const orderBy =
      sortParam === "oldest"
        ? [{ createdAt: "asc" as const }]
        : sortParam === "published"
          ? [{ publishedAt: "desc" as const }, { createdAt: "desc" as const }] // กัน null
          : [{ createdAt: "desc" as const }];

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
    console.error("[/api/news] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
