import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

// Helper function สำหรับบันทึกไฟล์ลงในโฟลเดอร์ที่กำหนดภายใต้ public/uploads/news
async function saveFileBuffer(
  buffer: Buffer,
  folderPath: string,
  filename: string
): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "uploads", "news", folderPath);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/news/${folderPath}/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    // ตรวจสอบสิทธิ์ผู้ใช้
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!["USER", "SUPERUSER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    // รับข้อมูลจาก FormData
    const form = await req.formData();
    const title = form.get("title") as string;
    const description = form.get("detail") as string;
    const htmlContent = form.get("htmlContent") as string; // HTML content จาก editor
    const authorIdStr = form.get("authorId") as string;
    const coverImageFile = form.get("coverImage") as File;

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    // สร้าง random folder name สำหรับข่าวนี้
    const newsFolder = uuidv4();

    // ตรวจสอบว่า title เป็นภาษาไทยหรือไม่ เพื่อสร้าง slug
    const isThai = /[\u0E00-\u0E7F]/.test(title);
    const slug = isThai
      ? `${title.replace(/\s+/g, "-")}-${uuidv4().slice(0, 8)}`
      : slugify(title, { lower: true, strict: true });

    // ประมวลผล htmlContent: แปลง embedded <img> ที่มี src เป็น Base64 ให้เป็น URL
    // บันทึกไฟล์รูปใน content ลงใน subfolder "content" ภายใน newsFolder
    let finalHtml = htmlContent;
    if (htmlContent) {
          const dom = new JSDOM(htmlContent);
          const document = dom.window.document;
          const imgElements = document.querySelectorAll("img");
          for (const img of Array.from(imgElements)) {
            const src = img.getAttribute("src");
            if (src && src.startsWith("data:")) {
              // แยก base64 data
              const base64Data = src.split(",")[1];
              // ระบุ mime type เพื่อตั้งค่า extension
              const mimeMatch = src.match(/^data:(.*?);base64,/);
              let ext = "png"; // ค่า default
              if (mimeMatch && mimeMatch[1]) {
                const mime = mimeMatch[1];
                if (mime === "image/jpeg") ext = "jpg";
                else if (mime === "image/png") ext = "png";
                else if (mime === "image/gif") ext = "gif";
              }
              // สร้างชื่อไฟล์ใหม่สำหรับรูปใน description
              const filename = `${Date.now()}-${uuidv4()}.${ext}`;
              const buffer = Buffer.from(base64Data, "base64");
              // บันทึกไฟล์ในโฟลเดอร์ activityFolder/content
              const imageUrl = await saveFileBuffer(buffer, `${newsFolder}/content`, filename);
              // แทนที่ src ด้วย URL ที่แท้จริง
              img.setAttribute("src", `/api/uploads${imageUrl}`);
            }
          }
          finalHtml = document.body.innerHTML;
        }

    // บันทึก cover image หากมี ลงใน newsFolder/cover
    let coverImageUrl = "";
    if (coverImageFile) {
      const filename = `${Date.now()}-${coverImageFile.name}`;
      const buffer = Buffer.from(await coverImageFile.arrayBuffer());
      coverImageUrl = await saveFileBuffer(buffer, `${newsFolder}/cover`, filename);
    }

    // บันทึกข่าวในฐานข้อมูล
    const newNews = await prisma.news.create({
      data: {
        title,
        slug,
        description,
        content: finalHtml ? finalHtml : undefined,
        authorId: authorIdStr ? Number(authorIdStr) : null,
        image: coverImageUrl,
      },
    });

    return NextResponse.json({ success: true, news: newNews }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
