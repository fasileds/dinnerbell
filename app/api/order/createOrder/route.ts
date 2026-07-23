import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(req: Request) {
  const { menuId, location } = await req.json();
  if (!menuId || !location) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.order.create({
      data: {
        location: location,
        menu: {
          connect: {
            id: menuId,
          },
        },
      },
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Ordering error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
