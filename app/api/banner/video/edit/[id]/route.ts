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

function deleteFileAndCleanUp(fileUrl: string) {
  const filePath = path.join(process.cwd(), fileUrl);
  if (!fs.existsSync(filePath)) return;
  try {
    fs.unlinkSync(filePath);
    const coverFolder = path.dirname(filePath);
    if (fs.existsSync(coverFolder) && fs.readdirSync(coverFolder).length === 0) fs.rmdirSync(coverFolder);
    const bannerFolder = path.dirname(coverFolder);
    if (fs.existsSync(bannerFolder) && fs.readdirSync(bannerFolder).length === 0) fs.rmdirSync(bannerFolder);
  } catch (e) {
    console.error("Failed to delete", e);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "SUPERUSER") return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });

    const { id } = await params;
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

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

    if (!title.trim() || !href.trim()) return NextResponse.json({ error: "title, href เป็นค่าบังคับ" }, { status: 400 });
    if (sortOrder < 1 || sortOrder > 6) return NextResponse.json({ error: "sortOrder ต้องเป็น 1..6" }, { status: 400 });

    const dup = await prisma.carouselImage.count({ where: { sortOrder, id: { not: id } } });
    if (dup > 0) return NextResponse.json({ error: "sortOrder นี้ถูกใช้งานแล้ว" }, { status: 400 });

    const existing = await prisma.carouselImage.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Carousel image not found" }, { status: 404 });

    let imageDesktop = existing.imageDesktop;
    let imageMobile = existing.imageMobile;

    const updateFile = async (file: File | null, currentUrl: string) => {
      if (!file) return currentUrl;
      if (currentUrl) deleteFileAndCleanUp(currentUrl);
      let folder = "";
      if (currentUrl) {
        const parts = currentUrl.split("/");
        if (parts.length >= 5) folder = parts[4];
      }
      if (!folder) folder = uuidv4();
      const ext = path.extname(file.name);
      const base = path.basename(file.name, ext);
      const safe = slugify(base, { lower: true, strict: true });
      const filename = `${Date.now()}-${safe}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      return saveFileBuffer(buffer, `${folder}/cover`, filename);
    };

    imageDesktop = await updateFile(imageDesktopFile, imageDesktop);
    imageMobile = await updateFile(imageMobileFile, imageMobile);

    const updated = await prisma.carouselImage.update({
      where: { id },
      data: {
        title,
        href,
        badge,
        priority,
        sortOrder,
        isActive,
        imageDesktop,
        imageMobile,
        publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : undefined,
      },
    });

    return NextResponse.json({ success: true, banner: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating carousel image:", error);
    return NextResponse.json(
      { error: "Failed to update carousel image", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
