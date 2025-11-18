import { useToken } from "@/hooks/useToken";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

export function useOrder(
  order_number?: string,
  page: number = 1,
  filters: any = {}
) {
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
    isFetching,
    error,
  } = useQuery({
    queryKey: ["user_orders", page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.payment_status
          ? { payment_status: filters.payment_status }
          : {}),
        ...(filters.search ? { search: filters.search } : {}),
      });

      console.log(params.toString());

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch user order list");
      }

      return data;
    },
    enabled: !!token,
    // placeholderData just returns previous data to avoid flicker
    placeholderData: (prevData) => prevData,
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
    isFetching,
    markOrderPaidMutation,
    markOrderDeliveredMutation,
  };
}
