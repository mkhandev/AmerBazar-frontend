"use client";

import { useOrder } from "@/hooks/useOrder";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";

import FullPageLoader from "@/components/FullPageLoader";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import Link from "next/link";
import Charts from "@/app/admin/overview/chart";

const AdminOverviewPage = () => {
  const { orderSummery, isOrderSummeryLoading } = useOrder();

  if (isOrderSummeryLoading) return <FullPageLoader />;

  const orderData = orderSummery?.data;

  return (
    <div className="w-full p-6 bg-[var(--bg-inner)]">
      <h1 className="font-normal text-[22px] mb-5">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="text-green-800 bg-green-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(orderData?.grand_total?.toString() || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="text-blue-800 bg-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(orderData?.total_sales)}
            </div>
          </CardContent>
        </Card>

        <Card className="text-yellow-800 bg-yellow-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(orderData?.total_users)}
            </div>
          </CardContent>
        </Card>

        <Card className="text-pink-800 bg-pink-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(orderData?.products_count)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 mt-5 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Charts
              data={{
                salesData: orderData?.sales_data,
              }}
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BUYER</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>TOTAL</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData?.latest_sales.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name ? order.user.name : "Deleted User"}
                    </TableCell>
                    <TableCell>
                      {formatDateTime(order.created_at).dateOnly}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(Number(order.grand_total))}
                    </TableCell>
                    <TableCell>
                      <Link href={`/order/${order.order_number}`}>
                        <span className="px-2">Details</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
