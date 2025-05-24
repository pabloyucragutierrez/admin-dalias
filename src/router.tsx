import { createBrowserRouter } from "react-router";
import AdminLayout from "./layout/AdminLayout";
import DashboardPage from "./pages/dashboard/page";
import UnidadesPage from "./pages/unidades/page";
import CategoriesPage from "./pages/categories/page";

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
    ],
  },
]);
