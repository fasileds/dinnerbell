import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { restaurantName } = await req.json();

  if (!restaurantName) {
    return NextResponse.json({ error: "Restaurant name is required." }, { status: 400 });
  }

  return NextResponse.json({
    status: "passed",
    message: "Verification skipped.",
  });
}
