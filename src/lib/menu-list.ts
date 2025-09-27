import {
  BadgePercent,
  ContactRound,
  LayoutGrid,
  Newspaper,
  Settings,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Dashboard",
          icon: LayoutGrid,
        },
        {
          href: "/cotizacion",
          label: "Cotizaciones",
          icon: Newspaper,
        },
        {
          href: "/clientes",
          label: "Clientes",
          icon: ContactRound,
        },
        {
          href: "",
          label: "Catalogo",
          icon: ShoppingBag,
          submenus: [
            {
              href: "/unidades",
              label: "Unidades",
            },
            {
              href: "/categorias",
              label: "Categorias",
            },
            {
              href: "/products",
              label: "Productos",
            },
            {
              href: "/lineas",
              label: "Líneas",
            },
          ],
        },
        {
          href: "",
          label: "Publicidad",
          icon: BadgePercent,
          submenus: [
            {
              href: "/carrusel",
              label: "Carrusel",
            },
            {
              href: "/banners",
              label: "Banners",
            },
          ],
        },
        {
          href: "",
          label: "Configuración",
          icon: Settings,
          submenus: [
            {
              href: "/roles",
              label: "Roles",
            },
            {
              href: "/sucursales",
              label: "Sucursales",
            },
            {
              href: "/empresas",
              label: "Empresas",
            },
            {
              href: "/users",
              label: "Usuarios",
            },
            {
              href: "/tarifas",
              label: "Tarifas",
            },
            {
              href: "/bancos",
              label: "Bancos",
            },
            {
              href: "/stock",
              label: "Stock",
            },
            
          ],
        },
      ],
    },
  ];
}
