import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { Product, Brand } from "@/interfaces/products.interface";
import type { ColumnDef } from "@tanstack/react-table";
import { fetchActiveBrands } from "@/services/products.service";

export const columnNames: Record<string, string> = {
  image: "Imagen",
  sku: "SKU",
  name: "Nombre",
  codeBarras: "Código de Barras",
  brand: "Marca",
  price: "Precio",
  stock: "Stock",
  createAt: "Fecha de Creación",
  status: "Estado",
};

export const columnFilter = [
  { id: "name", label: "Nombre" },
  { id: "sku", label: "SKU" },
  { id: "marca", label: "Marca" },
];

export const stateFilter = [
  { id: "none", label: "Todos" },
  { id: "true", label: "Activo" },
  { id: "false", label: "Inactivo" },
];

export function getColumns(
  onChangeStatus: (product: Product) => void,
  onDelete: (product: Product) => void
): ColumnDef<Product>[] {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const activeBrands = await fetchActiveBrands();
        setBrands(activeBrands || []);
      } catch (err) {
        console.error("Error al cargar marcas:", err);
      }
    };
    loadBrands();
  }, []);

  return [
    {
      accessorKey: "image",
      header: "Imagen",
      cell: ({ row }) => (
        <img
          src={
            row.original.ProductImages.find(
              (img) => img.typeImage === "THUMBNAIL"
            )?.url || ""
          }
          alt={row.original.name}
          className="h-12 w-12 object-contain rounded"
        />
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => (
        <button
          type="button"
          className="text-sm font-medium text-gray-900 hover:underline hover:cursor-pointer"
          onClick={() => navigate(`/products/${row.original.id}`)}
        >
          {row.original.sku}
        </button>
      ),
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "codeBarras",
      header: "Código de fabricante",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {row.original.codigoOriginal}
        </div>
      ),
    },
    {
      accessorKey: "marcaId",
      header: "Marca",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {brands.find((brand) => brand.id === row.original.marcaId)?.name ||
            "Sin marca"}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          ${row.original.price.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.stock}</div>
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
              <span className="text-sm ml-2">Copiar ID de producto</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => navigate(`/products/${row.original.id}`)}
            >
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
                {row.original.status
                  ? "Desactivar Producto"
                  : "Activar Producto"}
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
