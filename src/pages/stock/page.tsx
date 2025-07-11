import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";
import { DataTable } from "@/components/data-table";

export default function StockPage() {
  const navigate = useNavigate();
  const refreshDataTable = useRef<() => void>(null);

  return (
    <div className="w-full mx-auto">
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Módulo de Stock</h1>
        <Button
          className="bg-blue-600 flex flex-row items-center gap-2 text-white hover:bg-blue-700"
          onClick={() => navigate("/stock/nuevo")}
        >
          <Plus size={20} />
          Nuevo Manejo de Stock
        </Button>
      </div>

      <div className="container mx-auto py-5">
        <DataTable
          columns={getColumns()}
          columnNames={columnNames}
          url="management-stock"
          typeFilter={columnFilter}
          stateFilter={stateFilter}
          onRefresh={(callback) => {
            refreshDataTable.current = callback;
          }}
        />
      </div>
    </div>
  );
}