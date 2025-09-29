import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // ตรวจสอบ session ว่ามีผู้ใช้หรือไม่
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

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // ดึงข้อมูลบุคลากรก่อนลบ เพื่อดูว่ามีไฟล์รูปอยู่หรือไม่
    const personnel = await prisma.agencyPersonnel.findUnique({
      where: { id },
    });
    if (!personnel) {
      return NextResponse.json({ error: "Personnel not found" }, { status: 404 });
    }

    // ถ้ามีรูปใน field image ให้ลบไฟล์และโฟลเดอร์ที่เกี่ยวข้อง
    if (personnel.image) {
      // สมมุติว่า personnel.image เก็บเป็น URL แบบ relative จาก public เช่น
      // "/uploads/agency/personnel/{folder}/cover/filename.jpg"
      const filePath = path.join(process.cwd(),  personnel.image);
      if (fs.existsSync(filePath)) {
        try {
          // ลบไฟล์
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);

          // ลบโฟลเดอร์ที่เก็บไฟล์ cover ถ้าโฟลเดอร์ว่างเปล่า
          const coverFolder = path.dirname(filePath);
          if (fs.existsSync(coverFolder) && fs.readdirSync(coverFolder).length === 0) {
            fs.rmdirSync(coverFolder);
            console.log(`Deleted folder: ${coverFolder}`);
          }

          // ลบโฟลเดอร์หลัก (personnel folder) ถ้าโฟลเดอร์นี้ว่างเปล่า
          const personnelFolder = path.dirname(coverFolder);
          if (fs.existsSync(personnelFolder) && fs.readdirSync(personnelFolder).length === 0) {
            fs.rmdirSync(personnelFolder);
            console.log(`Deleted folder: ${personnelFolder}`);
          }
        } catch (err) {
          console.error(`Failed to delete file or folder for ${filePath}:`, err);
        }
      }
    }

    // ลบข้อมูลบุคลากรออกจากฐานข้อมูล
    const deletedPersonnel = await prisma.agencyPersonnel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, personnel: deletedPersonnel }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete personnel", message: (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
