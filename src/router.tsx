import { createBrowserRouter } from "react-router";
import AdminLayout from "./layout/AdminLayout";
import DashboardPage from "./pages/dashboard/page";
import UnidadesPage from "./pages/unidades/page";
import CategoriesPage from "./pages/categories/page";
import MarcasPage from "./pages/marcas/page";
import RolesPage from "./pages/roles/page";
import SucursalesPage from "./pages/sucursales/page";
import ManagementSucursal from "./pages/sucursales/ui/ManagementSucursal";
import EmpresasPage from "./pages/empresas/page";
import ManagementEmpresa from "./pages/empresas/ui/ManagementEmpresa";
import UsersPage from "./pages/users/page";
import ManagementUser from "./pages/users/ui/ManagementUser";

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
      {
        path: "sucursales",
        element: <SucursalesPage />,
      },
      {
        path: "sucursales/:id",
        element: <ManagementSucursal />,
      },
      {
        path: "empresas",
        element: <EmpresasPage />,
      },
      {
        path: "empresas/:id",
        element: <ManagementEmpresa />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "users/:id",
        element: <ManagementUser />,
      },
    ],
  },
]);
