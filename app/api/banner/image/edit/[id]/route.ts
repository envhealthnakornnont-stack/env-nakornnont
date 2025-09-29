import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

const BANNER_BASE_PATH = path.join(process.cwd(), "uploads", "banner", "image");

function buildBannerPath(folder: string, filename: string) {
  return path.join(BANNER_BASE_PATH, folder, "cover", filename);
}

function createSafeFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const safe = slugify(base, { lower: true, strict: true });
  return `${Date.now()}-${safe}${ext}`;
}

async function saveFile(buffer: Buffer, folder: string, filename: string): Promise<string> {
  const fullPath = buildBannerPath(folder, filename);
  const dir = path.dirname(fullPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, buffer);
  return `/uploads/banner/image/${folder}/cover/${filename}`;
}

function deleteIfExists(fileUrl: string) {
  const filePath = path.join(process.cwd(), fileUrl);
  if (!fs.existsSync(filePath)) return;
  fs.unlinkSync(filePath);

  const coverDir = path.dirname(filePath);
  const bannerDir = path.dirname(coverDir);

  if (fs.existsSync(coverDir) && fs.readdirSync(coverDir).length === 0) fs.rmdirSync(coverDir);
  if (fs.existsSync(bannerDir) && fs.readdirSync(bannerDir).length === 0) fs.rmdirSync(bannerDir);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session || session.user.role !== "SUPERUSER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const form = await req.formData();
    const title = form.get("title") as string;
    const sortOrder = parseInt(form.get("sortOrder") as string, 10);
    const isActive = form.get("isActive") as string;
    const fileDesktop = form.get("coverImageDesktop") as File | null;
    const fileMobile = form.get("coverImageMobile") as File | null;

    if (!title || !sortOrder || !isActive || isNaN(sortOrder) || sortOrder < 1 || sortOrder > 6) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบหรือไม่ถูกต้อง" }, { status: 400 });
    }

    if (isActive !== "0" && isActive !== "1") {
      return NextResponse.json({ error: "isActive ต้องเป็น 0 หรือ 1" }, { status: 400 });
    }

    const existing = await prisma.bannerImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    const duplicate = await prisma.bannerImage.count({
      where: { sortOrder, id: { not: id } },
    });
    if (duplicate > 0) {
      return NextResponse.json({ error: "Sort Order ซ้ำ" }, { status: 400 });
    }

    if (isActive === "1") {
      const active = await prisma.bannerImage.findFirst({
        where: { isActive: true, id: { not: id } },
      });
      if (active) {
        return NextResponse.json({ error: "มีแบนเนอร์ที่แสดงอยู่แล้ว ไม่สามารถเปิดใช้งานมากกว่า 1 รายการได้" }, { status: 400 });
      }
    }

    let imageDesktop = existing.imageDesktop;
    if (fileDesktop && fileDesktop.size > 0) {
      if (imageDesktop) deleteIfExists(imageDesktop);
      const filename = createSafeFilename(fileDesktop.name);
      const buffer = Buffer.from(await fileDesktop.arrayBuffer());
      const folder = imageDesktop?.split("/")[4] || uuidv4();
      imageDesktop = await saveFile(buffer, folder, filename);
    }

    let imageMobile = existing.imageMobile;
    if (fileMobile && fileMobile.size > 0) {
      if (imageMobile) deleteIfExists(imageMobile);
      const filename = createSafeFilename(fileMobile.name);
      const buffer = Buffer.from(await fileMobile.arrayBuffer());
      const folder = imageMobile?.split("/")[4] || uuidv4();
      imageMobile = await saveFile(buffer, folder, filename);
    }

    const updated = await prisma.bannerImage.update({
      where: { id },
      data: {
        title,
        sortOrder,
        isActive: isActive === "1",
        imageDesktop,
        imageMobile,
      },
    });

    return NextResponse.json({ success: true, banner: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายใน" }, { status: 500 });
  }
}
