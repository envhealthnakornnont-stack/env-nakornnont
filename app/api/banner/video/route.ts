import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // ดึงข้อมูล banner video จากฐานข้อมูล (สมมุติว่า model ของคุณชื่อว่า bannerVideo)
    const bannerVideos = await prisma.bannerVideo.findMany({
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

    return NextResponse.json(bannerVideos, { status: 200 });
  } catch (error) {
    console.error("Error fetching banner videos:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to fetch banner videos", message: errorMessage },
      { status: 500 }
    );
  }
}
