import { Button } from "@/components/ui/button";
import type { FilterConfig } from "@/components/data-table";
import type { Banco } from "@/interfaces/bancos.interface";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const columnNames: Record<string, string> = {
  typeBank: "Entidad Financiera",
  namePerson: "Nombre de Persona",
  ahorroSoles: "Ahorro Soles",
  cciSoles: "CCI Soles",
  ahorroDolares: "Ahorro Dólares",
  cciDolares: "CCI Dólares",
  phone: "Teléfono",
  actions: "Acciones",
};

export const columnFilter: FilterConfig[] = [
  { id: "typeBank", label: "Entidad Financiera" },
  { id: "namePerson", label: "Nombre" },
];

export const stateFilter: FilterConfig[] = [];

export const getColumns = (
  onEdit: (banco: Banco) => void,
  onDelete: (banco: Banco) => void
): ColumnDef<Banco>[] => [
  {
    id: "typeBank",
    header: "Entidad Financiera",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">{row.original.typeBank || "N/A"}</div>
    ),
  },
  {
    id: "namePerson",
    header: "Nombre de Persona",
    cell: ({ row }) => (
      <button
        type="button"
        className="text-sm font-medium text-gray-900 hover:underline hover:cursor-pointer"
        onClick={() => onEdit(row.original)}
      >
        {row.original.namePerson || "N/A"}
      </button>
    ),
  },
  {
    id: "ahorroSoles",
    header: "Ahorro Soles",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">{row.original.ahorroSoles || "N/A"}</div>
    ),
  },
  {
    id: "cciSoles",
    header: "CCI Soles",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">{row.original.cciSoles || "N/A"}</div>
    ),
  },
  {
    id: "ahorroDolares",
    header: "Ahorro Dólares",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">{row.original.ahorroDolares || "N/A"}</div>
    ),
  },
  {
    id: "cciDolares",
    header: "CCI Dólares",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">{row.original.cciDolares || "N/A"}</div>
    ),
  },
  {
    id: "phone",
    header: "Teléfono",
    cell: ({ row }) => (
      <div className="text-sm text-gray-500">{row.original.phone || "N/A"}</div>
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
              toast("ID copiado", { position: "top-center" });
            }}
          >
            <Copy size={18} />
            <span className="text-sm ml-2">Copiar ID de banco</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => onEdit(row.original)}>
            <Edit size={18} />
            <span className="text-sm ml-2">Editar</span>
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