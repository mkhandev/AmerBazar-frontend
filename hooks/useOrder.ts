//import { useToken } from "@/hooks/useToken";
import { useToken } from "@/hooks/useToken";
import { useQuery } from "@tanstack/react-query";

export function useOrder(orderId?: string) {
  const { getValidToken, status } = useToken();
  const token = getValidToken();

  const { data: orderDetails, isLoading: isOrderDetailsLoading } = useQuery({
    queryKey: ["order_details", orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();

      if (!res.ok) {
        if (!res.ok) throw new Error(data.message || "Failed to fetch order");
      }
      return data;
    },
    enabled: !!token, // run query only if token exists
  });

  return {
    orderDetails,
    isOrderDetailsLoading,
  };
}
