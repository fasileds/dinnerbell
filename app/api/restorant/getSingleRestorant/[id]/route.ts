import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Extract the ID from the URL parameters

  if (!id) {
    console.log("No ID is provided from the front end.");
    return NextResponse.json({ error: "ID is required." }, { status: 400 });
  }

  try {
    const user = await prisma.restorant.findFirst({
      where: {
        id: id, // Ensure the ID is treated as a string
      },
    });

    if (!user) {
      console.log("no restorant founde");
      return NextResponse.json(
        { error: "Restaurant not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
