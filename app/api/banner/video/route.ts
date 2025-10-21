import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.carouselImage.findMany({
      where: { isActive: true },
      orderBy: [
        { priority: "desc" },
        { sortOrder: "asc" },
        { publishedAt: "desc" },
      ],
      take: 6,
    });

    const slides = items.map((x) => ({
      id: x.id,
      title: x.title,
      href: x.href,
      sortOrder: x.sortOrder,
      priority: x.priority,
      isActive: x.isActive,
      imageDesktop: x.imageDesktop,
      imageMobile: x.imageMobile,
      alt: x.title,
      badge: x.badge ?? null,
      updatedAt: x.updatedAt,
    }));

    return NextResponse.json(slides, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600", }, status: 200 });
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to fetch carousel images", message: errorMessage },
      { status: 500 }
    );
  }
}
