import { formatDateTime } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheck, Copy, Edit, FolderX, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Sucursales } from "@/interfaces/sucursales.interface";
import type { ColumnDef } from "@tanstack/react-table";

export const columnNames: Record<string, string> = {
  code: "Código",
  name: "Nombre",
  district: "Distrito",
  address: "Dirección",
  phone: "Teléfono",
  createAt: "Fecha de Creación",
  status: "Estado",
};

export const columnFilter = [
  { id: "name", label: "Nombre" },
  { id: "code", label: "Código" },
  { id: "district", label: "Distrito" },
];

export const stateFilter = [
  { id: "none", label: "Todos" },
  { id: "true", label: "Activo" },
  { id: "false", label: "Inactivo" },
];

export function getColumns(
  onChangeStatus: (sucursal: Sucursales) => void,
  onEdit: (sucursal: Sucursales) => void,
  onDelete: (sucursal: Sucursales) => void
): ColumnDef<Sucursales>[] {
  return [
    {
      accessorKey: "code",
      header: "Código",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.code}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <button
          type="button"
          className="text-sm font-medium text-gray-900 hover:underline hover:cursor-pointer"
          onClick={() => onEdit(row.original)}
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: "district",
      header: "Distrito",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.district}</div>
      ),
    },
    {
      accessorKey: "address",
      header: "Dirección",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.address}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.phone}</div>
      ),
    },
    {
      accessorKey: "createAt",
      header: "Fecha de Creación",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{formatDateTime(row.original.createAt)}</div>
      ),
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
      header: "Acciones",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(row.original.id);
                toast("ID copiado");
              }}
            >
              <Copy size={18} />
              <span className="text-sm ml-2">Copiar ID de sucursal</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => onEdit(row.original)}
            >
              <Edit size={18} />
              <span className="text-sm ml-2">Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onChangeStatus(row.original)}
            >
              {row.original.status ? (
                <FolderX size={18} />
              ) : (
                <BadgeCheck size={18} />
              )}
              <span className="text-sm ml-2">
                {row.original.status ? "Desactivar Sucursal" : "Activar Sucursal"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onDelete(row.original)}
            >
              <Trash2 size={18} />
              <span className="text-sm ml-2">Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}