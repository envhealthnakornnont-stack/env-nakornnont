import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
    try {
        // ดึง session จากการเรียกใช้งาน API
        const session = await getServerSession({ req, ...authOptions });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // เฉพาะ SUPERUSER เท่านั้นที่สามารถเรียกดูข้อมูลผู้ใช้ทุกคนได้
        if (session.user.role !== "SUPERUSER") {
            return NextResponse.json({ error: "Forbidden: เฉพาะ SUPERUSER เท่านั้นที่สามารถเข้าถึงทรัพยากรนี้ได้" }, { status: 403 });
        }

        // ดึงข้อมูลผู้ใช้งานทั้งหมด (โดยไม่กรองตาม role)
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                department: true,
                role: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // แปลงค่า timestamp ให้อยู่ในรูปแบบ ISO string (ถ้าต้องการ)
        const responseData = users.map((user: { createdAt: { toISOString: () => string; }; updatedAt: { toISOString: () => string; }; }) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        }));

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
        return NextResponse.json({ error: "ไม่สามารถดึงข้อมูลผู้ใช้ได้" }, { status: 500 });
    }
}