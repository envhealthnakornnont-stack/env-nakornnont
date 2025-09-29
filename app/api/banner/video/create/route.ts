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

export async function POST(req: NextRequest) {
  try {
    // ตรวจสอบ session และสิทธิ์ (เฉพาะ SUPERUSER)
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

    // ตรวจสอบจำนวน banner video ที่มีอยู่ ถ้ามากกว่า หรือเท่ากับ 6 ไม่อนุญาตให้สร้างเพิ่ม
    const currentCount = await prisma.bannerVideo.count();
    if (currentCount >= 6) {
      return NextResponse.json({ error: "Cannot create more than 6 banner videos" }, { status: 400 });
    }

    // รับข้อมูลจาก FormData (multipart/form-data)
    const form = await req.formData();
    const title = form.get("title") as string;
    const sortOrder = form.get("sortOrder") as string;
    const isActive = form.get("isActive") as string;
    const videoDesktopFile = form.get("videoDesktop") as File;
    const videoMobileFile = form.get("videoMobile") as File;

    // ตรวจสอบข้อมูลที่จำเป็น
    const missingFields: string[] = [];
    if (!title || !title.trim()) missingFields.push("title");
    if (!sortOrder) missingFields.push("sortOrder");
    if (!isActive) missingFields.push("isActive");
    if (!videoDesktopFile || videoDesktopFile.size === 0) missingFields.push("videoDesktop");
    if (!videoMobileFile || videoMobileFile.size === 0) missingFields.push("videoMobile");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // ตรวจสอบ sortOrder ให้อยู่ในช่วง 1 ถึง 6
    const numericSortOrder = Number(sortOrder);
    if (numericSortOrder < 1 || numericSortOrder > 6) {
      return NextResponse.json({ error: "Sort Order ต้องเป็นตัวเลขระหว่าง 1 ถึง 6" }, { status: 400 });
    }

    // ตรวจสอบว่า sortOrder นี้ถูกใช้งานไปแล้วหรือไม่
    const count = await prisma.bannerVideo.count({
      where: { sortOrder: numericSortOrder },
    });
    if (count > 0) {
      return NextResponse.json({ error: "Sort Order นี้ถูกใช้งานไปแล้ว" }, { status: 400 });
    }

    // ตรวจสอบ isActive ต้องเป็น "0" หรือ "1"
    if (isActive !== "0" && isActive !== "1") {
      return NextResponse.json({ error: "isActive ต้องเป็นค่า 0 หรือ 1" }, { status: 400 });
    }

    // สร้าง random folder สำหรับแบนเนอร์ video นี้
    const bannerFolder = uuidv4();

    let videoDesktopUrl = "";
    if (videoDesktopFile) {
      const originalName = videoDesktopFile.name;
      const ext = path.extname(originalName);
      const baseName = path.basename(originalName, ext);
      const safeBaseName = slugify(baseName, { lower: true, strict: true });
      const filename = `${Date.now()}-${safeBaseName}${ext}`;
      const buffer = Buffer.from(await videoDesktopFile.arrayBuffer());
      videoDesktopUrl = await saveFileBuffer(buffer, `${bannerFolder}/cover`, filename);
    }

    let videoMobileUrl = "";
    if (videoMobileFile) {
      const originalName = videoMobileFile.name;
      const ext = path.extname(originalName);
      const baseName = path.basename(originalName, ext);
      const safeBaseName = slugify(baseName, { lower: true, strict: true });
      const filename = `${Date.now()}-${safeBaseName}${ext}`;
      const buffer = Buffer.from(await videoMobileFile.arrayBuffer());
      videoMobileUrl = await saveFileBuffer(buffer, `${bannerFolder}/cover`, filename);
    }

    // สร้าง record ใหม่ในฐานข้อมูลสำหรับแบนเนอร์ video
    const newBannerVideo = await prisma.bannerVideo.create({
      data: {
        title,
        videoDesktop: videoDesktopUrl,
        videoMobile: videoMobileUrl,
        isActive: Number(isActive) === 0 ? false : true,
        sortOrder: numericSortOrder,
      },
    });

    return NextResponse.json({ success: true, bannerVideo: newBannerVideo }, { status: 201 });
  } catch (error) {
    console.error("Error creating banner video:", error);
    return NextResponse.json(
      { error: "Failed to create banner video", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
