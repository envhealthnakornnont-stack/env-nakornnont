import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    // แนะนำให้ส่ง req เข้า getServerSession เพื่อความสม่ำเสมอ
    const session = await getServerSession({ req, ...authOptions });
    const userId = session ? Number(session.user.id) : null;
    const role = session?.user.role?.toUpperCase() || null;

    const url = new URL(req.url);
    const qRaw = url.searchParams.get("q");
    const q = qRaw?.trim() || "";
    const tag = url.searchParams.get("tag")?.trim() || "";
    const statusParam = (url.searchParams.get("status") || "").toUpperCase();
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize") || 12)));
    const sort = url.searchParams.get("sort") || "latest"; // latest|oldest|published

    // 1) เงื่อนไข "การมองเห็น" (visibility) — แยกต่างหาก แล้วค่อย AND กับ filter อื่น
    let visibilityWhere: any = {};
    if (!session) {
      visibilityWhere = {
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
      };
    } else if (role === "SUPERUSER") {
      // เห็นทุกอย่าง
      visibilityWhere = {};
    } else {
      // USER: (ของตัวเอง) OR (เผยแพร่แล้ว)
      visibilityWhere = {
        OR: [
          { authorId: userId },
          { status: "PUBLISHED", publishedAt: { lte: new Date() } },
        ],
      };
    }

    // 2) ตัวกรอง (filters) — AND เข้ากับ visibility เสมอ
    const filters: any[] = [];

    // status (ให้ใช้ได้เฉพาะ SUPERUSER เท่านั้น)
    if (session && role === "SUPERUSER" && statusParam) {
      filters.push({ status: statusParam });
    }

    // tag
    if (tag) {
      filters.push({ tags: { some: { slug: tag } } });
    }

    // q: ใช้ OR ระหว่างหลายฟิลด์ แต่ทั้งก้อนนี้ถูก AND เข้ากับ visibility
    if (q) {
      filters.push({
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { contentHtml: { contains: q, mode: "insensitive" } },
          { location: { contains: q, mode: "insensitive" } },
          { organizer: { contains: q, mode: "insensitive" } },
        ],
      });
    }

    // รวม where = visibility AND filters[*]
    const where =
      filters.length > 0
        ? { AND: [visibilityWhere, ...filters] }
        : visibilityWhere;

    // sort
    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" as const }
        : sort === "published"
        ? { publishedAt: "desc" as const }
        : { createdAt: "desc" as const }; // default latest

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
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
