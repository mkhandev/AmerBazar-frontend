import Menu from "@/components/navbar/Menu";
import { ModeToggle } from "@/components/navbar/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EllipsisVertical, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserMenu = () => {
  return (
    <>
      <div className="hidden md:flex flex-row gap-1 items-center">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart /> Cart
          </Link>
        </Button>

        <Menu />
      </div>

      <div className="block md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <EllipsisVertical className="text-[#FFFFFF]" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Profile</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default UserMenu;
