"use server";

import Link from "next/link";

export default async function CancelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full max-w-4xl mx-auto text-center py-20 space-y-6 h-[70vh]">
      <h1 className="text-2xl font-bold text-red-600">❌ Payment Cancelled</h1>
      <p className="text-lg text-gray-700">
        Your payment for order <strong>{id}</strong> was not completed.
      </p>
      <p className="text-gray-600">
        You can retry the payment or review your order details.
      </p>

      <div className="space-x-4 text-center m-auto  max-w-[250px]">
        <Link
          href={`/order/${id}`}
          className="mt-5 bg-[#37a001] text-white py-4 hover:bg-green-700 transition rounded-1xl cursor-pointer flex items-center justify-center"
        >
          View Order
        </Link>
      </div>
    </div>
  );
}
