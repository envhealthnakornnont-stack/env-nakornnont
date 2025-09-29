import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";

function deleteFileAndCleanUp(fileUrl: string) {
  // fileUrl คาดว่าอยู่ในรูปแบบ: /uploads/eservice/image/{eserviceFolder}/cover/filename.ext
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
      // ลบโฟลเดอร์หลัก (eserviceFolder) ถ้าโฟลเดอร์ว่างเปล่า
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

export async function DELETE(
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

    // ดึงข้อมูล EService จากฐานข้อมูล
    const eservice = await prisma.eService.findUnique({
      where: { id },
    });
    if (!eservice) {
      return NextResponse.json({ error: "EService not found" }, { status: 404 });
    }

    // ลบไฟล์รูป (ถ้ามี)
    if (eservice.image) {
      deleteFileAndCleanUp(eservice.image);
    }

    // ลบ record จากฐานข้อมูล
    const deletedEService = await prisma.eService.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, eService: deletedEService }, { status: 200 });
  } catch (error) {
    console.error("Error deleting EService:", error);
    return NextResponse.json(
      { error: "Failed to delete EService", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
