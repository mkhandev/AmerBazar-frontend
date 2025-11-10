"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/useCart";
import { shippingAddressDefaultValues, shippingAmount } from "@/lib/constants";
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ShippingAddressPage = () => {
  const {
    cart,
    isLoading,
    userInfo,
    isUserInfoLoading,
    updateShippingMutation,
  } = useCart();
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      city: "",
      postal_code: "",
      country: "",
      payment_method: "cod",
    },
  });

  // Update form values when userInfo loads
  useEffect(() => {
    if (userInfo) {
      form.reset({
        name: userInfo.name ?? "",
        phone: userInfo.phone ?? "",
        address: userInfo.address ?? "",
        city: userInfo.city ?? "",
        postal_code: userInfo.postal_code ?? "",
        country: userInfo.country ?? "",
        payment_method: userInfo.payment_method ?? "cod",
      });
    }
  }, [userInfo, form]);

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values
  ) => {
    updateShippingMutation.mutate(values, {
      onSuccess: () => {
        router.push("/place-order");
      },
      onError: (error: any) => {
        toast.warning(error?.message || "Failed to update shipping info");
      },
    });
  };

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
    <div className="grid grid-cols-8 ga-5 mt-5">
      <div className="col-span-6">
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="w-full bg-white p-5">
                <h1 className="h2-bold">Shipping Address</h1>
                <p className="text-sm text-muted-foreground mb-5">
                  Please enter shipping address info
                </p>

                <div className="flex flex-row gap-5 mb-3">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xs"
                              placeholder="Enter full name"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xs"
                              placeholder="Enter phone"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-5 mb-3">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              className="rounded-xs min-h-[38px]"
                              placeholder="House, Road, Area, District..."
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xs"
                              placeholder="Enter city"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-5 mb-3">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Post code</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xs"
                              placeholder="Enter post code"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input
                              className="rounded-xs"
                              placeholder="Enter country"
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full bg-white p-5 mt-5 ">
                <h1 className="font-normal text-[17px] mb-3">Payment Method</h1>

                <div className="mb-2">
                  <FormField
                    control={form.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col"
                        >
                          <FormItem className="flex items-center space-x-1">
                            <FormControl>
                              <RadioGroupItem value="cod" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              CashOnDelivery
                            </FormLabel>
                          </FormItem>

                          <FormItem className="flex items-center space-x-1">
                            <FormControl>
                              <RadioGroupItem value="stripe" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Stripe
                            </FormLabel>
                          </FormItem>
                          <FormMessage />
                        </RadioGroup>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updateShippingMutation.isPending}
                    className="mt-5 min-w-[250px] bg-[#37a001] text-white py-3 hover:bg-green-700 transition rounded-1xl cursor-pointer flex items-center justify-center"
                  >
                    {updateShippingMutation.isPending ? (
                      <Spinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    &nbsp; Continue
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <div className="col-span-2 ml-5">
        <div className="p-5 bg-white shadow-sm text-[14px]">
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
      </div>
    </div>
  );
};

export default ShippingAddressPage;
