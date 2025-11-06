"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import ProductPrice from "@/components/Product/ProductPrice";
import Rating from "@/components/Product/Rating";
import { useState } from "react";
import Image from "next/image";

const CartPage = () => {
  const { cart, isLoading, updateMutation, removeMutation } = useCart();
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  const handleIncrement = (product_id: number, currentQty: number) => {
    if (currentQty >= 5) return; // max limit
    setUpdatingItemId(product_id);
    updateMutation.mutate(
      { product_id, quantity: Number(currentQty) + 1 },
      {
        onSettled: () => setUpdatingItemId(null), // clear loader
      }
    );
  };

  const handleDecrement = (product_id: number, currentQty: number) => {
    if (currentQty <= 1) return; // min limit
    setUpdatingItemId(product_id);
    updateMutation.mutate(
      { product_id, quantity: Number(currentQty) - 1 },
      {
        onSettled: () => setUpdatingItemId(null),
      }
    );
  };

  const handleRemove = (cart_id: number) => {
    setUpdatingItemId(cart_id);
    removeMutation.mutate(cart_id, {
      onSettled: () => setUpdatingItemId(null),
    });
  };

  // Full-page loader
  if (isLoading) {
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

  // --- Cart Summary Calculations ---
  const subtotal = cart.data.reduce(
    (acc: number, item: any) => acc + Number(item.item_price) * item.quantity,
    0
  );
  const shippingTotal = 50.0;
  const taxTotal = 0;
  const grandTotal = subtotal + shippingTotal + taxTotal;

  return (
    <>
      {!cart || !cart.data || cart.data.length === 0 ? (
        <div className="flex justify-center items-center h-[70vh]">
          <div className="text-[22px] text-[#212121]">
            Cart is empty. &nbsp;
          </div>
          <Link className="text-[22px] text-[#37a001] font-bold" href="/">
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-col-1 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 mt-5 min-h-[70vh]">
          <div className="lg:col-span-3 xl:col-span-4">
            {cart.data.map((item: any) => {
              return (
                <div
                  className="flex flex-col md:flex-row justify-between p-3 bg-white shadow-sm gap-3 mb-3 last:mb-0"
                  key={item.id}
                >
                  {/* Product Image */}
                  <div className="flex-none w-full md:max-w-[150px] lg:max-w-[200px]">
                    <img
                      src={item.product.images[0].image}
                      alt={item.product.name}
                      className="object-center object-cover md:w-[200] md:h-auto"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 md:col-span-4 flex gap-3 flex-col md:flex-row items-center md:items-stretch">
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="text-[#212121] text-[18px] mb-2"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-[#757575] text-[14px] mb-1">
                        {item.product.brand ?? "No brand"}
                      </div>

                      {item?.product.rating ? (
                        <div className="flex flex-row gap-1 items-center mb-2 text-[13px]">
                          <Rating value={Number(item.product.rating)} />
                          <div>|</div>
                          <div>Ratings</div>
                          <div>{item.product.num_reviews}</div>
                        </div>
                      ) : (
                        <div className="text-[14px]">No Ratings</div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex-1 flex flex-col gap-3 sm:flex-row items-center">
                      <ProductPrice
                        value={Number(item.product.price)}
                        className="w-25 text-[18px] px-5 py-2 bg-[#37a001] text-white rounded-full"
                      />
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-3 border rounded-full px-3 py-1">
                        <button
                          onClick={() =>
                            handleDecrement(item.product_id, item.quantity)
                          }
                          disabled={
                            updateMutation.isPending ||
                            updatingItemId === item.product_id ||
                            item.quantity <= 1
                          }
                          className={`text-xl font-bold px-2 ${
                            item.quantity <= 1
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          -
                        </button>

                        {updatingItemId === item.product_id ? (
                          <div className="h-5 w-5 border-2 border-[#37a001] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span className="w-6 text-center">
                            {item.quantity}
                          </span>
                        )}

                        <button
                          onClick={() =>
                            handleIncrement(item.product_id, item.quantity)
                          }
                          disabled={
                            updateMutation.isPending ||
                            updatingItemId === item.product_id ||
                            item.quantity >= 5
                          }
                          className={`text-xl font-bold px-2 ${
                            item.quantity >= 5
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="flex-1 flex justify-center items-center">
                      <button
                        onClick={() => handleRemove(item.id)} // use cart id
                        disabled={updatingItemId === item.id}
                        className={`bg-red-100 text-red-600 text-[15px] px-2 py-1 rounded ${
                          updatingItemId === item.id
                            ? "opacity-50 cursor-not-allowed bg-transparent"
                            : "cursor-pointer"
                        }`}
                      >
                        {updatingItemId === item.id ? (
                          <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "Remove"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- Cart Summary --- */}
          <div className="p-5 bg-white shadow-sm text-[14px]">
            <h2 className="text-xl font-normal mb-4 text-[#212121] text-[18px]">
              Order Summary
            </h2>
            <div className="flex justify-between mb-2 text-[#757575]">
              <span className="text-[#212121]">Subtotal</span>
              <span className="text-[16px] text-[#202020]">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#212121]">Shipping</span>
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

            <button className="mt-5 w-full bg-[#37a001] text-white py-3 hover:bg-green-700 transition rounded-1xl cursor-pointer">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CartPage;
