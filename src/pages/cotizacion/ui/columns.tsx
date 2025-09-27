import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Cotizacion } from "@/interfaces/cotizacion.interface";
import { formatDateTime } from "@/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

export const columnNames: Record<string, string> = {
  createAt: "Fecha de Creación",
  status: "Estado",
};

export const columnFilter = [
  { id: 'name', label: 'Nombre' },
  { id: 'razonSocial', label: 'Razón Social' },
  { id: "document", label: "N* Documento" },
  { id: 'email', label: 'Email' }
];


export const stateFilter = [
  { id: "all", label: "Todos" },
  { id: "activo", label: "Activo" },
  { id: "inactivo", label: "Inactivo" },
];

export function getColumns(): ColumnDef<Cotizacion>[] {
    const navigate = useNavigate();
    return  [
        {
            accessorKey: "code",
            header: "Código",
        },
        {
            accessorKey: "ruc",
            header: "RUC Empresa",
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {row.original.business.ruc}
                </div>
            ),
        },
        {
            accessorKey: "empresa",
            header: "Empresa",
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {row.original.business.razonSocial}
                </div>
            ),
        },
        {
            accessorKey: "document",
            header: "Cliente Documento",
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {row.original.client.document}
                </div>
            ),
        },
        {
            accessorKey: "cliente",
            header: "Cliente",
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {row.original.client.typeDocument === 'DNI' ? `${row.original.client.name} ${row.original.client.lastName}` : row.original.client.razonSocial}
                </div>
            ),
        },
        {
            accessorKey: "phone",
            header: "Cliente Teléfono",
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {row.original.client.phone}
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
                    onSelect={() => navigate(`/cotizacion/${row.original.id}`)}
                    >
                    <Edit size={18} />
                    <span className="text-sm ml-2">Editar</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
    ]
}