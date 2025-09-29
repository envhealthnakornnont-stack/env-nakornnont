import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // ดึงข้อมูลแบนเนอร์จากฐานข้อมูล (Banner model)
    const banners = await prisma.bannerImage.findMany({
      select: {
        id: true,
        title: true,
        imageMobile: true,
        imageDesktop: true,
        isActive: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(banners, { status: 200 });
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}
