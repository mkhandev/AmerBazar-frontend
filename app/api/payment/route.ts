import Stripe from "stripe";
import { NextResponse } from "next/server";
import { SERVER_URL, shippingAmount } from "@/lib/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { order_data } = await req.json();

    const lineItems = [
      ...order_data.items.map((item: any) => {
        const product = item.product;
        const imageUrls =
          product.images
            ?.filter((img: any) => img.is_main)
            .map((img: any) => img.image) || [];

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
              images: imageUrls.length ? [imageUrls[0]] : [],
            },
            unit_amount: Math.round(parseFloat(product.price) * 100), // Stripe amount in cents
          },
          quantity: item.quantity,
        };
      }),
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping Fee",
            description: "Delivery / shipping cost",
          },
          unit_amount: Math.round(shippingAmount * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      payment_intent_data: {
        metadata: {
          //payment_intent.succeeded webhook.
          order_id: order_data.id,
          user_id: order_data.user_id,
          order_number: order_data.order_number,
        },
      },
      metadata: {
        //checkout.session.completed webhook.
        order_id: order_data.id,
        user_id: order_data.user_id,
        order_number: order_data.order_number,
      },
      success_url: `${SERVER_URL}/order/${order_data.order_number}/stripe-payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SERVER_URL}/order/${order_data.order_number}/stripe-payment-cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
