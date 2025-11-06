import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { PublishStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    const userId = session ? Number(session.user.id) : null;
    const role = session?.user.role?.toUpperCase() || null;

    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();
    const tag = (url.searchParams.get("tag") || "").trim();

    // อนุญาตให้ SUPERUSER กรอง status ได้
    const statusStr = (url.searchParams.get("status") || "").trim().toUpperCase();
    const statusParam: PublishStatus | undefined =
      statusStr === "DRAFT" ? PublishStatus.DRAFT :
        statusStr === "PUBLISHED" ? PublishStatus.PUBLISHED :
          statusStr === "ARCHIVED" ? PublishStatus.ARCHIVED :
            undefined;

    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize") || 12)));

    // latest|oldest|published|event (เพิ่ม event สำหรับเรียงตามวันจัดกิจกรรม)
    const sortParam = (url.searchParams.get("sort") || "latest").toLowerCase();

    // 1) visibility
    let visibilityWhere: any = {};
    if (!session) {
      visibilityWhere = {
        status: PublishStatus.PUBLISHED,
        publishedAt: { lte: new Date() },
      };
    } else if (role === "SUPERUSER") {
      visibilityWhere = {};
    } else {
      visibilityWhere = {
        OR: [
          { authorId: userId ?? -1 },
          { status: PublishStatus.PUBLISHED, publishedAt: { lte: new Date() } },
        ],
      };
    }

    // 2) filters
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
          { title: { contains: q } },
          { slug: { contains: q } },
          { contentHtml: { contains: q } },
          { location: { contains: q } },
          { organizer: { contains: q } },
          {
            author: {
              // one-to-one relation filter ให้ใช้ is: {...}
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
        ],
      });
    }

    const where = filters.length ? { AND: [visibilityWhere, ...filters] } : visibilityWhere;

    // 3) sort
    const orderBy =
      sortParam === "oldest"
        ? [{ createdAt: "asc" as const }]
        : sortParam === "published"
          ? [{ publishedAt: "desc" as const }, { createdAt: "desc" as const }] // กัน publishedAt เป็น null
          : sortParam === "event"
            ? [{ eventDate: "desc" as const }, { createdAt: "desc" as const }]   // เรียงตามวันจัดงาน
            : [{ createdAt: "desc" as const }];                                   // latest (default)

    // 4) query
    const [items, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        include: {
          author: { select: { firstname: true, lastname: true, department: true } },
          tags: { select: { name: true, slug: true } },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.activity.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, pageSize }, { status: 200 });
  } catch (error) {
    console.error("[/api/activities] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}