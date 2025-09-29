import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";

// Helper function สำหรับลบไฟล์และลบโฟลเดอร์หากว่างเปล่า สำหรับวิดีโอ (Banner Video)
function deleteFileAndCleanUp(fileUrl: string) {
  // fileUrl คาดว่าอยู่ในรูปแบบ: /uploads/banner/video/{bannerFolder}/cover/filename.ext
  const filePath = path.join(process.cwd(), fileUrl);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);

      // ลบโฟลเดอร์ cover (หรือโฟลเดอร์ที่เก็บไฟล์วิดีโอ) ถ้าโฟลเดอร์ว่างเปล่า
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
      console.error(`Failed to delete file or folder for ${filePath}:`, err);
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

    // รับ id จาก params (ตรวจสอบให้แน่ใจว่า params ถูก await แล้ว)
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // ดึงข้อมูล banner video จากฐานข้อมูล (ปรับโมเดลให้ตรงกับ schema ของคุณ)
    const bannerVideo = await prisma.bannerVideo.findUnique({
      where: { id },
    });
    if (!bannerVideo) {
      return NextResponse.json({ error: "Banner video not found" }, { status: 404 });
    }

    // ลบไฟล์วิดีโอของ videoDesktop (ถ้ามี)
    if (bannerVideo.videoDesktop) {
      deleteFileAndCleanUp(bannerVideo.videoDesktop);
    }
    // ลบไฟล์วิดีโอของ videoMobile (ถ้ามี)
    if (bannerVideo.videoMobile) {
      deleteFileAndCleanUp(bannerVideo.videoMobile);
    }

    // ลบ record banner video จากฐานข้อมูล
    const deletedBannerVideo = await prisma.bannerVideo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, bannerVideo: deletedBannerVideo }, { status: 200 });
  } catch (error) {
    console.error("Error deleting banner video:", error);
    return NextResponse.json(
      { error: "Failed to delete banner video", message: (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
