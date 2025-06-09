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
import {
  BadgeCheck,
  Copy,
  Edit,
  FolderX,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import type { User } from "@/interfaces";
import type { ColumnDef } from "@tanstack/react-table";
import type { FilterConfig } from "@/components/data-table";

export const columnNames: Record<string, string> = {
  name: "Nombre",
  lastName: "Apellido",
  email: "Email",
  documentType: "Tipo de Documento",
  documentNumber: "Nº Documento",
  phone: "Teléfono",
  createAt: "Fecha de Creación",
  status: "Estado",
};

export const columnFilter = [
  { id: "name", label: "Nombre" },
  { id: "lastName", label: "Apellido" },
  { id: "email", label: "Email" },
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
  onChangeStatus: (user: User) => void,
  onDelete: (user: User) => void
): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <Link
          to={`/users/${row.original.id}`}
          type="button"
          className="text-sm font-medium text-gray-900 hover:underline hover:cursor-pointer"
        >
          {row.original.person.name}
        </Link>
      ),
    },
    {
      accessorKey: "lastName",
      header: "Apellido",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {row.original.person.lastName}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.person.email}</div>
      ),
    },
    {
      accessorKey: "documentType",
      header: "Tipo de Documento",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {row.original.person.documentType}
        </div>
      ),
    },
    {
      accessorKey: "documentNumber",
      header: "Nº Documento",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {row.original.person.documentNumber}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {row.original.person.PhonesPersons[0]?.phone || ""}
        </div>
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
              <span className="text-sm ml-2">Copiar ID de usuario</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="flex flex-row items-center gap-2"
                to={`/users/${row.original.id}`}
              >
                <Edit size={18} />
                <span className="text-sm ml-2">Editar</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onChangeStatus(row.original)}>
              {row.original.status ? (
                <FolderX size={18} />
              ) : (
                <BadgeCheck size={18} />
              )}
              <span className="text-sm ml-2">
                {row.original.status ? "Desactivar Usuario" : "Activar Usuario"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete(row.original)}>
              <Trash2 size={18} />
              <span className="text-sm ml-2">Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
