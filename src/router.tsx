import { createBrowserRouter } from "react-router";
import AdminLayout from "./layout/AdminLayout";
import DashboardPage from "./pages/dashboard/page";
import UnidadesPage from "./pages/unidades/page";
import CategoriesPage from "./pages/categories/page";
import MarcasPage from "./pages/marcas/page";
import RolesPage from "./pages/roles/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "unidades",
        element: <UnidadesPage />,
      },
      {
        path: "categorias",
        element: <CategoriesPage />,
      },
      {
        path: "marcas",
        element: <MarcasPage />,
      },
      {
        path: "roles",
        element: <RolesPage />,
      },
    ],
  },
]);
