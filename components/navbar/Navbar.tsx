import Logo from "@/components/navbar/Logo";
import UserNavigation from "@/components/navbar/UserNavigation";
import Search from "@/components/navbar/Search";
import UserMenu from "@/components/navbar/UserMenu";

const Navbar = () => {
  return (
    <nav className="w-full border-b py-4">
      <div className="container mx-auto flex sm:flex-row sm:justify-between items-center">
        <div className="flex flex-row gap-4 items-center">
          <Logo />
          <UserNavigation />
        </div>
        <Search />
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
