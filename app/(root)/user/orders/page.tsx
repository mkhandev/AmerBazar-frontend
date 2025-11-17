"use client";

import OrderTable from "./OrderTable";
import FullPageLoader from "@/components/FullPageLoader";
import { useOrder } from "@/hooks/useOrder";

function OrderPage() {
  const { orders, isOrdersLoading } = useOrder();

  if (isOrdersLoading || !orders?.data) return <FullPageLoader />;
  const ordersData = orders.data.data;

  if (isOrdersLoading) return <FullPageLoader />;

  return (
    <div className="w-full p-6 min-h-[60vh]  bg-[var(--bg-inner)]">
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
      <OrderTable orders={ordersData} />
    </div>
  );
}

export default OrderPage;
