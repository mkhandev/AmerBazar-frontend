import Logo from "@/components/navbar/Logo";
import UserNavigation from "@/components/navbar/UserNavigation";
import Search from "@/components/navbar/Search";
import UserMenu from "@/components/navbar/UserMenu";
import MenuDrawer from "@/components/navbar/MenuDrawer";

const Navbar = () => {
  return (
    <nav className="w-full border-b-3 border-[#37a001] py-4 bg-[#37a001]">
      <div className="container w-full mx-auto flex flex-row justify-between items-center px-2 sm:px-0 gap-1">
        <div className="hidden md:flex flex-row gap-4 items-center">
          <Logo />
          <UserNavigation />
        </div>

        <MenuDrawer />
        <Search />
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
