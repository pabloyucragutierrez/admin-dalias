import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Categorias } from "@/interfaces";
import {
  BadgeCheck,
  Copy,
  Edit,
  Loader2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { activeOrInactiveCategorias } from "@/services/categorias.service";
import CategoryForm from "./category-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  category: Categorias;
  onRefresh: () => void;
}

export default function ActionsCategory({ category, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeStatus = async (id: string, status: boolean) => {
    setIsLoading(true);

    const response = await activeOrInactiveCategorias(id, { status: !status });

    setIsLoading(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: "top-center" });
      return;
    }

    toast.success(response?.message, { position: "top-center" });
    onRefresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(category.id);
              toast("ID copiado");
            }}
          >
            <Copy size={18} />
            <span className="text-sm ml-2">Copiar ID de categoria</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
            <Dialog open={openModal} onOpenChange={setOpenModal}>
              <DialogTrigger asChild>
                <button className="w-full flex flex-row items-center gap-2 py-1 cursor-pointer">
                  <Edit size={18} />
                  Editar
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Editar categoria</DialogTitle>
                  <DialogDescription>Editar categoria</DialogDescription>
                </DialogHeader>
                <CategoryForm
                  handleCancel={() => setOpenModal(false)}
                  refreshDataTable={onRefresh}
                  categoria={category}
                />
              </DialogContent>
            </Dialog>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <button className="w-full flex flex-row items-center gap-2 py-1 cursor-pointer">
                  {category.status ? (
                    <Trash2 size={18} />
                  ) : (
                    <BadgeCheck size={18} />
                  )}
                  {category.status
                    ? "Desactivar Categoria"
                    : "Activar Categoria"}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Estás absolutamente seguro?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción {category.status ? "desactivara" : "activara"}{" "}
                    la categoria de nuestros servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLoading}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      handleChangeStatus(category.id, category.status);
                    }}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando...
                      </>
                    ) : (
                      "Continuar"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
