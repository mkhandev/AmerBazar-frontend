import { useToken } from "@/hooks/useToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useOrder(order_number?: string) {
  const { getValidToken, status } = useToken();
  const token = getValidToken();
  const queryClient = useQueryClient();

  const { data: orderDetails, isLoading: isOrderDetailsLoading } = useQuery({
    queryKey: ["order_details", order_number],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${order_number}`);
      const data = await res.json();

      if (!res.ok) {
        if (!res.ok) throw new Error(data.message || "Failed to fetch order");
      }
      return data;
    },
    enabled: !!token && !!order_number, // run query only if token exists
  });

  const {
    data: orders,
    isLoading: isOrdersLoading,
    error,
  } = useQuery({
    queryKey: ["user_orders"],
    queryFn: async () => {
      const res = await fetch(`/api/orders`);
      const data = await res.json();

      if (!res.ok) {
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch user order list");
      }
      return data;
    },
    enabled: !!token,
  });

  const markOrderPaidMutation = useMutation({
    mutationFn: async ({
      id,
      order_number,
    }: {
      id: number;
      order_number: string;
    }) => {
      const res = await fetch(`/api/orders/${id}/admin-mark-order-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        if (!res.ok)
          throw new Error(data.message || "Failed to mark order paid");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["order_details", order_number],
      });
    },
  });

  const markOrderDeliveredMutation = useMutation({
    mutationFn: async ({
      id,
      order_number,
    }: {
      id: number;
      order_number: string;
    }) => {
      const res = await fetch(`/api/orders/${id}/admin-mark-order-delivered`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        if (!res.ok)
          throw new Error(data.message || "Failed to mark order delivered");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["order_details", order_number],
      });
    },
  });

  return {
    orderDetails,
    isOrderDetailsLoading,
    orders,
    isOrdersLoading,
    markOrderPaidMutation,
    markOrderDeliveredMutation,
  };
}
