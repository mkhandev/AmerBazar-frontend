//hooks/useCart.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCart() {
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
        body: JSON.stringify({ product_id, quantity }),
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
      product_id,
      quantity,
    }: {
      product_id: number;
      quantity: number;
    }) => {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id, quantity }),
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
    mutationFn: async (product_id: number) => {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to remove item");
      }
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  return { cart, isLoading, addMutation, updateMutation, removeMutation };
}
