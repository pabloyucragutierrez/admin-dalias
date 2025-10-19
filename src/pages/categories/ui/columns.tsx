import type { FilterConfig } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import type { Categorias } from "@/interfaces";
import { formatDateTime, getEcommerceTypeLabel } from "@/utils";
import type { ColumnDef } from "@tanstack/react-table";
import ActionsCategory from "./category-action";

export const columnNames: Record<string, string> = {
  name: "Nombre",
  createAt: "Fecha de creación",
  status: "Estado",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "name",
    label: "Nombre",
  },
];

export const stateFilter: FilterConfig[] = [
  {
    id: "all",
    label: "Todos",
  },
  {
    id: "activo",
    label: "Activos",
  },
  {
    id: "inactivo",
    label: "Inactivos",
  },
];

export const getColumns = (
  refreshDataTable: () => void
): ColumnDef<Categorias>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "origen",
    header: "Origen",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">
        {row.original.origen}
      </div>
    ),
  },
  {
    accessorKey: "margen",
    header: "Margen",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">
        {row.original.margen ? `${row.original.margen} %` : "0 %"}
      </div>
    ),
  }, 
  {
    accessorKey: "linea",
    header: "Línea",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">
        {row.original.lineas.name}
      </div>
    ),
  },
  {
      accessorKey: "typeEcommerce",
      header: "Tipo de Ecommerce",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {getEcommerceTypeLabel(row.original.typeEcommerce)}
        </div>
      ),
    }, 
  {
    accessorKey: "createAt",
    header: "Fecha de creación",
    cell: ({ row }) => formatDateTime(row.original.createAt),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant={row.original.status ? "success" : "destructive"}>
        {row.original.status ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ActionsCategory category={row.original} onRefresh={refreshDataTable} />
    ),
  },
];
