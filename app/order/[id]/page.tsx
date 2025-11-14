"use client";

import { use, useState, useTransition } from "react";
import FullPageLoader from "@/components/FullPageLoader";
import { useOrder } from "@/hooks/useOrder";
import ProductPrice from "@/components/Product/ProductPrice";
import { shippingAmount, taxAmount } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { BadgeCheckIcon, Check } from "lucide-react";
import StripePaymentPage from "@/app/order/[id]/StripePayment";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const OrderPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    orderDetails,
    isOrderDetailsLoading,
    markOrderPaidMutation,
    markOrderDeliveredMutation,
  } = useOrder(id);

  if (isOrderDetailsLoading || !orderDetails?.data) return <FullPageLoader />;

  const orderData = orderDetails.data;

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

  const handleMarkOrderPaid = () => {
    markOrderPaidMutation.mutate(
      { id: orderData.id, order_number: orderData.order_number },
      {
        onSuccess: (res) => {
          toast(res.message);
        },
        onError: (error: any) =>
          toast.warning(error?.message || "Something went wrong"),
      }
    );
  };

  const handleMarkOrderDelivered = () => {
    markOrderDeliveredMutation.mutate(
      { id: orderData.id, order_number: orderData.order_number },
      {
        onSuccess: (res) => {
          toast(res.message);
        },
        onError: (error: any) =>
          toast.warning(error?.message || "Something went wrong"),
      }
    );
  };

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
                <Badge variant="destructive">{orderData.status}</Badge>
              ) : orderData.status === "processing" ? (
                <Badge variant="secondary" className="bg-[#37a001] text-white">
                  {orderData.status}
                </Badge>
              ) : orderData.status === "completed" ? (
                <Badge variant="secondary" className="bg-[#37a001] text-white">
                  <BadgeCheckIcon /> Delivered at
                  {formatDateTime(orderData.updated_at!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">{orderData.status}</Badge>
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
                <Badge variant="secondary" className="bg-[#37a001] text-white">
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

          {orderData.payment_status != "paid" &&
            orderData.payment_method == "stripe" && (
              <StripePaymentPage orderData={orderData} />
            )}

          <div>{orderData.payment_status}</div>
          <div>{orderData.payment_status}</div>

          {session?.user?.role == "admin" &&
            orderData.payment_status != "paid" &&
            orderData.payment_method == "cod" && (
              <button
                onClick={handleMarkOrderPaid}
                disabled={markOrderPaidMutation.isPending}
                className="mt-5 w-full min-w-[250px] bg-[#37a001] text-white py-3 hover:bg-green-900 transition rounded-1xl cursor-pointer flex items-center justify-center"
              >
                {markOrderPaidMutation.isPending ? (
                  <Spinner className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                &nbsp; Mark As Order Paid
              </button>
            )}

          {session?.user?.role == "admin" &&
            orderData.payment_status == "paid" &&
            orderData.status != "completed" && (
              <button
                onClick={handleMarkOrderDelivered}
                disabled={markOrderDeliveredMutation.isPending}
                className="mt-5 w-full min-w-[250px] bg-[#37a001] text-white py-3 hover:bg-green-900 transition rounded-1xl cursor-pointer flex items-center justify-center"
              >
                {markOrderDeliveredMutation.isPending ? (
                  <Spinner className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                &nbsp; Mark As Order Delivered
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
