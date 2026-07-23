import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(req: Request) {
  const { restorantName, description, streetAddress, city, state, zipCode } =
    await req.json();
  if (
    !restorantName ||
    !description ||
    !streetAddress ||
    !city ||
    !state ||
    !zipCode
  ) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.restorant.create({
      data: {
        restorantName: restorantName,
        description: description,
        streetAddress: streetAddress,
        city: city,
        state: state,
        zipCode: zipCode,
      },
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
