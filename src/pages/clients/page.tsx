import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react"; 
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { columnFilter, columnNames, getColumns, stateFilter } from "./ui/columns";
import type { Cliente } from "@/interfaces/client.interface";
import { toast } from "sonner";
import { activeOrInactiveClientes, activeOrInactiveClientesPrivate } from "@/services/client.service";
 
export default function Clients() { 
  const navigate = useNavigate();

  const [clientSelect, setClientSelect] = useState<Cliente | null>(null);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

  const [showModalPrivate, setShowModalPrivate] = useState<boolean>(false);

  const refreshDataTable = useRef<() => void>(null);
 
  const handleChangeStatus = async (client: Cliente) => {
    setShowModalStatus(true);
    setClientSelect(client);
  };

  const activeStatusPrivate = async (client: Cliente) => {
    setShowModalPrivate(true);
    setClientSelect(client);
  };

  const handleCancelStatus = () => {
    setShowModalStatus(false);
    setClientSelect(null);
  };

  const handleCancelPrivate = () => {
    setShowModalPrivate(false);
    setClientSelect(null);
  };

  const changeStatusFn = async () => {
    setLoadingStatus(true);

    const response = await activeOrInactiveClientes(clientSelect?.id || "", {
      status: !clientSelect?.status,
    });

    setLoadingStatus(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: "top-center" });
      return;
    }

    toast.success(response?.message, { position: "top-center" });

    refreshDataTable.current?.();
    handleCancelStatus();
  };

  const changePrivateFn = async () => {
    setLoadingStatus(true);

    const response = await activeOrInactiveClientesPrivate(clientSelect?.id || "", {
      status: !clientSelect?.statusPrivate,
    });

    setLoadingStatus(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: "top-center" });
      return;
    }

    toast.success(response?.message, { position: "top-center" });

    refreshDataTable.current?.();
    handleCancelPrivate();
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
          columns={getColumns(handleChangeStatus, activeStatusPrivate)}
          columnNames={columnNames}
          url="clients"
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
              {clientSelect?.status ? "desactivar" : "activar"} el cliente:{" "}
             {clientSelect?.typeDocument === 'DNI' ? clientSelect?.name : clientSelect?.razonSocial}?
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

      {showModalPrivate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Cambio de acceso a tienda privada</h2>
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleCancelPrivate}
              >
                <X />
              </button>
            </div>

            <hr className="mt-1 mb-4" />

            <p className="text-gray-600 font-medium">
              ¿Estás seguro de que deseas{" "}
              {clientSelect?.statusPrivate ? "desactivar" : "activar"} el acceso a la tienda privada del cliente:{" "}
              {clientSelect?.typeDocument === 'DNI' ? clientSelect?.name : clientSelect?.razonSocial}?
            </p>

            <div className="flex justify-between items-center m-auto gap-5 mt-5">
              <Button
                onClick={handleCancelPrivate}
                type="button"
                variant="outline"
                disabled={loadingStatus}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={changePrivateFn}
                disabled={loadingStatus}
              >
                {loadingStatus ? (
                  <div className="inline-flex gap-2">
                    <Loader2 className="animate-spin" />
                    Cambiando acceso a tienda privada...
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