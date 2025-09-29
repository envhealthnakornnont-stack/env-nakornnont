import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ตรวจสอบ session ว่าผู้ใช้ล็อกอินหรือไม่
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
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // ค้นหา banner video ตาม id (สมมุติว่า model ของคุณชื่อ bannerVideo)
    const bannerVideo = await prisma.bannerVideo.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        videoMobile: true, 
        videoDesktop: true, 
        isActive: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!bannerVideo) {
      return NextResponse.json({ error: "Banner video not found" }, { status: 404 });
    }

    return NextResponse.json(bannerVideo, { status: 200 });
  } catch (error) {
    console.error("Error fetching banner video:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner video", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
