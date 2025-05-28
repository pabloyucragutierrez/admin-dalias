import {
  LayoutGrid,
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
          href: "",
          label: "Productos",
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
              href: "/marcas",
              label: "Marcas",
            },
            {
              href: "/products",
              label: "Productos",
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
          ],
        },
      ],
    },
  ];
}
