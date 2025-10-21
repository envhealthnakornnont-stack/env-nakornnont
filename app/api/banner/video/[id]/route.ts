import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPERUSER")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const banner = await prisma.carouselImage.findUnique({ where: { id } });
    if (!banner) return NextResponse.json({ error: "Carousel image not found" }, { status: 404 });

    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    console.error("Error fetching Carousel image:", error);
    return NextResponse.json(
      { error: "Failed to fetch Carousel image", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
