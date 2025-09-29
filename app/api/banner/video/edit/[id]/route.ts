import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

// Helper function สำหรับบันทึกไฟล์ลงในโฟลเดอร์ที่กำหนดภายใต้ public/uploads/banner/video
async function saveFileBuffer(
  buffer: Buffer,
  folderPath: string, // folderPath relative to public/uploads/banner/video
  filename: string
): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "uploads", "banner", "video", folderPath);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  // คืนค่า URL สำหรับเข้าถึงไฟล์ (relative path จาก public)
  return `/uploads/banner/video/${folderPath}/${filename}`;
}

// Helper function สำหรับลบไฟล์และลบโฟลเดอร์หากว่างเปล่า
function deleteFileAndCleanUp(fileUrl: string) {
  // fileUrl คาดว่าอยู่ในรูปแบบ: /uploads/banner/video/{bannerFolder}/cover/filename.ext
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
      console.error(`Failed to delete file or folder for ${filePath}:`, err);
    }
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ตรวจสอบ session
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "SUPERUSER") {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    // รับ id จาก params
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // รับข้อมูลจาก FormData (multipart/form-data)
    const form = await req.formData();
    const title = form.get("title") as string;
    const sortOrder = form.get("sortOrder") as string;
    const isActive = form.get("isActive") as string;
    // รับไฟล์วิดีโอใหม่ (ถ้ามี)
    const coverVideoDesktopFile = form.get("coverVideoDesktop") as File | null;
    const coverVideoMobileFile = form.get("coverVideoMobile") as File | null;

    // ตรวจสอบข้อมูลที่จำเป็น
    const missingFields: string[] = [];
    if (!title || !title.trim()) missingFields.push("title");
    if (!sortOrder) missingFields.push("sortOrder");
    if (!isActive) missingFields.push("isActive");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // ตรวจสอบ isActive ให้มีค่าเป็น "0" หรือ "1"
    if (isActive !== "0" && isActive !== "1") {
      return NextResponse.json(
        { error: "isActive ต้องเป็นค่า 0 หรือ 1" },
        { status: 400 }
      );
    }

    // ตรวจสอบ sortOrder ว่าเป็นตัวเลขและอยู่ในช่วง 1 ถึง 6
    const sortOrderNum = Number(sortOrder);
    if (sortOrderNum < 1 || sortOrderNum > 6) {
      return NextResponse.json({ error: "Sort Order ต้องเป็นตัวเลขระหว่าง 1 ถึง 6" }, { status: 400 });
    }

    // ตรวจสอบว่า sortOrder นี้ถูกใช้งานโดย banner video อื่นหรือไม่ (ยกเว้น record ปัจจุบัน)
    const duplicateCount = await prisma.bannerVideo.count({
      where: {
        sortOrder: sortOrderNum,
        id: { not: id },
      },
    });
    if (duplicateCount > 0) {
      return NextResponse.json({ error: "Sort Order นี้ถูกใช้งานไปแล้ว" }, { status: 400 });
    }

    // ดึงข้อมูล banner video เดิมจากฐานข้อมูล
    const existingBanner = await prisma.bannerVideo.findUnique({
      where: { id },
    });
    if (!existingBanner) {
      return NextResponse.json({ error: "Banner video not found" }, { status: 404 });
    }

    let updatedVideoDesktopUrl = existingBanner.videoDesktop;
    if (coverVideoDesktopFile && coverVideoDesktopFile.size > 0) {
      if (existingBanner.videoDesktop) {
        deleteFileAndCleanUp(existingBanner.videoDesktop);
      }
      let bannerFolder = "";
      if (existingBanner.videoDesktop) {
        const parts = existingBanner.videoDesktop.split("/");
        // ตัวอย่าง URL: /uploads/banner/video/{bannerFolder}/cover/filename.ext
        if (parts.length >= 5) {
          bannerFolder = parts[4];
        }
      }
      if (!bannerFolder) {
        bannerFolder = uuidv4();
      }
      const ext = path.extname(coverVideoDesktopFile.name);
      const baseName = path.basename(coverVideoDesktopFile.name, ext);
      const safeBaseName = slugify(baseName, { lower: true, strict: true });
      const filename = `${Date.now()}-${safeBaseName}${ext}`;
      const buffer = Buffer.from(await coverVideoDesktopFile.arrayBuffer());
      updatedVideoDesktopUrl = await saveFileBuffer(buffer, `${bannerFolder}/cover`, filename);
    }

    let updatedVideoMobileUrl = existingBanner.videoMobile;
    if (coverVideoMobileFile && coverVideoMobileFile.size > 0) {
      if (existingBanner.videoMobile) {
        deleteFileAndCleanUp(existingBanner.videoMobile);
      }
      let bannerFolder = "";
      if (existingBanner.videoMobile) {
        const parts = existingBanner.videoMobile.split("/");
        if (parts.length >= 5) {
          bannerFolder = parts[4];
        }
      }
      if (!bannerFolder) {
        bannerFolder = uuidv4();
      }
      const ext = path.extname(coverVideoMobileFile.name);
      const baseName = path.basename(coverVideoMobileFile.name, ext);
      const safeBaseName = slugify(baseName, { lower: true, strict: true });
      const filename = `${Date.now()}-${safeBaseName}${ext}`;
      const buffer = Buffer.from(await coverVideoMobileFile.arrayBuffer());
      updatedVideoMobileUrl = await saveFileBuffer(buffer, `${bannerFolder}/cover`, filename);
    }

    // ทำการอัปเดตข้อมูล banner video ในฐานข้อมูล
    const updatedBanner = await prisma.bannerVideo.update({
      where: { id },
      data: {
        title,
        sortOrder: sortOrderNum,
        isActive: Boolean(Number(isActive)),
        videoDesktop: updatedVideoDesktopUrl,
        videoMobile: updatedVideoMobileUrl,
      },
    });

    return NextResponse.json({ success: true, banner: updatedBanner }, { status: 200 });
  } catch (error) {
    console.error("Error updating banner video:", error);
    return NextResponse.json(
      { error: "Failed to update banner video", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
