import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

// Helper function สำหรับบันทึกไฟล์ลงในโฟลเดอร์ที่กำหนดภายใต้ public/uploads/agency/personnel
async function saveFileBuffer(
  buffer: Buffer,
  folderPath: string, // folderPath relative to public/uploads/agency/personnel
  filename: string
): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "uploads", "agency", "personnel", folderPath);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  // คืนค่า URL สำหรับเข้าถึงไฟล์ (relative path จาก public)
  return `/uploads/agency/personnel/${folderPath}/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    // ตรวจสอบ session
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // จำกัดสิทธิ์ให้เฉพาะ SUPERUSER เท่านั้น
    if (session.user.role !== "SUPERUSER") {
      return NextResponse.json(
        { error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    // รับข้อมูลจาก request body (แบบ JSON)
    // รับข้อมูลจาก FormData (multipart/form-data)
    const form = await req.formData();
    const nameTitle = form.get("nameTitle") as string;
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const position = form.get("position") as string;
    const positionName = form.get("positionName") as string;
    const department = form.get("department") as string;
    const coverImageFile = form.get("coverImage") as File;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!nameTitle || !firstName || !lastName || !position || !positionName || !coverImageFile) {
      return NextResponse.json(
        { error: "Missing required fields: nameTitle, firstName, lastName, position, positionName, image" },
        { status: 400 }
      );
    }

    // สร้าง random folder สำหรับบุคลากรนี้
    const personnelFolder = uuidv4();
    let imageUrl = "";
    if (coverImageFile) {
      // ดึง extension จากชื่อไฟล์
      const originalName = coverImageFile.name;
      const ext = path.extname(originalName); // เช่น .jpg, .png
      const baseName = path.basename(originalName, ext);
      // ใช้ slugify เพื่อแปลงชื่อไฟล์ให้เป็นภาษาอังกฤษและปลอดภัย
      const safeBaseName = slugify(baseName, { lower: true, strict: true });
      const filename = `${Date.now()}-${safeBaseName}${ext}`;
      const buffer = Buffer.from(await coverImageFile.arrayBuffer());
      // บันทึกไฟล์รูปภาพลงในโฟลเดอร์ "cover" ภายใน personnelFolder
      imageUrl = await saveFileBuffer(buffer, `${personnelFolder}/cover`, filename);
    }

    // สร้าง record ใหม่ในฐานข้อมูล
    const newPersonnel = await prisma.agencyPersonnel.create({
      data: {
        nameTitle,
        firstName,
        lastName,
        position,
        positionName,
        department,
        image: imageUrl,
      },
    });

    return NextResponse.json({ success: true, personnel: newPersonnel }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "ไม่สามารถสร้างบุคลากรของหน่วยงานได้", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
