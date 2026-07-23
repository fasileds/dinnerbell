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
    const { amount, currency }: { amount: number; currency: string } =
      await req.json();

    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Add 5% fee to the amount
    const totalAmount = Math.ceil(amount * 1.05); // Add 5% and round up to the nearest integer

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency,
    });

    console.log("Payment Intent:", paymentIntent);
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
