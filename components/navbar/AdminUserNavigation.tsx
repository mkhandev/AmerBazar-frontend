"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminUserNavigation = () => {
  const pathname = usePathname();

  return (
    <div className="flex space-x-2 text-white text-[20px]">
      <Link
        href="/admin/overview"
        className={`${pathname === "/admin/overview" ? "font-bold" : ""}  px-2`}
      >
        Overview
      </Link>
      {/* <Link
        href="/search"
        className={`${pathname === "/" ? "font-bold" : ""}  px-2`}
      >
        Products
      </Link> */}
      <Link
        href="/admin/orders"
        className={`${pathname === "/admin/orders" ? "font-bold" : ""}  px-2`}
      >
        Orders
      </Link>
      {/* <Link
        href="/search"
        className={`${pathname === "/" ? "font-bold" : ""}  px-2`}
      >
        Users
      </Link> */}
    </div>
  );
};

export default AdminUserNavigation;
