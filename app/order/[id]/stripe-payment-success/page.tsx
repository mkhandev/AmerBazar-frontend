"use server";
import { Button } from "@/components/ui/button";
import { SERVER_URL } from "@/lib/constants";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { use } from "react";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const SuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id: string }>;
}) => {
  const { id } = await props.params;
  const { session_id } = await props.searchParams;

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["payment_intent"],
  });

  const paymentIntent = session.payment_intent as Stripe.PaymentIntent;

  if (
    session?.metadata?.order_id == null ||
    session?.metadata?.order_number !== id.toString() // id is order_number
  ) {
    return notFound();
  }

  const isSuccess = paymentIntent.status === "succeeded";
  if (!isSuccess) return redirect(`/order/${id}`);

  /*

  if (!isSuccess) return redirect(`/order/${id}`);

  const cookieHeader = (await cookies()).toString();

  const res = await fetch(`${SERVER_URL}/api/orders/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    credentials: "include",
    cache: "no-store",
  });

  const data = await res.json();
  */

  return (
    <div className="w-full bg-white">
      <div className="flex flex-col gap-1 items-center justify-center h-[75vh]">
        <img src="/images/check.png" width={75} height={75} className="mb-5" />
        <h1 className="text-[23px] p-0 m-0">Thanks for your purchase</h1>
        <div className="text-[18px] mb-3">We are processing your order.</div>
        <Button
          asChild
          className="mt-5 min-w-[250px] bg-[#37a001] text-white py-5 hover:bg-green-700 transition rounded-1xl cursor-pointer flex items-center justify-center"
        >
          <Link href={`/order/${id}`}>View Order</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
