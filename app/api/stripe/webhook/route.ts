import Stripe from "stripe";
import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/constants";
import { auth } from "@/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const login_session = await auth();
  const accessToken = login_session?.accessToken;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const order_id = paymentIntent.metadata?.order_id;
      console.log("Payment succeeded for order:", order_id);
      console.log("Payment succeeded for paymentIntent id:", paymentIntent.id);

      if (order_id) {
        try {
          await fetch(`${apiUrl}/orders/${order_id}/update-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              status: "paid",
              payment_intent_id: paymentIntent.id,
            }),
          });
        } catch (error) {
          console.error("Failed to update order: ", error);
        }
      }

      break;
    }

    // case "checkout.session.completed": {
    //   const session = event.data.object as Stripe.Checkout.Session;
    //   const order_id = session.metadata?.order_id;

    //   if (order_id) {
    //     try {
    //       await fetch(`${apiUrl}/orders/${order_id}/update-payment`, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Accept: "application/json",
    //           Authorization: `Bearer ${accessToken}`,
    //         },
    //         body: JSON.stringify({
    //           status: "paid",
    //           payment_intent_id: session.payment_intent,
    //         }),
    //       });
    //     } catch (error) {
    //       console.error("Failed to update order: ", error);
    //     }
    //   }

    //   break;
    // }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.warn("Payment failed:", paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
