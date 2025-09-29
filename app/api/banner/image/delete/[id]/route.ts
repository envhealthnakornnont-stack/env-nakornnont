import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";

function deleteFileAndCleanUp(fileUrl: string) {
  const filePath = path.join(process.cwd(), fileUrl);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);

      // ลบโฟลเดอร์ cover ถ้าโฟลเดอร์ว่างเปล่า
      const coverFolder = path.dirname(filePath);
      if (fs.existsSync(coverFolder) && fs.readdirSync(coverFolder).length === 0) {
        fs.rmdirSync(coverFolder);
        console.log(`Deleted folder: ${coverFolder}`);
      }

      // ลบโฟลเดอร์หลัก (bannerFolder) ถ้าโฟลเดอร์ว่างเปล่า
      const bannerFolder = path.dirname(coverFolder);
      if (fs.existsSync(bannerFolder) && fs.readdirSync(bannerFolder).length === 0) {
        fs.rmdirSync(bannerFolder);
        console.log(`Deleted folder: ${bannerFolder}`);
      }
    } catch (err) {
      console.log(`Failed to delete file or folder for ${filePath}:`, err);
    }
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ตรวจสอบ session ว่าล็อกอินหรือไม่
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // จำกัดสิทธิ์ให้เฉพาะ SUPERUSER เท่านั้น
    if (session.user.role !== "SUPERUSER") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // ดึงข้อมูลแบนเนอร์จากฐานข้อมูล
    const banner = await prisma.bannerImage.findUnique({
      where: { id },
    });
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    // ลบไฟล์รูปของ imageDesktop (ถ้ามี)
    if (banner.imageDesktop) {
      deleteFileAndCleanUp(banner.imageDesktop);
    }
    // ลบไฟล์รูปของ imageMobile (ถ้ามี)
    if (banner.imageMobile) {
      deleteFileAndCleanUp(banner.imageMobile);
    }

    // ลบ record แบนเนอร์จากฐานข้อมูล
    const deletedBanner = await prisma.bannerImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, banner: deletedBanner }, { status: 200 });
  } catch (error) {
    console.log("Error deleting banner:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete banner", 
        message: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
