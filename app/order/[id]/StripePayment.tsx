"use client";

import { shippingAmount } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import React, { useState } from "react";

const StripePayment = ({ orderData }: { orderData: any }) => {
  const [isPaying, setIsPaying] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsPaying(true);
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_data: orderData }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        console.error("Stripe URL not found:", data);
        setIsPaying(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsPaying(false);
    }
  };

  const shippingTotal = shippingAmount || 50;
  const taxTotal = 0;

  const subtotal = orderData?.items?.reduce(
    (acc: number, item: any) =>
      acc + Number(item.product.price) * item.quantity,
    0
  );

  const grandTotal = subtotal + shippingTotal + taxTotal;

  return (
    <>
      <button
        onClick={handleCheckout}
        disabled={isPaying}
        className={`mt-5 w-full min-w-[250px] bg-[#37a001] text-white py-3
           hover:bg-green-900 transition rounded-1xl cursor-pointer flex items-center justify-center ${
             isPaying
               ? "cursor-not-allowed opacity-75"
               : "cursor-pointer opacity-100"
           }`}
      >
        {isPaying ? "Purchasing..." : `Purchase ${formatCurrency(grandTotal)}`}
      </button>
    </>
  );
};

export default StripePayment;
