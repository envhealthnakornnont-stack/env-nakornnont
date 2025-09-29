import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";

function isNodeError(err: unknown): err is NodeJS.ErrnoException {
  return typeof err === "object" && err !== null && "code" in err;
}

// ลบไฟล์ และถ้าโฟลเดอร์ว่างให้ลบโฟลเดอร์ด้วย
function deleteFileIfExists(fileUrl: string) {
  const filePath = path.join(process.cwd(), fileUrl);
  if (!fs.existsSync(filePath)) return;
  // 1) ลบไฟล์
  try {
    fs.unlinkSync(filePath);
    console.log(`Deleted avatar file: ${filePath}`);
  } catch (err) {
    console.error("Error deleting avatar file:", err);
    return;
  }
  // 2) ตรวจสอบและลบโฟลเดอร์ถ้าว่างเปล่า
  const folderPath = path.dirname(filePath);
  try {
    // fs.rmdirSync จะลบเฉพาะถ้าว่างเท่านั้น
    fs.rmdirSync(folderPath);
    console.log(`Deleted empty folder: ${folderPath}`);
  } catch (err: unknown) {
    if (isNodeError(err)) {
      if (err.code === "ENOTEMPTY") {
        console.log(`Folder not empty, skip deleting: ${folderPath}`);
      } else {
        console.error("Error deleting folder:", err);
      }
    } else {
      console.error("Unknown error deleting folder:", err);
    }
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
  try {
    // ส่ง req เข้าไปตรวจสอบ session
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user || session.user.role.toUpperCase() !== "SUPERUSER") {
      return NextResponse.json(
        { error: "ไม่ได้รับอนุญาต: มีเพียง SUPERUSER เท่านั้นที่สามารถลบผู้ใช้ได้" },
        { status: 403 }
      );
    }

    // รับค่า email จาก params
    const { email } = await params;
    if (!email) {
      return NextResponse.json({ error: "จำเป็นต้องระบุ Email" }, { status: 400 });
    }

    // Validate รูปแบบอีเมล (ขั้นสูงถ้าต้องการ)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "รูปแบบอีเมลไม่ถูกต้อง" }, { status: 400 });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่จริงหรือไม่
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้งานที่มีอีเมลนี้" }, { status: 404 });
    }

    // ถ้ามี avatar ให้ลบไฟล์ avatar ออกจากระบบไฟล์
    if (user.avatar && user.avatar.trim() !== "") {
      deleteFileIfExists(user.avatar);
    }

    // ลบผู้ใช้โดยอิงจาก email
    const deletedUser = await prisma.user.delete({
      where: { email },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: __unused, ...userWithoutPassword } = deletedUser;
    return NextResponse.json({ message: "ลบผู้ใช้สำเร็จแล้ว", user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบผู้ใช้:", error);
    return NextResponse.json({ error: "ไม่สามารถลบผู้ใช้ได้" }, { status: 500 });
  }
}
