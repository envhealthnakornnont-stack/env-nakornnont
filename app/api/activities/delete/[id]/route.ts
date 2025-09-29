import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // ดึง session พร้อมกับ req
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // ดึงข้อมูล activity ที่จะลบออกมาก่อน
    const activity = await prisma.activity.findUnique({
      where: { id },
    });
    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    // ตรวจสอบสิทธิ์: SUPERUSER สามารถลบได้ทุก activity
    // ส่วน USER สามารถลบได้เฉพาะ activity ที่ตนเองสร้าง
    if (session.user.role.toUpperCase() !== "SUPERUSER") {
      if (activity.authorId !== Number(session.user.id)) {
        return NextResponse.json({ error: "คุณไม่มีสิทธิ์ลบกิจกรรมนี้" }, { status: 403 });
      }
    }

    // ลบ activity จากฐานข้อมูล
    const deletedActivity = await prisma.activity.delete({
      where: { id },
    });

    // สกัดชื่อโฟลเดอร์ activityFolder จาก URL
    let activityFolder = "";
    if (deletedActivity.image) {
      // สมมุติว่า URL รูปปกมีรูปแบบ:
      // /uploads/activities/<activityFolder>/cover/filename
      const parts = deletedActivity.image.split("/");
      if (parts.length >= 4) {
        activityFolder = parts[3]; // index 3 คือชื่อโฟลเดอร์สุ่มสำหรับ activity
      }
    } else if (deletedActivity.content && typeof deletedActivity.content === "string") {
      // ถ้าไม่มี cover image ให้ลองสกัดจาก <img> ใน description
      const dom = new JSDOM(deletedActivity.content);
      const document = dom.window.document;
      const img = document.querySelector("img");
      if (img) {
        const src = img.getAttribute("src");
        if (src) {
          const parts = src.split("/");
          if (parts.length >= 4) {
            activityFolder = parts[3];
          }
        }
      }
    }

    // ลบโฟลเดอร์ activityFolder หากได้ระบุไว้
    if (activityFolder) {
      const folderPath = path.join(process.cwd(), "uploads", "activities", activityFolder);
      if (fs.existsSync(folderPath)) {
        try {
          fs.rmSync(folderPath, { recursive: true, force: true });
          console.log(`Deleted folder: ${folderPath}`);
        } catch (err) {
          console.error(`Failed to delete folder ${folderPath}:`, err);
        }
      }
    } else {
      // กรณีที่ไม่สามารถสกัดชื่อโฟลเดอร์ได้ ให้ลองลบไฟล์ใน description ทีละไฟล์
      if (deletedActivity.content && typeof deletedActivity.content === "string") {
        const dom = new JSDOM(deletedActivity.content);
        const document = dom.window.document;
        const imgElements = document.querySelectorAll("img");
        imgElements.forEach((img) => {
          const src = img.getAttribute("src");
          if (src && src.startsWith("/uploads/activities/")) {
            const filePath = path.join(process.cwd(), src);
            if (fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath);
              } catch (err) {
                console.error(`Failed to delete file ${filePath}:`, err);
              }
            }
          }
        });
      }
    }

    return NextResponse.json(
      { message: "Activity deleted successfully", activity: deletedActivity },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}
