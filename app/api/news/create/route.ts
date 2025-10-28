import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";
import { JSDOM } from "jsdom";
import { makeSlugFromTitle } from "@/lib/slug";
import { connectOrCreateTags } from "@/lib/tags";
import { saveBufferUnder } from "@/lib/uploads";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const title = String(form.get("title") || "");
    const description = String(form.get("description") || "");
    let contentHtml = String(form.get("contentHtml") || "");
    const authorId = Number(form.get("authorId") || session.user.id);
    const coverImage = form.get("coverImage") as File | null;
    const heroCredit = form.get("heroCredit") ? String(form.get("heroCredit")) : null;

    const tagsJson = form.get("tags") as string | null;         // '["PM2.5","สิ่งแวดล้อม"]'
    const attachmentsJson = form.get("attachments") as string | null; // '[{label,url}]'

    if (!title.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });
    if (!description.trim()) return NextResponse.json({ error: "description required" }, { status: 400 });

    // สร้าง slug + โฟลเดอร์
    const slug = makeSlugFromTitle(title);
    const newsFolder = uuidv4();

    // จัดการ embedded images (base64) ใน contentHtml
    if (contentHtml) {
      const dom = new JSDOM(contentHtml);
      const document = dom.window.document;
      const imgs = Array.from(document.querySelectorAll("img"));
      for (const img of imgs) {
        const src = img.getAttribute("src") || "";
        if (src.startsWith("data:")) {
          const [meta, b64] = src.split(",");
          const mime = meta.match(/^data:(.*?);base64$/)?.[1] || "image/png";
          const ext = mime === "image/jpeg" ? "jpg" : mime === "image/gif" ? "gif" : "png";
          const filename = `${Date.now()}-${uuidv4()}.${ext}`;
          const buf = Buffer.from(b64, "base64");
          const url = await saveBufferUnder(buf, ["news", newsFolder, "content"], filename);
          img.setAttribute("src", `/api/uploads${url}`);
        }
      }
      contentHtml = document.body.innerHTML;
    }

    // ปก
    let coverUrl: string | null = null;
    if (coverImage && coverImage.size > 0) {
      const filename = `${Date.now()}-${coverImage.name}`;
      const buf = Buffer.from(await coverImage.arrayBuffer());
      coverUrl = await saveBufferUnder(buf, ["news", newsFolder, "cover"], filename);
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

    // tags & attachments
    const tagNames: string[] = tagsJson ? JSON.parse(tagsJson) : [];
    const attachments = attachmentsJson ? JSON.parse(attachmentsJson) : undefined;

    const created = await prisma.news.create({
      data: {
        title,
        slug,
        description,
        contentHtml: contentHtml || null,
        authorId,
        authorSnapshot,
        image: coverUrl,
        heroCredit,
        status: "PUBLISHED",     // หรือรับมาจากฟอร์ม
        publishedAt: new Date(), // หรือรับมาจากฟอร์ม
        attachments,
        tags: await connectOrCreateTags(tagNames),
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}