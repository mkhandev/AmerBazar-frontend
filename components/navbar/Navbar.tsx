import Logo from "@/components/navbar/Logo";
import UserNavigation from "@/components/navbar/UserNavigation";
import Search from "@/components/navbar/Search";
import UserMenu from "@/components/navbar/UserMenu";
import MenuDrawer from "@/components/navbar/MenuDrawer";
import { Suspense } from "react";

const Navbar = () => {
  return (
    <nav className="w-full border-b-1 py-3 bg-[var(--body-bg)] border-[var(--nav-border)]">
      <div className="container w-full mx-auto flex flex-row justify-between items-center px-2 sm:px-0 gap-1">
        <div className="hidden lg:flex flex-row gap-5 items-center">
          <Logo />
          <UserNavigation />
        </div>

        <MenuDrawer />
        <Suspense fallback={<></>}>
          <Search />
        </Suspense>
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
