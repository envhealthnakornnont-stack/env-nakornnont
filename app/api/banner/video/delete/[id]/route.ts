import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";

function deleteFileAndCleanUp(fileUrl: string) {
  const filePath = path.join(process.cwd(), fileUrl);
  if (!fs.existsSync(filePath)) return;
  try {
    fs.unlinkSync(filePath);
    const coverFolder = path.dirname(filePath);
    if (fs.existsSync(coverFolder) && fs.readdirSync(coverFolder).length === 0) fs.rmdirSync(coverFolder);
    const bannerFolder = path.dirname(coverFolder);
    if (fs.existsSync(bannerFolder) && fs.readdirSync(bannerFolder).length === 0) fs.rmdirSync(bannerFolder);
  } catch (e) {
    console.error("Failed to delete", e);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPERUSER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const banner = await prisma.carouselImage.findUnique({ where: { id } });
    if (!banner) return NextResponse.json({ error: "Carousel image not found" }, { status: 404 });

    if (banner.imageDesktop) deleteFileAndCleanUp(banner.imageDesktop);
    if (banner.imageMobile) deleteFileAndCleanUp(banner.imageMobile);

    const deleted = await prisma.carouselImage.delete({ where: { id } });

    return NextResponse.json({ success: true, banner: deleted }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Carousel image:", error);
    return NextResponse.json(
      { error: "Failed to delete Carousel image", message: (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
