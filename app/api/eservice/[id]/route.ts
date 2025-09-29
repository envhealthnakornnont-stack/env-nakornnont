// File: app/api/eservice/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "SUPERUSER") {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    const { id } = await params;
    const eservice = await prisma.eService.findUnique({
      where: { id },
    });
    if (!eservice) {
      return NextResponse.json({ error: "EService not found" }, { status: 404 });
    }
    return NextResponse.json(eservice, { status: 200 });
  } catch (error) {
    console.error("Error fetching EService by id:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to fetch EService", message: errorMessage },
      { status: 500 }
    );
  }
}
