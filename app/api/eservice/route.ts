// File: app/api/eservice/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // ดึงข้อมูล EService ทั้งหมด
    const eservices = await prisma.eService.findMany();
    return NextResponse.json(eservices, { status: 200 });
  } catch (error) {
    console.error("Error fetching EService:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to fetch EService", message: errorMessage },
      { status: 500 }
    );
  }
}
