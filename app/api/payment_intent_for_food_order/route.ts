import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error(
    "Stripe secret key is not defined in the environment variables"
  );
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(req: Request) {
  try {
    const {
      amount,
      currency,
      customerId,
    }: { amount: number; currency: string; customerId: string } =
      await req.json();

    if (!amount || !currency || !customerId) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Create a payment intent for the existing customer
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId, // Attach the payment intent to the existing customer
    });

    console.log("Payment Intent created:", paymentIntent);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred." },
        { status: 500 }
      );
    }
  }
}
