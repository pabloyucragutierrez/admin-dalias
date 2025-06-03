import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "./ui/sheet";
import { Link } from "react-router";
import { Menu } from "./menu";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <SheetTitle />
          <Button
            className="flex justify-center items-center pb-2 pt-1 mt-2"
            variant="link"
            asChild
          >
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Dopitec"
                className="w-16 object-contain"
              />
            </Link>
          </Button>
        </SheetHeader>

        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
