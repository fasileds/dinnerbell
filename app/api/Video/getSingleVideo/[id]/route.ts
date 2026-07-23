import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const singleVideo = await prisma.menu.findUnique({
      where: { id },
      include: {
        user: true,
        restorant: true,
      },
    });
    if (!singleVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    return NextResponse.json(singleVideo);
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the video" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
