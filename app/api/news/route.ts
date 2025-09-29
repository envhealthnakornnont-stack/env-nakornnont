import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    // ตรวจสอบ Session
    const session = await getServerSession({ req, ...authOptions });

    // กำหนดตัวแปร userId และ role
    const userId = session ? Number(session.user.id) : null;
    const userRole = session?.user.role || null;

    // ดึงข้อมูลข่าวสาร (news) จากฐานข้อมูล
    const news = await prisma.news.findMany({
      where:
        userRole === "SUPERUSER"
          ? undefined // SUPERUSER เห็นทั้งหมด
          : userId
            ? { authorId: userId } // USER เห็นเฉพาะของตัวเอง
            : undefined, // บุคคลทั่วไป (Public) เห็นทั้งหมด
      include: {
        author: {
          select: { firstname: true, lastname: true, department: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
