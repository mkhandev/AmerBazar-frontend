import Menu from "@/components/navbar/Menu";
import { ModeToggle } from "@/components/navbar/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
        <Button
          asChild
          variant="ghost"
          className="bg-transparent hover:bg-transparent"
        >
          <Link href="/cart" className="text-white hover:text-white">
            <ShoppingCart className="text-white " />
            Cart
          </Link>
        </Button>

        <div className="cursor-pointer">
          <ModeToggle />
        </div>

        <Menu />
      </div>

      <div className="block md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start px-3 py-2">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <Menu />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default UserMenu;
