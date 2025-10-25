"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const UserNavigation = () => {
  const pathname = usePathname();

  return (
    <div className="flex space-x-2">
      <Link
        href="/"
        className={`${
          pathname === "/" ? "bg-orange-400 text-white" : ""
        } text-[#000] hover:bg-orange-400 hover:text-white rounded-md px-3 py-2`}
      >
        Home
      </Link>
      <Link
        href="/product"
        className={`${
          pathname === "/products" ? "bg-orange-400 text-white" : ""
        } text-[#000] hover:bg-orange-400 hover:text-white rounded-md px-3 py-2`}
      >
        Products
      </Link>
    </div>
  );
};

export default UserNavigation;
