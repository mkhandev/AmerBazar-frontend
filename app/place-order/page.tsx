"use client";

import ProductPrice from "@/components/Product/ProductPrice";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCart } from "@/hooks/useCart";
import { shippingAmount } from "@/lib/constants";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React from "react";
import { toast } from "sonner";

const PlaceOrderPage = () => {
  const router = useRouter();
  const { cart, isLoading, userInfo, isUserInfoLoading, placeOrderMutation } =
    useCart();

  if (isLoading || !cart || !userInfo) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#37a001] border-solid"></div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="p-6 text-center text-gray-500">No items in your cart</div>
    );
  }

  const handlePlaceOrder = () => {
    if (!cart || !userInfo) return;

    placeOrderMutation.mutate(
      { cart_id: cart.data.id },
      {
        onSuccess: (res) => {
          console.log("ORDER RESPONSE:", res);
          router.push(`/order/${res.data.order_number}`);
        },
        onError: (error: any) =>
          toast.warning(error?.message || "Something went wrong"),
      }
    );
  };

  const shippingTotal = shippingAmount || 50;
  const taxTotal = 0;

  const subtotal = cart.data?.items?.reduce(
    (acc: number, item: any) =>
      acc + Number(item.product.price) * item.quantity,
    0
  );

  const totalItems = cart?.data?.items.reduce(
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
            <p>{userInfo.name}</p>
            <p>
              {userInfo.address}, {userInfo.city} {userInfo.postal_code},
              {userInfo.country}
            </p>
            <div className="mt-3">
              <Link href="/shipping-address">
                <Button variant="outline">Edit</Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 bg-white p-5">
            <div className="pb-3 text-[18px]">Payment Method</div>
            <p>{userInfo.payment_method}</p>
            <div className="mt-3">
              <Link href="/shipping-address">
                <Button variant="outline">Edit</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="p-3 pb-2 text-[18px] mb-[5px] bg-white">
            Order Items
          </div>

          {cart.data.items.map((item: any) => {
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

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placeOrderMutation.isPending}
              className="mt-5 w-full bg-[#37a001] text-white py-3 hover:bg-green-700 transition rounded-1xl cursor-pointer flex items-center justify-center"
            >
              {placeOrderMutation.isPending ? (
                <Spinner className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              &nbsp; Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
