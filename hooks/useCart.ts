//hooks/useCart.ts
"use client";

import { useToken } from "@/hooks/useToken";
import { ShippingInfo } from "@/types/cart";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCart() {
  const { getValidToken } = useToken();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart");

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch cart");
      }
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: userInfo, isLoading: isUserInfoLoading } = useQuery({
    queryKey: ["userinfo"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch user info");
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  const addMutation = useMutation({
    mutationFn: async ({
      product_id,
      quantity,
    }: {
      product_id: number;
      quantity: number;
    }) => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: Number(product_id),
          quantity: Number(quantity),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add item");
      }
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      item_id,
      quantity,
    }: {
      item_id: number;
      quantity: number;
    }) => {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: Number(item_id),
          quantity: Number(quantity),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update cart item");
      }
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (item_id: number) => {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to remove item");
      }
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const updateShippingMutation = useMutation({
    mutationFn: async (shippingData: {
      name: string;
      phone?: string;
      address: string;
      city: string;
      postal_code: string;
      country: string;
      payment_method: string;
    }) => {
      //console.log(shippingData);

      const res = await fetch("/api/cart/shipping", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shippingData),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to update shipping info");
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const placeOrderMutation = useMutation({
    mutationFn: async ({ cart_id }: { cart_id: number }) => {
      const token = getValidToken();
      if (!token) return;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart_id: Number(cart_id),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (!res.ok) throw new Error(data.message || "Failed to place order");
      }

      return data;
    },

    onSuccess: () => {
      // CLEAR CART CACHE WITHOUT API CALL
      queryClient.setQueryData(["cart"], null);
    },
  });

  return {
    cart,
    isLoading,
    addMutation,
    updateMutation,
    removeMutation,
    updateShippingMutation,
    userInfo,
    isUserInfoLoading,
    placeOrderMutation,
  };
}
