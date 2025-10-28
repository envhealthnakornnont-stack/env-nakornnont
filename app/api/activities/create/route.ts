import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";
import { JSDOM } from "jsdom";

import { saveBufferUnder } from "@/lib/uploads";
import { connectOrCreateTags } from "@/lib/tags";
import { makeSlugFromTitle } from "@/lib/slug";

/** แปลง <img src="data:..."> ใน HTML → อัปโหลดเป็นไฟล์ แล้วแทนที่ src เป็น /api/uploads/... */
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

export async function POST(req: NextRequest) {
  try {
    // Auth & role
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = session.user.role?.toUpperCase();
    if (!["USER", "SUPERUSER"].includes(role || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // รับข้อมูลจาก FormData
    const form = await req.formData();

    const title = String(form.get("title") || "");
    let contentHtml = String(form.get("contentHtml") || "");
    const authorId = Number(form.get("authorId") || session.user.id);

    const status = String(form.get("status") || "PUBLISHED").toUpperCase() as "DRAFT" | "PUBLISHED" | "ARCHIVED";
    const eventDateStr = (form.get("eventDate") as string | null) || null;
    const publishedAtStr = (form.get("publishedAt") as string | null) || null;

    const location = form.get("location") ? String(form.get("location")) : null;
    const organizer = form.get("organizer") ? String(form.get("organizer")) : null;

    const galleryJson = (form.get("gallery") as string | null) ?? null;         // '[{src,alt}]'
    const attachmentsJson = (form.get("attachments") as string | null) ?? null; // '[{label,url}]'
    const tagsJson = (form.get("tags") as string | null) ?? null;               // '["ชุมชน","สุขาภิบาล"]'

    const incomingSlug = form.get("slug") ? String(form.get("slug")) : null;    // optional
    const coverImage = form.get("coverImage") as File | null;                   // optional

    // Validate ขั้นต้น
    if (!title.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    // เตรียม slug จาก lib/slug (ไม่มี ensureUniqueSlug)
    const baseSlug = incomingSlug?.trim() ? incomingSlug.trim() : makeSlugFromTitle(title);

    // สร้างโฟลเดอร์สุ่มของกิจกรรมนี้
    const activityFolder = uuidv4();

    // อัปโหลดรูปฝัง base64 ภายใน contentHtml
    if (contentHtml) {
      contentHtml = await materializeBase64Images(contentHtml, activityFolder);
    }

    // ปกรายการ (ถ้ามี)
    let coverUrl: string | null = null;
    if (coverImage && coverImage.size > 0) {
      if (!coverImage.type.startsWith("image/")) {
        return NextResponse.json({ error: "Cover image must be an image file" }, { status: 400 });
      }
      const filename = `${Date.now()}-${coverImage.name}`;
      const buf = Buffer.from(await coverImage.arrayBuffer());
      coverUrl = await saveBufferUnder(buf, ["activities", activityFolder, "cover"], filename);
    }

    // สแนปช็อตผู้เขียน
    const author = await prisma.user.findUnique({ where: { id: authorId } });
    const authorSnapshot = author
      ? {
        name: `${author.firstname} ${author.lastname}`,
        email: author.email,
        department: author.department,
        avatar: author.avatar,
      }
      : undefined;

    // parse JSON fields
    let gallery: any = undefined;
    if (galleryJson) try { gallery = JSON.parse(galleryJson); } catch { }
    let attachments: any = undefined;
    if (attachmentsJson) try { attachments = JSON.parse(attachmentsJson); } catch { }
    let tagNames: string[] = [];
    if (tagsJson) try { tagNames = JSON.parse(tagsJson); } catch { }

    // พยายามสร้าง record และกัน unique constraint ของ slug แบบ retry เบา ๆ (ไม่ต้องใช้ ensureUniqueSlug)
    const tryCreate = async (slugAttempt: string) => {
      return prisma.activity.create({
        data: {
          title,
          slug: slugAttempt,
          contentHtml: contentHtml || null,
          authorId,
          authorSnapshot,

          image: coverUrl,
          status,
          eventDate: eventDateStr ? new Date(eventDateStr) : null,
          publishedAt: publishedAtStr ? new Date(publishedAtStr) : new Date(),

          location,
          organizer,
          gallery,
          attachments,

          tags: await connectOrCreateTags(tagNames),
        },
        include: { tags: true },
      });
    };

    let created = null;
    let slugAttempt = baseSlug;
    for (let i = 0; i < 3; i++) {
      try {
        created = await tryCreate(slugAttempt);
        break;
      } catch (err: any) {
        // Prisma P2002 = Unique constraint failed
        const isUnique = err?.code === "P2002" && Array.isArray(err?.meta?.target) && err.meta.target.includes("slug");
        if (!isUnique) throw err;
        // ชน slug → เติม suffix เล็กน้อยแล้วลองใหม่ (ยังคงไม่ใช้ ensureUniqueSlug)
        slugAttempt = `${baseSlug}-${uuidv4().slice(0, 6)}`;
      }
    }
    if (!created) {
      return NextResponse.json({ error: "Failed to create activity (slug conflict)" }, { status: 409 });
    }

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}