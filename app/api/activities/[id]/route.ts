import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
         // ตรวจสอบ Session
         const session = await getServerSession(authOptions);

         // กำหนดตัวแปร userId และ role
         const userId = session ? Number(session.user.id) : null;  // ID ของผู้ใช้ที่ล็อกอิน
         const userRole = session?.user.role || null; // role ของผู้ใช้ที่ล็อกอิน

        // ค้นหากิจกรรมที่มี slug ตรงกัน
        const activity = await prisma.activity.findUnique({
            where: { id },
            include: {
                author: {
                    select: { firstname: true, lastname: true, department: true, avatar: true, email: true },
                },
            },
        });

        // ถ้าไม่พบกิจกรรม
        if (!activity) {
            return NextResponse.json({ message: "Activity not found" }, { status: 404 });
        }

        // ตรวจสอบสิทธิ์การเข้าถึงข้อมูล
        if (session) {
            if (userRole === "SUPERUSER") {
                // ✅ SUPERUSER สามารถเข้าถึงทุกกิจกรรมได้
                return NextResponse.json({ activity }, { status: 200 });
            } else if (userRole === "USER") {
                if (activity.authorId === userId) {
                    // ✅ USER ดูได้เฉพาะกิจกรรมที่ตัวเองเขียน
                    return NextResponse.json({ activity }, { status: 200 });
                } else {
                    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
                }
            }
        }

        return NextResponse.json(activity, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching activity' }, { status: 500 });
    }
}
