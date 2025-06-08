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
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { Empresa } from "@/interfaces";
import type { ColumnDef } from "@tanstack/react-table";

export const columnNames: Record<string, string> = {
  name: "Nombre",
  ruc: "RUC",
  razonSocial: "Razón Social",
  district: "Distrito",
  phone: "Teléfono",
  email: "Email",
  createAt: "Fecha de Creación",
  status: "Estado",
};

export const columnFilter = [
  { id: "name", label: "Nombre" },
  { id: "ruc", label: "RUC" },
  { id: "razonSocial", label: "Razón Social" },
  { id: "district", label: "Distrito" },
];

export const stateFilter = [
  { id: "none", label: "Todos" },
  { id: "true", label: "Activo" },
  { id: "false", label: "Inactivo" },
];

export function getColumns(
  onChangeStatus: (empresa: Empresa) => void,
  onDelete: (empresa: Empresa) => void
): ColumnDef<Empresa>[] {
  const navigate = useNavigate();

  return [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <button
          type="button"
          className="text-sm font-medium text-gray-900 hover:underline hover:cursor-pointer"
          onClick={() => navigate(`/empresas/${row.original.id}`)}
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: "ruc",
      header: "RUC",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.ruc}</div>
      ),
    },
    {
      accessorKey: "razonSocial",
      header: "Razón Social",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.razonSocial}</div>
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
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.phone}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.email}</div>
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
              <span className="text-sm ml-2">Copiar ID de empresa</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => navigate(`/empresas/${row.original.id}`)}
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
                {row.original.status ? "Desactivar Empresa" : "Activar Empresa"}
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