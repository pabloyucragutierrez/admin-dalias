import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; 
import { useNavigate } from "react-router";
import { columnFilter, columnNames, getColumns, stateFilter } from "./ui/columns";
import { useRef } from "react";

export default function Cotizacion() { 
  const navigate = useNavigate();

  const refreshDataTable = useRef<() => void>(null);

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Cotizaciones</h1>
        <Button
          className="bg-blue-600 flex flex-row items-center gap-2 text-white hover:bg-blue-700 cursor-pointer"
          onClick={() => navigate("/cotizacion/nuevo")}
        >
          <Plus size={20} />
          Nueva Cotizacion
        </Button>
      </div>

      <div className="container mx-auto py-5">
        <DataTable
          columns={getColumns()}
          columnNames={columnNames}
          url="cotizacion"
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