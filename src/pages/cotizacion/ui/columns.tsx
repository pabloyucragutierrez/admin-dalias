import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Cotizacion } from "@/interfaces/cotizacion.interface";
import { downloadCotizacionPdf } from "@/services/cotizacion.service";
import { formatDateTime } from "@/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, Edit, Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

export const columnNames: Record<string, string> = {
    code: "Código",
    ruc: "RUC Empresa",
    empresa: "Empresa",
    document: "Cliente Documento",
    cliente: "Cliente",
    phone: "Cliente Teléfono",
    createAt: "Fecha de Creación",
  status: "Estado",
  total: "Total",
};

export const columnFilter = [
  { id: 'code', label: 'Código' },
  { id: 'client', label: 'Cliente' },
  { id: "business", label: "Empresa" },
];


export const stateFilter = [
  { id: "all", label: "Todos" },
  { id: "activo", label: "Activo" },
  { id: "inactivo", label: "Inactivo" },
];

export function getColumns(): ColumnDef<Cotizacion>[] {
    const navigate = useNavigate();

    const downloadPdf = async (id: string, code:string) => {
        try {
            const pdfBlob = await downloadCotizacionPdf(id);
            
            // Crear URL temporal para el blob
            const url = window.URL.createObjectURL(pdfBlob);
            
            // Crear elemento de descarga temporal
            const link = document.createElement('a');
            link.href = url;
            link.download = `cotizacion-${code}.pdf`;
            document.body.appendChild(link);
            link.click();
            
            // Limpiar
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            // Aquí podrías agregar una notificación de error si tienes un sistema de toast
        }
    }

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
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => (
                <div className="text-sm text-gray-500">
                    {row.original.CotizacionDetail.reduce((acc, product) => acc + product.price * product.quantity, 0)}
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
                            <DropdownMenuItem className="cursor-pointer"
                                onSelect={() => navigate(`/cotizacion/vista/${row.original.id}`)}
                                >
                                <Eye size={18} />
                                <span className="text-sm ml-2">Ver</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer"
                                onSelect={() => navigate(`/cotizacion/${row.original.id}`)}
                                >
                                <Edit size={18} />
                                <span className="text-sm ml-2">Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer"
                                onSelect={() => downloadPdf(row.original.id, row.original.code)}
                                >
                                <Download size={18} />
                                <span className="text-sm ml-2">Descargar PDF</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                </DropdownMenu>
            ),
        }
    ]
}