import type { FilterConfig } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import type { ManagementStock } from "@/interfaces/management-stock.interface";
import { formatDateTime } from "@/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const columnNames: Record<string, string> = {
  product: "Nombre Producto",
  quantity: "Cantidad",
  createAt: "Fecha de Creación",
  type: "Tipo",
};

export const columnFilter: FilterConfig[] = [
  {
    id: "product",
    label: "Nombre Producto",
  },
];

export const stateFilter: FilterConfig[] = [];

export const getColumns = (): ColumnDef<ManagementStock>[] => [
  {
    id: "product",
    header: "Nombre Producto",
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">
        {row.original.product.name}
      </div>
    ),
  },
  {
    id: "sku",
    header: "SKU",
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-900">
        {row.original.product.sku}
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
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">{row.original.type}</div>
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
 
];