import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

async function saveFileBuffer(buffer: Buffer, folderPath: string, filename: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "uploads", "banner", "carousel", folderPath);
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);
  return `/uploads/banner/carousel/${folderPath}/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPERUSER") return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });

    const currentCount = await prisma.carouselImage.count();
    if (currentCount >= 6) {
      return NextResponse.json({ error: "Cannot create more than 6 carousel images" }, { status: 400 });
    }

    // รับข้อมูลจาก FormData (multipart/form-data)
    const form = await req.formData();
    const title = (form.get("title") as string) || "";
    const href = (form.get("href") as string) || "";
    const badge = (form.get("badge") as string) || null;
    const priority = Number(form.get("priority") ?? 1);
    const sortOrder = Number(form.get("sortOrder") ?? 1);
    const isActive = (form.get("isActive") as string) === "1";
    const publishedAtRaw = (form.get("publishedAt") as string) || "";
    const imageDesktopFile = form.get("imageDesktop") as File | null;
    const imageMobileFile = form.get("imageMobile") as File | null;

    const missing: string[] = [];
    if (!title.trim()) missing.push("title");
    if (!href.trim()) missing.push("href");
    if (!imageDesktopFile) missing.push("imageDesktop");
    if (!imageMobileFile) missing.push("imageMobile");
    if (missing.length > 0) return NextResponse.json({ error: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
    if (sortOrder < 1 || sortOrder > 6) return NextResponse.json({ error: "sortOrder ต้องเป็น 1..6" }, { status: 400 });

    const dupSort = await prisma.carouselImage.count({ where: { sortOrder } });
    if (dupSort > 0) return NextResponse.json({ error: "sortOrder นี้ถูกใช้งานแล้ว" }, { status: 400 });

    const bannerFolder = uuidv4();

    const saveImage = async (f: File) => {
      const ext = path.extname(f.name);
      const baseName = path.basename(f.name, ext);
      const safe = slugify(baseName, { lower: true, strict: true });
      const filename = `${Date.now()}-${safe}${ext}`;
      const buffer = Buffer.from(await f.arrayBuffer());
      return saveFileBuffer(buffer, `${bannerFolder}/cover`, filename);
    };

    const imageDesktop = await saveImage(imageDesktopFile!);
    const imageMobile = await saveImage(imageMobileFile!);

    const banner = await prisma.carouselImage.create({
      data: {
        title,
        href,
        badge,
        priority,
        isActive,
        sortOrder,
        imageDesktop,
        imageMobile,
        publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : undefined,
      },
    });

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error) {
    console.error("Error creating carousel image:", error);
    return NextResponse.json(
      { error: "Failed to create carousel image", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
