import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import path from "path";
import fs from "fs";
import { toRealPath } from "@/lib/uploads";
import { JSDOM } from "jsdom";

function extractApiUploadSrcs(html: string | null | undefined) {
  if (!html) return [] as string[];
  const dom = new JSDOM(html);
  return Array.from(dom.window.document.querySelectorAll("img"))
    .map((img) => img.getAttribute("src") || "")
    .filter((src) => src.startsWith("/api/uploads/"));
}

function inferActivityFolderFromCover(url: string | null | undefined) {
  if (!url) return "";
  const parts = url.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => p === "activities");
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  return "";
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const role = session.user.role?.toUpperCase();
    if (role !== "SUPERUSER" && existing.authorId !== Number(session.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await prisma.activity.delete({ where: { id } });

    const folder = inferActivityFolderFromCover(deleted.image);
    if (folder) {
      const absFolder = path.join(process.cwd(), "uploads", "activities", folder);
      if (fs.existsSync(absFolder)) {
        try { fs.rmSync(absFolder, { recursive: true, force: true }); } catch { }
      }
    } else {
      const srcs = extractApiUploadSrcs(deleted.contentHtml ?? null);
      for (const s of srcs) {
        const abs = toRealPath(s);
        if (abs && fs.existsSync(abs)) {
          try { fs.unlinkSync(abs); } catch { }
        }
      }
    }

    return NextResponse.json({ message: "Deleted", item: deleted }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}