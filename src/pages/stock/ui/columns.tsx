import type { FilterConfig } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import type { ManagementStock } from "@/interfaces/management-stock.interface";
import { formatDateTime } from "@/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const columnNames: Record<string, string> = {
  nameProduct: "Nombre Producto",
  quantity: "Cantidad",
  createAt: "Fecha de Creación",
  status: "Estado",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "nameProduct",
    label: "Nombre Producto",
  },
];

export const stateFilter: FilterConfig[] = [];

export const getColumns = (): ColumnDef<ManagementStock>[] => [
  {
    id: "nameProduct",
    header: "Nombre Producto",
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">
        {row.original.product.typeProduct === "SIMPLE"
          ? row.original.product.name
          : `${row.original.product.father?.name ?? "Unknown"} | Variación: ${
              row.original.product.terminoProducts?.[0]?.termino?.name ?? "Unknown"
            }`}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">{row.original.quantity}</div>
    ),
  },
  {
    accessorKey: "createAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="text-sm font-semibold text-gray-700"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Fecha de Creación
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">{formatDateTime(row.original.createAt)}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">{row.original.status}</div>
    ),
  },
];