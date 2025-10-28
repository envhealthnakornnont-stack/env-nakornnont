import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";
import { JSDOM } from "jsdom";
import path from "path";
import { saveBufferUnder, toRealPath, rmFileIfExists } from "@/lib/uploads";
import { connectOrCreateTags } from "@/lib/tags";

/** ดึง src ทั้งหมดของรูปที่เสิร์ฟผ่าน /api/uploads/... จาก HTML */
function extractApiUploadSrcs(html: string | null | undefined) {
  if (!html) return [] as string[];
  const dom = new JSDOM(html);
  return Array.from(dom.window.document.querySelectorAll("img"))
    .map((img) => img.getAttribute("src") || "")
    .filter((src) => src.startsWith("/api/uploads/"));
}

/** แทนที่ <img src="data:..."> → อัปโหลดไฟล์ แล้วแทนเป็น /api/uploads/... */
async function materializeBase64Images(html: string, baseFolder: string) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const imgs = Array.from(doc.querySelectorAll("img"));
  for (const img of imgs) {
    const src = img.getAttribute("src") || "";
    if (!src.startsWith("data:")) continue;
    const [meta, b64] = src.split(",");
    const mime = meta.match(/^data:(.*?);base64$/)?.[1] || "image/png";
    const ext =
      mime === "image/jpeg" ? "jpg" :
        mime === "image/gif" ? "gif" :
          mime === "image/webp" ? "webp" : "png";
    const filename = `${Date.now()}-${uuidv4()}.${ext}`;
    const buf = Buffer.from(b64, "base64");
    const url = await saveBufferUnder(buf, ["news", baseFolder, "content"], filename);
    img.setAttribute("src", `/api/uploads${url}`);
  }
  return doc.body.innerHTML;
}

/** เดา newsFolder จาก URL ปก /uploads/news/<folder>/cover/... */
function inferNewsFolderFromCover(url: string | null | undefined) {
  if (!url) return "";
  const parts = url.split("/").filter(Boolean);
  // ['', 'uploads', 'news', '<folder>', 'cover', 'file']
  const idx = parts.findIndex((p) => p === "news");
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  return "";
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.id;
    const form = await req.formData();

    const title = String(form.get("title") || "");
    const description = String(form.get("description") || "");
    let contentHtml = String(form.get("contentHtml") || "");
    const status = String(form.get("status") || "PUBLISHED").toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED";
    const publishedAtStr = form.get("publishedAt") as string | null;
    const coverImage = form.get("coverImage") as File | null;
    const heroCredit = form.get("heroCredit") ? String(form.get("heroCredit")) : null;

    const tagsJson = (form.get("tags") as string | null) ?? null;                 // '["PM2.5","สิ่งแวดล้อม"]'
    const attachmentsJson = (form.get("attachments") as string | null) ?? null;   // '[{label,url}]'

    if (!title.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });
    if (!description.trim()) return NextResponse.json({ error: "description required" }, { status: 400 });

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // สิทธิ์: SUPERUSER แก้ได้ทั้งหมด; USER ได้เฉพาะของตนหรือของสาธารณะตนเองสร้าง
    const role = session.user.role?.toUpperCase();
    if (role !== "SUPERUSER" && existing.authorId !== Number(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // หาโฟลเดอร์สำหรับคอนเทนต์
    let newsFolder = inferNewsFolderFromCover(existing.image) || uuidv4();

    // บันทึกรูปปกใหม่ (ถ้ามี) และลบปกเก่า
    let coverUrl = existing.image || null;
    if (coverImage && coverImage.size > 0) {
      if (!coverImage.type.startsWith("image/")) {
        return NextResponse.json({ error: "Cover must be image file" }, { status: 400 });
      }
      if (!newsFolder) newsFolder = uuidv4();
      // ลบของเก่า (ถ้ามี)
      if (existing.image) {
        const absOld = path.join(process.cwd(), existing.image);
        rmFileIfExists(absOld);
      }
      const filename = `${Date.now()}-${coverImage.name}`;
      const buf = Buffer.from(await coverImage.arrayBuffer());
      coverUrl = await saveBufferUnder(buf, ["news", newsFolder, "cover"], filename);
    }

    // เตรียม diff รูปฝังใน HTML: เก่า vs ใหม่
    const oldSrcs = extractApiUploadSrcs(existing.contentHtml ?? null);
    // materialize base64 → อัปโหลด + แทนที่ src
    if (contentHtml) {
      contentHtml = await materializeBase64Images(contentHtml, newsFolder);
    }
    const newSrcs = extractApiUploadSrcs(contentHtml);

    // ลบไฟล์ orphan: อยู่ในของเก่าแต่ไม่อยู่ในของใหม่
    const toDelete = oldSrcs.filter((s) => !newSrcs.includes(s));
    for (const s of toDelete) {
      const abs = toRealPath(s);
      if (abs) rmFileIfExists(abs);
    }

    // parse JSONs
    let tagsArr: string[] = [];
    if (tagsJson) try { tagsArr = JSON.parse(tagsJson); } catch { }
    let attachments: any = undefined;
    if (attachmentsJson) try { attachments = JSON.parse(attachmentsJson); } catch { }

    const updateData: any = {
      title,
      description,
      contentHtml: contentHtml || null,
      image: coverUrl,
      heroCredit,
      status,
      publishedAt: publishedAtStr ? new Date(publishedAtStr) : existing.publishedAt,
      attachments,
      // tags: set + connect
      tags: {
        set: [],
        ...(await connectOrCreateTags(tagsArr)),
      },
    };

    const item = await prisma.news.update({
      where: { id },
      data: updateData,
      include: { tags: true },
    });

    return NextResponse.json({ item }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}