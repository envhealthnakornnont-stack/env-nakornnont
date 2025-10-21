import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const excludeId = searchParams.get("excludeId") ?? undefined;

    const where = excludeId ? { NOT: { id: excludeId } } : {};
    const items = await prisma.carouselImage.findMany({
      where,
      select: { sortOrder: true },
    });

    const used = Array.from(new Set(items.map(i => i.sortOrder))).sort((a, b) => a - b);
    return NextResponse.json({ used }, { status: 200 });
  } catch (e) {
    console.error("orders API error:", e);
    return NextResponse.json({ error: "Failed to fetch used orders" }, { status: 500 });
  }
}