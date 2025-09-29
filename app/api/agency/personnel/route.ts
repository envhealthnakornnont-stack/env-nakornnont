import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {

    // ดึงข้อมูลบุคลากรจากฐานข้อมูล
    const personnel = await prisma.agencyPersonnel.findMany({
      select: {
        id: true,
        nameTitle: true,
        firstName: true,
        lastName: true,
        position: true,
        positionName: true,
        department: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(personnel, { status: 200 });
  } catch (error) {
    console.error("Error fetching agency personnel:", error);
    return NextResponse.json({ error: "Failed to fetch agency personnel" }, { status: 500 });
  }
}
