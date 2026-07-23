import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  try {
    console.log("Received email:", email);

    // Ensure the base URL is available
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error(
        "Base URL is not defined. Please check your environment variables."
      );
    }

    // Create a Stripe Express Account for the user
    const account = await stripe.accounts.create({
      type: "express", // or 'standard' or 'custom' depending on your needs
    });

    console.log("Stripe Account created:", account.id);

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      // If the user exists, update the customerId with the Stripe account ID
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: {
          customerId: account.id, // Update with the Stripe account ID
        },
      });

      console.log("User updated:", updatedUser);
    } else {
      // If the user does not exist, create a new user and associate with the Stripe account ID
      const newUser = await prisma.user.create({
        data: {
          email: email,
          customerId: account.id, // Store the Stripe account ID in the database
        },
      });

      console.log("New user created:", newUser);
    }

    // Create a Setup Intent for the customer (optional if needed)
    const setupIntent = await stripe.setupIntents.create({
      customer: account.id, // Associate with the new Stripe account
    });

    console.log("Setup Intent created:", setupIntent.client_secret);

    // Create a Stripe Checkout Session for setting up the payment method
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      payment_method_types: ["card"],
      customer: account.id, // Use the Stripe account's ID for the session
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("Error creating Checkout Session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
