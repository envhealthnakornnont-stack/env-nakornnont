// File: app/api/eservice/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

async function saveFileBuffer(
  buffer: Buffer,
  folderPath: string,
  filename: string
): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "uploads", "eservice", "image", folderPath);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/eservice/image/${folderPath}/${filename}`;
}

function deleteFileAndCleanUp(fileUrl: string) {
  const filePath = path.join(process.cwd(), fileUrl);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
      const coverFolder = path.dirname(filePath);
      if (fs.existsSync(coverFolder) && fs.readdirSync(coverFolder).length === 0) {
        fs.rmdirSync(coverFolder);
        console.log(`Deleted folder: ${coverFolder}`);
      }
      const eserviceFolder = path.dirname(coverFolder);
      if (fs.existsSync(eserviceFolder) && fs.readdirSync(eserviceFolder).length === 0) {
        fs.rmdirSync(eserviceFolder);
        console.log(`Deleted folder: ${eserviceFolder}`);
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
    // ตรวจสอบ session และสิทธิ์
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "SUPERUSER") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // รับข้อมูลจาก FormData (multipart/form-data)
    const form = await req.formData();
    const title = form.get("title") as string;
    const linkURL = form.get("linkURL") as string;
    // รับไฟล์ใหม่ (ถ้ามี)
    const imageFile = form.get("coverImage") as File | null;

    // ตรวจสอบข้อมูลที่จำเป็น (สำหรับการแก้ไข, title และ linkURL ต้องมี)
    const missingFields: string[] = [];
    if (!title || !title.trim()) missingFields.push("title");
    if (!linkURL || !linkURL.trim()) missingFields.push("linkURL");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // ดึงข้อมูล EService เดิมจากฐานข้อมูล
    const existingEService = await prisma.eService.findUnique({
      where: { id },
    });
    if (!existingEService) {
      return NextResponse.json({ error: "EService not found" }, { status: 404 });
    }

    let updatedImageUrl = existingEService.image;
    if (imageFile && imageFile.size > 0) {
      // ลบไฟล์เก่า (ถ้ามี)
      if (existingEService.image) {
        deleteFileAndCleanUp(existingEService.image);
      }
      // พยายามดึง folder จาก URL ของไฟล์เก่า
      let eserviceFolder = "";
      if (existingEService.image) {
        const parts = existingEService.image.split("/");
        if (parts.length >= 5) {
          eserviceFolder = parts[4];
        }
      }
      if (!eserviceFolder) {
        eserviceFolder = uuidv4();
      }
      const ext = path.extname(imageFile.name);
      const baseName = path.basename(imageFile.name, ext);
      const safeBaseName = slugify(baseName, { lower: true, strict: true });
      const filename = `${Date.now()}-${safeBaseName}${ext}`;
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      updatedImageUrl = await saveFileBuffer(buffer, `${eserviceFolder}/cover`, filename);
    }

    // ทำการอัปเดตข้อมูลในฐานข้อมูลสำหรับ EService
    const updatedEService = await prisma.eService.update({
      where: { id },
      data: {
        title,
        linkURL,
        image: updatedImageUrl,
      },
    });

    return NextResponse.json({ success: true, eService: updatedEService }, { status: 200 });
  } catch (error) {
    console.error("Error updating EService:", error);
    return NextResponse.json(
      { error: "Failed to update EService", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
