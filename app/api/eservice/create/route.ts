// File: app/api/eservice/create/route.ts
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
  folderPath: string, // folderPath relative to public/uploads/eservice/image
  filename: string
): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "uploads", "eservice", "image", folderPath);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  // คืนค่า URL สำหรับเข้าถึงไฟล์ (relative path จาก public)
  return `/uploads/eservice/image/${folderPath}/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    // ตรวจสอบ session และสิทธิ์
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "SUPERUSER") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    // รับข้อมูลจาก FormData (multipart/form-data)
    const form = await req.formData();
    const title = form.get("title") as string;
    const linkURL = form.get("linkURL") as string;
    const imageFile = form.get("coverImage") as File;

    // ตรวจสอบข้อมูลที่จำเป็น
    const missingFields: string[] = [];
    if (!title || !title.trim()) missingFields.push("title");
    if (!linkURL || !linkURL.trim()) missingFields.push("linkURL");
    if (!imageFile || imageFile.size === 0) missingFields.push("coverImage");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // ตรวจสอบประเภทของไฟล์
    if (!["image/jpeg", "image/png", "image/gif"].includes(imageFile.type)) {
      return NextResponse.json({ error: "File must be an image of type .jpg, .jpeg, .png, หรือ .gif" }, { status: 400 });
    }

    // สร้าง random folder สำหรับ EService นี้
    const eserviceFolder = uuidv4();
    let imageUrl = "";
    if (imageFile) {
      const originalName = imageFile.name;
      const ext = path.extname(originalName);
      const baseName = path.basename(originalName, ext);
      const safeBaseName = slugify(baseName, { lower: true, strict: true });
      const filename = `${Date.now()}-${safeBaseName}${ext}`;
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = await saveFileBuffer(buffer, `${eserviceFolder}/cover`, filename);
    }

    // สร้าง record ใหม่ในฐานข้อมูลสำหรับ EService
    const newEService = await prisma.eService.create({
      data: {
        title,
        linkURL,
        image: imageUrl,
      },
    });

    return NextResponse.json({ success: true, eService: newEService }, { status: 201 });
  } catch (error) {
    console.error("Error creating EService:", error);
    return NextResponse.json(
      { error: "Failed to create EService", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
