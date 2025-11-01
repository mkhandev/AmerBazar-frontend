import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const MenuDrawer = () => {
  return (
    <div className="block lg:hidden">
      <Drawer direction="left">
        <DrawerTrigger asChild>
          <Button variant="outline">
            <MenuIcon />
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="mb-2 pb-2 border-b">AmerBazar</DrawerTitle>
            <div className="flex flex-col gap-1">
              <Link href="/">Home</Link>
              <Link href="/search">Products</Link>
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MenuDrawer;
