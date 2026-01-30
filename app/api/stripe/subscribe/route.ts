import { NextResponse } from "next/server";
import { stripe, STRIPE_PRICE_ID } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body as { email?: string };

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  if (!STRIPE_PRICE_ID) {
    return NextResponse.json({ error: "Missing Stripe price id" }, { status: 500 });
  }

  const customer = await stripe.customers.create({ email });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: STRIPE_PRICE_ID }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  });

  const paymentIntent = subscription.latest_invoice?.payment_intent;

  if (!paymentIntent || typeof paymentIntent === "string") {
    return NextResponse.json({ error: "Missing payment intent" }, { status: 500 });
  }

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    customerId: customer.id,
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
  });
}
