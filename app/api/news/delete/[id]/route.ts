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

    // ดึงข้อมูล news ที่จะลบออกมาก่อน
    const news = await prisma.news.findUnique({
      where: { id },
    });
    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // ตรวจสอบสิทธิ์: SUPERUSER สามารถลบได้ทุก news
    // ส่วน USER สามารถลบได้เฉพาะ news ที่ตนเองสร้าง
    if (session.user.role.toUpperCase() !== "SUPERUSER") {
      if (news.authorId !== Number(session.user.id)) {
        return NextResponse.json({ error: "คุณไม่มีสิทธิ์ลบกิจกรรมนี้" }, { status: 403 });
      }
    }

    // ลบ news จากฐานข้อมูล
    const deletedNews = await prisma.news.delete({
      where: { id },
    });

    // สกัดชื่อโฟลเดอร์ newsFolder จาก URL
    let newsFolder = "";
    if (deletedNews.image) {
      // สมมุติว่า URL รูปปกมีรูปแบบ:
      // /uploads/news/<newsFolder>/cover/filename
      const parts = deletedNews.image.split("/");
      if (parts.length >= 4) {
        newsFolder = parts[3]; // index 3 คือชื่อโฟลเดอร์สุ่มสำหรับ activity
      }
    } else if (deletedNews.content && typeof deletedNews.content === "string") {
      // ถ้าไม่มี cover image ให้ลองสกัดจาก <img> ใน description
      const dom = new JSDOM(deletedNews.content);
      const document = dom.window.document;
      const img = document.querySelector("img");
      if (img) {
        const src = img.getAttribute("src");
        if (src) {
          const parts = src.split("/");
          if (parts.length >= 4) {
            newsFolder = parts[3];
          }
        }
      }
    }

    // ลบโฟลเดอร์ newsFolder หากได้ระบุไว้
    if (newsFolder) {
      const folderPath = path.join(process.cwd(), "uploads", "news", newsFolder);
      if (fs.existsSync(folderPath)) {
        try {
          fs.rmSync(folderPath, { recursive: true, force: true });
          console.log(`Deleted folder: ${folderPath}`);
        } catch (err) {
          console.error(`Failed to delete folder ${folderPath}:`, err);
        }
      }
    } else {
      // กรณีที่ไม่สามารถสกัดชื่อโฟลเดอร์ได้ ให้ลองลบไฟล์ใน content ทีละไฟล์
      if (deletedNews.content && typeof deletedNews.content === "string") {
        const dom = new JSDOM(deletedNews.content);
        const document = dom.window.document;
        const imgElements = document.querySelectorAll("img");
        imgElements.forEach((img) => {
          const src = img.getAttribute("src");
          if (src && src.startsWith("/uploads/news/")) {
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
      { message: "News deleted successfully", news: deletedNews },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}
