import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useStore } from "@/hooks";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useSidebar } from "@/stores/sidebar.store";
import { Navigate, Outlet } from "react-router";

export default function AdminLayout() {
  const sidebar = useStore(useSidebar, (x) => x);
  const { isAuthenticated, user } = useAuthStore((state) => state);

  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[100vh] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
        )}
      >
        <Navbar />
        <div className="py-4 px-4 lg:px-8">
          <Outlet />
        </div>
      </main>
    </>
  );
}
