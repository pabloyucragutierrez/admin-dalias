import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Cliente } from "@/interfaces/client.interface";
import { formatDateTime, getEcommerceTypeLabel } from "@/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

export const columnNames: Record<string, string> = {
  typeDocument: 'Tipo de Documento',
  document: 'Documento',
  razonSocial: 'Razón Social',
  name: 'Nombre',
  email: 'Email',
  phone: 'Teléfono',
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


export function getColumns(
): ColumnDef<Cliente>[] {
    const navigate = useNavigate();
    return [
        {
            accessorKey: "typeDocument",
            header: columnNames.typeDocument,
        },
        {
            accessorKey: "document",
            header: columnNames.document,
        },
        {
            accessorKey: 'razonSocial',
            header: 'Razón Social',
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {row.original.razonSocial !== '' ? row.original.razonSocial : '-'}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Nombre",
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {row.original.name} {row.original.lastName}
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "phone",
            header: "Teléfono",
        },
        {
            accessorKey: 'typeEcommerce',
            header: 'Tipo de Ecommerce',
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {getEcommerceTypeLabel(row.original.typeEcommerce)}
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
                    onSelect={() => navigate(`/clientes/${row.original.id}`)}
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