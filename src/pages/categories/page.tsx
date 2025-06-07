import { DataTable } from "@/components/data-table";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@/components/ui/dialog";
import CategoryForm from "./ui/category-form";

export default function CategoriasPage() {
  const refreshDataTable = useRef<() => void>(null);
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Categorías</h1>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-md flex items-center gap-2">
              <Plus size={18} />
              Nueva Categoría
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nueva categoria</DialogTitle>
              <DialogDescription>Nueva categoria</DialogDescription>
            </DialogHeader>
            <CategoryForm
              handleCancel={() => setOpenModal(false)}
              refreshDataTable={refreshDataTable.current!}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="container mx-auto py-5">
        <DataTable
          columns={getColumns(() => refreshDataTable.current?.())}
          columnNames={columnNames}
          url="categorias"
          typeFilter={columnFilter}
          stateFilter={stateFilter}
          onRefresh={(callback) => {
            refreshDataTable.current = callback;
          }}
        />
      </div>
    </>
  );
}
