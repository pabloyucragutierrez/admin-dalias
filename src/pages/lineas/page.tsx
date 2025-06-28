import { Loader2, Plus, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  activeOrInactiveLineas,
} from "@/services/lineas.service";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import type { Linea } from "@/interfaces/lineas.interface";
import { DataTable } from "@/components/data-table";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function LineasPage() {
  const navigate = useNavigate();

  const [lineaSelect, setLineaSelect] = useState<Linea | null>(null);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const refreshDataTable = useRef<() => void>(null);

  const handleChangeStatus = async (linea: Linea) => {
    setShowModalStatus(true);
    setLineaSelect(linea);
  };

  const changeStatusFn = async () => {
    setLoadingStatus(true);

    const response = await activeOrInactiveLineas(lineaSelect?.id || "", {
      status: !lineaSelect?.status,
    });

    setLoadingStatus(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: "top-center" });
      return;
    }

    toast.success(response?.message, { position: "top-center" });

    handleCancelStatus();
  };

  const handleCancelStatus = () => {
    setShowModalStatus(false);
    setLineaSelect(null);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Líneas</h1>
        <Button
          className="bg-blue-600 flex flex-row items-center gap-2 text-white hover:bg-blue-700"
          onClick={() => navigate("/lineas/new")}
        >
          <Plus size={20} />
          Nueva Línea
        </Button>
      </div>

      <div className="container mx-auto py-5">
        <DataTable
          columns={getColumns((linea: Linea) => {
            handleChangeStatus(linea);
            refreshDataTable.current?.();
          })}
          columnNames={columnNames}
          url="lineas"
          typeFilter={columnFilter}
          stateFilter={stateFilter}
          onRefresh={(callback) => {
            refreshDataTable.current = callback;
          }}
        />
      </div>

      {showModalStatus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Cambio de estado</h2>
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleCancelStatus}
              >
                <X />
              </button>
            </div>

            <hr className="mt-1 mb-4" />

            <p className="text-gray-600 font-medium">
              ¿Estás seguro de que deseas{" "}
              {lineaSelect?.status ? "desactivar" : "activar"} la línea:{" "}
              {lineaSelect?.name}?
            </p>

            <div className="flex justify-between items-center m-auto gap-5 mt-5">
              <Button
                onClick={handleCancelStatus}
                type="button"
                variant="outline"
                disabled={loadingStatus}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={changeStatusFn}
                disabled={loadingStatus}
              >
                {loadingStatus ? (
                  <div className="inline-flex gap-2">
                    <Loader2 className="animate-spin" />
                    Cambiando estado...
                  </div>
                ) : (
                  "Aceptar"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}