import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";
import { JSDOM } from "jsdom";
import path from "path";
// import fs from "fs";
import { saveBufferUnder, toRealPath, rmFileIfExists } from "@/lib/uploads";
import { connectOrCreateTags } from "@/lib/tags";

function extractApiUploadSrcs(html: string | null | undefined) {
  if (!html) return [] as string[];
  const dom = new JSDOM(html);
  return Array.from(dom.window.document.querySelectorAll("img"))
    .map((img) => img.getAttribute("src") || "")
    .filter((src) => src.startsWith("/api/uploads/"));
}

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
    const url = await saveBufferUnder(buf, ["activities", baseFolder, "content"], filename);
    img.setAttribute("src", `/api/uploads${url}`);
  }
  return doc.body.innerHTML;
}

function inferActivityFolderFromCover(url: string | null | undefined) {
  if (!url) return "";
  const parts = url.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => p === "activities");
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
    let contentHtml = String(form.get("contentHtml") || "");
    const status = String(form.get("status") || "PUBLISHED").toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED";
    const eventDateStr = form.get("eventDate") as string | null;
    const publishedAtStr = form.get("publishedAt") as string | null;

    const location = form.get("location") ? String(form.get("location")) : null;
    const organizer = form.get("organizer") ? String(form.get("organizer")) : null;

    const galleryJson = (form.get("gallery") as string | null) ?? null;           // '[{src,alt}]'
    const attachmentsJson = (form.get("attachments") as string | null) ?? null;   // '[{label,url}]'
    const tagsJson = (form.get("tags") as string | null) ?? null;                 // '["สุขาภิบาล","ชุมชน"]'

    const coverImage = form.get("coverImage") as File | null;

    if (!title.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const role = session.user.role?.toUpperCase();
    if (role !== "SUPERUSER" && existing.authorId !== Number(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let actFolder = inferActivityFolderFromCover(existing.image) || uuidv4();

    // cover
    let coverUrl = existing.image || null;
    if (coverImage && coverImage.size > 0) {
      if (!coverImage.type.startsWith("image/")) {
        return NextResponse.json({ error: "Cover must be image file" }, { status: 400 });
      }
      if (existing.image) {
        const absOld = path.join(process.cwd(), existing.image);
        rmFileIfExists(absOld);
      }
      const filename = `${Date.now()}-${coverImage.name}`;
      const buf = Buffer.from(await coverImage.arrayBuffer());
      coverUrl = await saveBufferUnder(buf, ["activities", actFolder, "cover"], filename);
    }

    // diff images
    const oldSrcs = extractApiUploadSrcs(existing.contentHtml ?? null);
    if (contentHtml) {
      contentHtml = await materializeBase64Images(contentHtml, actFolder);
    }
    const newSrcs = extractApiUploadSrcs(contentHtml);
    const toDelete = oldSrcs.filter((s) => !newSrcs.includes(s));
    for (const s of toDelete) {
      const abs = toRealPath(s);
      if (abs) rmFileIfExists(abs);
    }

    // parse JSON
    let gallery: any = undefined;
    if (galleryJson) try { gallery = JSON.parse(galleryJson); } catch {}
    let attachments: any = undefined;
    if (attachmentsJson) try { attachments = JSON.parse(attachmentsJson); } catch {}
    let tagsArr: string[] = [];
    if (tagsJson) try { tagsArr = JSON.parse(tagsJson); } catch {}

    const updateData: any = {
      title,
      contentHtml: contentHtml || null,
      image: coverUrl,
      status,
      eventDate: eventDateStr ? new Date(eventDateStr) : existing.eventDate,
      publishedAt: publishedAtStr ? new Date(publishedAtStr) : existing.publishedAt,
      location,
      organizer,
      gallery,
      attachments,
      tags: {
        set: [],
        ...(await connectOrCreateTags(tagsArr)),
      },
    };

    const item = await prisma.activity.update({
      where: { id },
      data: updateData,
      include: { tags: true },
    });

    return NextResponse.json({ item }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}