"use client";

import { use, useState } from "react";
import FullPageLoader from "@/components/FullPageLoader";
import { useOrder } from "@/hooks/useOrder";
import ProductPrice from "@/components/Product/ProductPrice";
import { shippingAmount, taxAmount } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { BadgeCheckIcon } from "lucide-react";
import StripePaymentPage from "@/app/order/[id]/StripePayment";

const OrderPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const { orderDetails, isOrderDetailsLoading } = useOrder(id);

  if (isOrderDetailsLoading || !orderDetails?.data) return <FullPageLoader />;

  const orderData = orderDetails.data;
  console.log(orderDetails);

  const shippingTotal = shippingAmount || 50;
  const taxTotal = taxAmount || 0;

  const subtotal = orderData?.items?.reduce(
    (acc: number, item: any) =>
      acc + Number(item.product.price) * item.quantity,
    0
  );

  const totalItems = orderData?.items.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  const grandTotal = subtotal + shippingTotal + taxTotal;

  return (
    <div className="grid grid-row md:grid-cols-8 ga-5 mt-5">
      <div className="md:col-span-6 mb-3">
        <div className="flex flex-row gap-3">
          <div className="flex-1 w-full bg-white p-5">
            <div className="pb-3 text-[18px]">Shipping Address</div>
            <p>
              Name:&nbsp;
              <span className="text-[#212121] text-[14px]">
                {orderData.shipping_name}
              </span>
            </p>
            <p>
              Phone:{" "}
              <span className="text-[#212121] text-[14px]">
                {orderData.shipping_phone}
              </span>
            </p>
            <p>
              Address:&nbsp;
              <span className="text-[#212121] text-[14px]">
                {orderData.shipping_address}, {orderData.shipping_city}{" "}
                {orderData.shipping_postal_code},{orderData.shipping_country}
              </span>
            </p>

            <div className="mt-1">
              {orderData.status === "pending" ? (
                <Badge variant="destructive">{orderData.payment_status}</Badge>
              ) : orderData.status === "processing" ? (
                <Badge variant="destructive">{orderData.payment_status}</Badge>
              ) : orderData.status === "completed" ? (
                <Badge
                  variant="secondary"
                  className="bg-blue-500 text-white dark:bg-blue-600"
                >
                  <BadgeCheckIcon />
                  {orderData.payment_status}
                </Badge>
              ) : (
                <Badge variant="destructive">{orderData.payment_status}</Badge>
              )}
            </div>
          </div>

          <div className="flex-1 bg-white p-5">
            <div className="pb-3 text-[18px]">Payment Method</div>
            <p className="text-[#37a001]">
              {orderData.payment_method == "cod"
                ? "Cash on delivery"
                : "Stripe"}
            </p>
            <p className="mt-1">
              {orderData.payment_status == "paid" ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(orderData.updated_at!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">{orderData.payment_status}</Badge>
              )}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="p-3 pb-2 text-[18px] bg-white">Order Items</div>

          {orderData.items.map((item: any) => {
            const imageUrl =
              item.product.images.length > 0
                ? item.product.images[0].image
                : "/images/placeholder2.jpg";

            return (
              <div
                className="flex flex-col md:flex-row justify-between p-3 bg-white shadow-sm gap-3 mb-3 last:mb-0"
                key={item.id}
              >
                <div className="flex-none w-full md:max-w-[110px]">
                  <img
                    src={imageUrl}
                    alt={item.product.name}
                    className="object-center object-cover md:w-[100] md:h-auto md:max-h[73px]"
                  />
                </div>

                <div className="flex-1 md:col-span-3 flex gap-3 flex-col md:flex-row items-center justify-center">
                  <div className="flex-1">
                    <div className="text-[#212121] text-[18px] mb-2">
                      {item.product.name}
                    </div>
                    <div className="text-[#757575] text-[14px] mb-1">
                      {item.product.brand ?? "No brand"}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3 sm:flex-row items-center">
                    <ProductPrice
                      value={Number(item.product.price)}
                      className="w-25 text-[18px] px-5 py-2 bg-[#37a001] text-white rounded-full"
                    />
                  </div>

                  <div className="flex-1 text-[18px]">
                    <span className="text-muted-foreground text-sm">Qty:</span>{" "}
                    {item.quantity}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-2  md:ml-5">
        <div className="p-5 bg-white shadow-sm">
          <div className="text-[14px]">
            <h2 className="text-xl font-normal mb-4 text-[#212121] text-[18px]">
              Order Summary
            </h2>
            <div className="flex justify-between mb-2 text-[#757575]">
              <span className="text-[#212121]">
                Items Total ({totalItems} items)
              </span>
              <span className="text-[16px] text-[#202020]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#212121]">Delivery Fee</span>
              <span className="text-[16px] text-[#202020]">
                ${shippingTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#212121]">Tax</span>
              <span className="text-[16px] text-[#202020]">
                ${taxTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mt-3 border-t pt-3">
              <span className="text-[#202020]">Grand Total</span>
              <span className="text-[#37a001] text-[18px]">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <StripePaymentPage orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
