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
import ProductsPage from "./pages/productos/page";
import ManagementProduct from "./pages/productos/ui/ManagementProduct";
import Login from "./pages/login/page";
import CarruselPage from "./pages/carrusel/page";
import NewCarrusel from "./pages/carrusel/ui/NewCarrusel";
import BannersPage from "./pages/banners/page";
import NewBanner from "./pages/banners/ui/NewBanner";

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
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:id",
        element: <ManagementProduct />,
      },
      {
        path: "carrusel",
        element: <CarruselPage />,
      },
      {
        path: "carrusel/new",
        element: <NewCarrusel />,
      },
      {
        path: "banners",
        element: <BannersPage />,
      },
      {
        path: "banners/new",
        element: <NewBanner />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
