"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

interface Order {
  id: number;
  order_number: string;
  grand_total: string;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export default function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <div className="border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Delivered</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.order_number}
                </TableCell>
                <TableCell className="capitalize">{order.status}</TableCell>
                <TableCell className="capitalize">
                  {order.payment_method} ({order.payment_status})
                </TableCell>
                <TableCell>$ {order.grand_total}</TableCell>
                <TableCell>
                  {formatDateTime(order.updated_at!).dateTime}
                </TableCell>
                <TableCell>
                  <Link href={`/order/${order.order_number}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
