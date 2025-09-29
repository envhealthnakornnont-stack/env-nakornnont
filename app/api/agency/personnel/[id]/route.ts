import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ตรวจสอบ session ว่ามีการล็อกอินหรือไม่
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // จำกัดสิทธิ์ให้เฉพาะ SUPERUSER เท่านั้น
    if (session.user.role !== "SUPERUSER") {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // ค้นหาบุคลากรตาม id
    const personnel = await prisma.agencyPersonnel.findUnique({
      where: { id },
      select: {
        id: true,
        nameTitle: true,
        firstName: true,
        lastName: true,
        position: true,
        positionName: true,
        department: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!personnel) {
      return NextResponse.json({ error: "Personnel not found" }, { status: 404 });
    }

    return NextResponse.json(personnel, { status: 200 });
  } catch (error) {
    console.error("Error fetching personnel:", error);
    return NextResponse.json(
      { error: "Failed to fetch personnel", message: (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
