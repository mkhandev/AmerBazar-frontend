"use client";

import AdminUserNavigation from "@/components/navbar/AdminUserNavigation";
import Logo from "@/components/navbar/Logo";
import MenuDrawer from "@/components/navbar/MenuDrawer";
import Navbar from "@/components/navbar/Navbar";
import UserMenu from "@/components/navbar/UserMenu";

export default function AdminLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <nav className="w-full border-b-1 py-3 bg-[var(--body-bg)] border-[var(--nav-border)]">
        <div className="container flex flex-row items-center justify-between w-full gap-1 px-2 mx-auto sm:px-0">
          <div className="flex-row items-center hidden gap-5 lg:flex">
            <Logo />
            <AdminUserNavigation />
          </div>

          <MenuDrawer />
          <UserMenu />
        </div>
      </nav>

      <div className="container mx-auto border-b">{children}</div>
    </div>
  );
}
