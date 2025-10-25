import Menu from "@/components/navbar/Menu";
import { ModeToggle } from "@/components/navbar/ModeToggle";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserMenu = () => {
  return (
    <div className="flex flex-row gap-1 items-center">
      <ModeToggle />
      <Button asChild variant="ghost">
        <Link href="/">
          <ShoppingCart /> Cart
        </Link>
      </Button>

      <Menu />
    </div>
  );
};

export default UserMenu;
