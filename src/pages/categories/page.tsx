import { DataTable } from "@/components/data-table";
import { Plus } from "lucide-react";
import { useRef } from "react";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Marcas</h1>
        <Button
          className="bg-blue-600 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 cursor-pointer"
          onClick={() => navigate("/categorias/new")}
        >
          <Plus size={18} />
          Nueva Marca
        </Button>
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