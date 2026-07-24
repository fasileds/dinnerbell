import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      email, 
      lat, 
      long, 
      restaurantName, 
      ownerIdNumber, 
      foodInspectionNumber,
      foodInspectionDate,
      foodInspectionImage,
      agreedToTerms,
      isAggent,
      nameOffAgnet
    } = body;

    console.log("Registration API called for:", email);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    console.log("Upserting user in DB:", email);
    
    // Use upsert to prevent race conditions when multiple requests hit this endpoint simultaneously
    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: {
        ...(restaurantName || ownerIdNumber || foodInspectionNumber ? {
          restaurantName,
          ownerIdNumber,
          foodInspectionNumber,
          foodInspectionDate,
          foodInspectionImage,
          agreedToTerms: !!agreedToTerms,
          isOwner: true,
          isAggent: !!isAggent,
          nameOffAgnet: nameOffAgnet || " ",
        } : {})
      },
      create: {
        email: email.toLowerCase(),
        latitude: lat || 0,
        longitude: long || 0,
        restaurantName,
        ownerIdNumber,
        foodInspectionNumber,
        foodInspectionDate,
        foodInspectionImage,
        agreedToTerms: !!agreedToTerms,
        isOwner: !!restaurantName,
        isAggent: !!isAggent,
        nameOffAgnet: nameOffAgnet || " ",
        customerId: " ",
      },
    });

    console.log("User successfully processed:", email);
    return NextResponse.json({ user, status: "success" });
  } catch (error: any) {
    console.error("CRITICAL REGISTRATION ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error.", details: error.message },
      { status: 500 }
    );
  }
}
