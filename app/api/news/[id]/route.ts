import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ใช้ params.id โดยตรง

  try {
    // ตรวจสอบ Session
    const session = await getServerSession({ req, ...authOptions });

    // กำหนดตัวแปร userId และ role
    const userId = session ? Number(session.user.id) : null; 
    const userRole = session?.user.role || null;

    // ค้นหาข่าว (news) ตาม id ที่ส่งมา
    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        author: {
          select: { firstname: true, lastname: true, department: true, avatar: true, email: true },
        },
      },
    });

    // ถ้าไม่พบข่าว
    if (!news) {
      return NextResponse.json({ message: "News not found" }, { status: 404 });
    }

    // ตรวจสอบสิทธิ์การเข้าถึงข้อมูล
    if (session) {
      if (userRole === "SUPERUSER") {
        // SUPERUSER สามารถเข้าถึงข่าวทุกรายการ
        return NextResponse.json({ news }, { status: 200 });
      } else if (userRole === "USER") {
        if (news.authorId === userId) {
          // USER สามารถดูข่าวที่เขียนเองได้
          return NextResponse.json({ news }, { status: 200 });
        } else {
          return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }
      }
    }

    // กรณีที่ไม่มี session ให้ส่งข้อมูลข่าวทั้งหมด (Public)
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Error fetching news' }, { status: 500 });
  }
}