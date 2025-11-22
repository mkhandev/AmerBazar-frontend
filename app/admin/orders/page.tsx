"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import FullPageLoader from "@/components/FullPageLoader";
import { useOrder } from "@/hooks/useOrder";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";

function AdminOrderPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [order_number, setOrderNumber] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const { orders, isOrdersLoading, isFetching } = useOrder(undefined, page, {
    status,
    payment_status: paymentStatus,
    payment_method: paymentMethod,
    order_number: order_number,
  });

  const ordersData = orders?.data?.data ?? [];
  const currentPage = orders?.data?.current_page ?? 1;
  const lastPage = orders?.data?.last_page ?? 1;

  const columnHelper = createColumnHelper<any>();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", { header: "Id" }),
      columnHelper.accessor("order_number", {
        header: "Order Id",
        cell: (info) => (
          <Link
            href={`/order/${info.getValue()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#37a001] hover:underline text-left"
          >
            {info.getValue()}
          </Link>
        ),
      }),
      columnHelper.accessor("status", { header: "Order Status" }),
      columnHelper.accessor("payment_status", { header: "Payment Status" }),
      columnHelper.accessor("payment_method", {
        header: "Payment Method",
        cell: (info) => {
          const { payment_method } = info.row.original;
          if (payment_method === "cod")
            return (
              <span className="font-semibold text-yellow-600">
                Cash on Delivery
              </span>
            );
          if (payment_method === "stripe")
            return <span className="font-semibold text-blue-600">Stripe</span>;
          return <span className="text-green-600">{info.getValue()}</span>;
        },
      }),
      columnHelper.accessor("grand_total", {
        header: "Total Amount",
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.display({
        id: "actions",
        header: "Action",
        cell: (info) => (
          <Link
            href={`/order/${info.row.original.order_number}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-3 py-1 text-white bg-[#37a001] rounded hover:font-semibold">
              View
            </button>
          </Link>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: ordersData,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isOrdersLoading) return <FullPageLoader />;

  return (
    <div className="w-full p-6 min-h-[60vh] bg-[var(--bg-inner)] relative">
      <h1 className="mb-6 text-[20px] font-semibold">Order List</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search Order ID..."
          value={order_number}
          onChange={(e) => {
            setPage(1);
            setOrderNumber(e.target.value);
          }}
          className="w-full px-3 py-2 border rounded sm:w-48"
        />
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="w-full px-3 py-2 border rounded sm:w-48"
        >
          <option value="">Order Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
        <select
          value={paymentStatus}
          onChange={(e) => {
            setPage(1);
            setPaymentStatus(e.target.value);
          }}
          className="w-full px-3 py-2 border rounded sm:w-48"
        >
          <option value="">Payment status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={paymentMethod}
          onChange={(e) => {
            setPage(1);
            setPaymentMethod(e.target.value);
          }}
          className="w-full px-3 py-2 border rounded sm:w-48"
        >
          <option value="">Payment method</option>
          <option value="cod">Cash on Delivery</option>
          <option value="stripe">Stripe</option>
        </select>
      </div>

      {/* Table */}
      <div className="relative p-4 overflow-x-auto">
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
            <span className="text-lg font-semibold text-[#37a001]">
              Loading...
            </span>
          </div>
        )}

        <table className="min-w-full border">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  return (
                    <th
                      key={`${headerGroup.id}-${header.id}`}
                      className={`px-3 py-2 border cursor-pointer select-none
                      ${
                        header.column.getIsSorted()
                          ? "bg-gray-200 font-semibold"
                          : "bg-gray-100"
                      } 
                      ${
                        header.column.id === "order_number"
                          ? "text-left"
                          : "text-center"
                      }
                    `}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc"
                          ? "▲"
                          : header.column.getIsSorted() === "desc"
                          ? "▼"
                          : ""}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getVisibleFlatColumns().length}
                  className="px-3 py-6 italic text-center text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={`${row.id}-${cell.column.id}`}
                      className={`px-3 py-2 border ${
                        cell.column.id === "order_number"
                          ? "text-left"
                          : "text-center"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center gap-3 mt-6 sm:flex-row">
        <button
          disabled={currentPage === 1 || isFetching}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2 border rounded">
          Page {currentPage} / {lastPage}
        </span>
        <button
          disabled={currentPage === lastPage || isFetching}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminOrderPage;
