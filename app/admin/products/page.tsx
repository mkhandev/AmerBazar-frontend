"use client";

import FullPageLoader from "@/components/FullPageLoader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProduct } from "@/hooks/useProduct";
import { formatCurrency } from "@/lib/utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, CirclePlus, Ghost } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ProductPage = () => {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [status, setStatus] = useState(1);
  const [q, setSearch] = useState("");

  const { productList, isLoadingProductList, isProductListFetching } =
    useProduct(undefined, page, { status, q });

  const productData = productList?.data ?? [];
  const currentPage = productList?.current_page ?? 1;
  const lastPage = productList?.last_page ?? 1;
  const productFrom = productList?.from;
  const productTo = productList?.to;
  const productTotal = productList?.total;

  console.log(productList);

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("price", {
      header: (ctx) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              ctx.column.toggleSorting(ctx.column.getIsSorted() === "asc")
            }
          >
            Price
            <ArrowUpDown />
          </Button>
        );
      },
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("stock", {
      header: (ctx) => {
        return (
          <Button
            variant="ghost"
            className="text-center"
            onClick={() =>
              ctx.column.toggleSorting(ctx.column.getIsSorted() === "asc")
            }
          >
            Stock
            <ArrowUpDown />
          </Button>
        );
      },
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("brand", { header: "Brand" }),
    columnHelper.accessor("num_reviews", { header: "Reviews" }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const { status } = info.row.original;

        if (status === 1)
          return <span className="font-semibold text-[#37a001]">Active</span>;
        if (status === 0) {
          return <span className="font-semibold text-red-700">Inactive</span>;
        }
      },
    }),
  ];

  const table = useReactTable({
    columns,
    data: productData,
    state: { sorting },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoadingProductList) return <FullPageLoader />;

  return (
    <div className="w-full p-6 bg-[var(--bg-inner)]">
      <div className="flex justify-between">
        <h1 className="font-normal text-[22px] mb-5">Product list</h1>
        <div>
          <Link
            href="/admin/products/add"
            className="flex flex-row gap-2 text-[20px] text-[#37a001] justify-center"
          >
            <CirclePlus />
            Product Add
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Product Name..."
          value={q}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full px-3 py-2 border rounded sm:w-48"
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(Number(e.target.value));
          }}
          className="w-full px-3 py-2 border rounded sm:w-48"
        >
          <option value="">Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>

      <div className="relative overflow-hidden border rounded-md">
        {isProductListFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
            <span className="text-lg font-semibold text-[#37a001]">
              Loading...
            </span>
          </div>
        )}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`border ${
                        header.column.id === "id" ||
                        header.column.id === "price" ||
                        header.column.id === "stock"
                          ? "text-center"
                          : "text-left"
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`border ${
                        cell.column.id === "id" ||
                        cell.column.id === "price" ||
                        cell.column.id === "stock"
                          ? "text-center"
                          : "text-left"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end py-4 space-x-2">
        <div className="flex-1 text-sm">
          {productFrom} of {productTo} row(s) selected, from {productTotal}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1 || isProductListFetching}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={currentPage === lastPage || isProductListFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
