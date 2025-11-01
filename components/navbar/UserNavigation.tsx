"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const UserNavigation = () => {
  const pathname = usePathname();

  return (
    <div className="flex space-x-2 text-white text-[20px]">
      <Link
        href="/"
        className={`${pathname === "/" ? "text-white" : ""}  px-2`}
      >
        Home
      </Link>
      <Link
        href="/search"
        className={`${pathname === "/" ? "text-white" : ""}  px-2`}
      >
        Products
      </Link>
    </div>
  );
};

export default UserNavigation;
