import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
    try {
        // ตรวจสอบ Session
        const session = await getServerSession(authOptions);

        // กำหนดตัวแปร userId และ role
        const userId = session ? Number(session.user.id) : null;  // ID ของผู้ใช้ที่ล็อกอิน
        const userRole = session?.user.role || null; // role ของผู้ใช้ที่ล็อกอิน

        // กำหนดเงื่อนไขการดึงข้อมูล
        const activities = await prisma.activity.findMany({
            where: userRole === "SUPERUSER"
                ? undefined // SUPERUSER เห็นทั้งหมด
                : userId ? { authorId: userId } // USER เห็นเฉพาะของตัวเอง
                    : undefined, // บุคคลทั่วไป (Public) เห็นทั้งหมด
            include: {
                author: {
                    select: { firstname: true, lastname: true, department: true }, // ข้อมูลผู้เขียน
                },
            },
            orderBy: {
                createdAt: "desc", // เรียงลำดับจากล่าสุด
            },
        });

        return NextResponse.json(activities, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}