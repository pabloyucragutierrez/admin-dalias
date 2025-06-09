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
import { BadgeCheck, Copy, Edit, FolderX, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import type { Roles } from "@/interfaces/roles.interface";
import type { ColumnDef } from "@tanstack/react-table";
import type { FilterConfig } from "@/components/data-table";

export const columnNames: Record<string, string> = {
  name: "Nombre",
  createAt: "Fecha de Creación",
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

export function getColumns(
  onChangeStatus: (rol: Roles) => void,
  onEdit: (rol: Roles) => void
): ColumnDef<Roles>[] {
  return [
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
      accessorKey: "createAt",
      header: "Fecha de Creación",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {formatDateTime(row.original.createAt)}
        </div>
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
              <span className="text-sm ml-2">Copiar ID de rol</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onEdit(row.original)}>
              <Edit size={18} />
              <span className="text-sm ml-2">Editar</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onChangeStatus(row.original)}>
              {row.original.status ? (
                <FolderX size={18} />
              ) : (
                <BadgeCheck size={18} />
              )}
              <span className="text-sm ml-2">
                {row.original.status ? "Desactivar Rol" : "Activar Rol"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
