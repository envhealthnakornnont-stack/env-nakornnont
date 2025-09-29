import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

// 🧱 Helper: บันทึกไฟล์ลงใน /uploads/banner/image
async function saveFileBuffer(buffer: Buffer, folderPath: string, filename: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "uploads", "banner", "image", folderPath);
  fs.mkdirSync(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);

  return `/uploads/banner/image/${folderPath}/${filename}`;
}

// 🧱 Helper: ตรวจสอบและเซฟไฟล์ภาพ
async function processImage(file: File, folderPath: string): Promise<string> {
  const originalName = file.name;
  const ext = path.extname(originalName);
  const baseName = slugify(path.basename(originalName, ext), { lower: true, strict: true });
  const filename = `${Date.now()}-${baseName}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  return await saveFileBuffer(buffer, folderPath, filename);
}

export async function POST(req: NextRequest) {
  try {
    // ✅ ตรวจสอบสิทธิ์ผู้ใช้
    const session = await getServerSession({ req, ...authOptions });
    if (!session || session.user.role !== "SUPERUSER") {
      return NextResponse.json({ error: "Unauthorized or insufficient permissions" }, { status: 401 });
    }

    // ✅ จำกัดไม่ให้มีมากกว่า 6 รายการ
    const bannerCount = await prisma.bannerImage.count();
    if (bannerCount >= 6) {
      return NextResponse.json({ error: "Cannot create more than 6 banner cards" }, { status: 400 });
    }

    // ✅ รับข้อมูลจาก form
    const form = await req.formData();
    const title = form.get("title")?.toString() || "";
    const sortOrder = Number(form.get("sortOrder"));
    const isActive = form.get("isActive")?.toString();
    const fileDesktop = form.get("coverImageDesktop") as File;
    const fileMobile = form.get("coverImageMobile") as File;

    // ✅ ตรวจสอบ input
    if (!title.trim() || !sortOrder || isNaN(sortOrder) || sortOrder < 1 || sortOrder > 6 || !["0", "1"].includes(isActive || "")) {
      return NextResponse.json({ error: "Invalid form input" }, { status: 400 });
    }

    if (!fileDesktop || !fileMobile || fileDesktop.size === 0 || fileMobile.size === 0) {
      return NextResponse.json({ error: "Missing images" }, { status: 400 });
    }

    // ✅ ตรวจสอบ sortOrder ซ้ำ
    const duplicateSort = await prisma.bannerImage.findFirst({ where: { sortOrder } });
    if (duplicateSort) {
      return NextResponse.json({ error: "Sort Order นี้ถูกใช้งานไปแล้ว" }, { status: 400 });
    }

    // ✅ ตรวจสอบ isActive ไม่ให้มีมากกว่า 1 รายการ
    if (isActive === "1") {
      const existingActive = await prisma.bannerImage.findFirst({ where: { isActive: true } });
      if (existingActive) {
        return NextResponse.json({ error: "มีแบนเนอร์ที่แสดงอยู่แล้ว ไม่สามารถเปิดใช้งานมากกว่า 1 รายการได้" }, { status: 400 });
      }
    }

    // ✅ เตรียมรูป
    const bannerFolder = uuidv4();
    const imageDesktop = await processImage(fileDesktop, `${bannerFolder}/cover`);
    const imageMobile = await processImage(fileMobile, `${bannerFolder}/cover`);

    // ✅ สร้าง Banner
    const newBanner = await prisma.bannerImage.create({
      data: {
        title,
        sortOrder,
        isActive: isActive === "1",
        imageDesktop,
        imageMobile,
      },
    });

    return NextResponse.json({ success: true, banner: newBanner }, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating banner:", error);
    return NextResponse.json({
      error: "Failed to create banner",
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
