import { createBrowserRouter } from "react-router";
import AdminLayout from "./layout/AdminLayout";
import DashboardPage from "./pages/dashboard/page";
import UnidadesPage from "./pages/unidades/page";
import CategoriesPage from "./pages/categories/page";
import ManagementCategory from "./pages/categories/ui/ManagementCategory";
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
import LineasPage from "./pages/lineas/page";
import ManagementLinea from "./pages/lineas/ui/ManagementLinea";
import Tarifas from "./pages/tarifas/page";
import ManagementShippingRate from "./pages/tarifas/ui/ManagementShippingRate";
import Bancos from "./pages/bancos/page";
import BancosForm from "./pages/bancos/ui/management-bancos";
import StockPage from "./pages/stock/page";
import StockByIdPage from "./pages/stock/[id]/page";
import Cotizacion from "./pages/cotizacion/page";
import ManagementCotizacion from "./pages/cotizacion/ui/management-cotizacion";
import Clients from "./pages/clients/page";
import ManagementClient from "./pages/clients/ui/management-client";
import ViewCotizacion from "./pages/cotizacion/ui/view-cotizacion";
import BlogsPage from "./pages/blogs/page";
import ManagementBlog from "./pages/blogs/ui/ManagementBlog";

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
        path: "cotizacion",
        element: <Cotizacion />,
      },
      {
        path: "cotizacion/:id",
        element: <ManagementCotizacion />,
      },
      {
        path: "cotizacion/vista/:id",
        element: <ViewCotizacion />,
      },
      {
        path: "clientes",
        element: <Clients />,
      },
      {
        path: "clientes/:id",
        element: <ManagementClient />,
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
        path: "categorias/:id",
        element: <ManagementCategory />,
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
        path: "lineas",
        element: <LineasPage />,
      },
      {
        path: "lineas/:id",
        element: <ManagementLinea />,
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
      {
        path: "tarifas",
        element: <Tarifas />,
      },
      {
        path: "tarifas/:id",
        element: <ManagementShippingRate />,
      },
      {
        path: "bancos",
        element: <Bancos />,
      },
      {
        path: "bancos/:id",
        element: <BancosForm />,
      },
       {
        path: "stock",
        element: <StockPage />,
      },
      {
        path: "stock/nuevo",
        element: <StockByIdPage />,
      },
      {
        path: "blogs",
        element: <BlogsPage />,
      },
      {
        path: "blogs/:id",
        element: <ManagementBlog />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
