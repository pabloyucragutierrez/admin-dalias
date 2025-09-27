import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react"; 
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { columnFilter, columnNames, getColumns, stateFilter } from "./ui/columns";
import type { Cliente } from "@/interfaces/client.interface";

export default function Clients() { 
  const navigate = useNavigate();

  const refreshDataTable = useRef<() => void>(null);

  const [clientSelect, setClientSelect] = useState<Cliente | null>(null);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);

  const handleChangeStatus = async (client: Cliente) => {
    setShowModalStatus(true);
    setClientSelect(client);
  };

  const handleCancelStatus = () => {
    setShowModalStatus(false);
    setClientSelect(null);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Clientes</h1>
        <Button
          className="bg-blue-600 flex flex-row items-center gap-2 text-white hover:bg-blue-700 cursor-pointer"
          onClick={() => navigate("/clientes/nuevo")}
        >
          <Plus size={20} />
          Nuevo Cliente
        </Button>
      </div>

      <div className="container mx-auto py-5">
        <DataTable
          columns={getColumns(handleChangeStatus)}
          columnNames={columnNames}
          url="clients"
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