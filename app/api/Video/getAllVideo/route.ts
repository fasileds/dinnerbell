import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }
    const menuItem = await prisma.menu.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        restorant: true,
      },
    });
    return NextResponse.json({ menuItem });
  } catch (error) {
    console.error("Error fetching menu items by user ID:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
