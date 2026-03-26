import { useStore } from "@/hooks";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/stores/sidebar.store";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { SidebarToggle } from "./sidebar-toggle";
import { Menu } from "./menu";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        !getOpenState() ? "w-[90px]" : "w-72",
        settings.disabled && "hidden"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md"
      >
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1 mt-2",
            !getOpenState() ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link to="/" className="flex items-center gap-2">
            <img
              src={!getOpenState() ? "/dalias.png" : "/logo_header.png"}
              alt="Dalias"
              className={`${
                !getOpenState() ? "w-auto mr-2" : "w-[10rem]"
              } object-contain`}
            />
          </Link>
        </Button>

        <Menu isOpen={getOpenState()} />
      </div>
    </aside>
  );
}
