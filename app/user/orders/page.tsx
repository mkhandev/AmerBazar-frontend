"use client";

import OrderTable from "@/app/user/orders/OrderTable";
import FullPageLoader from "@/components/FullPageLoader";
import { useOrder } from "@/hooks/useOrder";

function OrderPage() {
  const { orders, isOrdersLoading } = useOrder();

  if (isOrdersLoading || !orders?.data) return <FullPageLoader />;
  const ordersData = orders.data.data;

  if (isOrdersLoading) return <FullPageLoader />;

  return (
    <div className="w-full p-6 bg-white min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <OrderTable orders={ordersData} />
    </div>
  );
}

export default OrderPage;
