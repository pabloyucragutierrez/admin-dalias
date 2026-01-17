import { Loader2, Plus, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  activeOrInactiveSucursales,
  deleteSucursales,
} from "@/services/sucursales.service";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import type { Sucursales } from "@/interfaces/sucursales.interface";
import { DataTable } from "@/components/data-table";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function SucursalesPage() {
  const navigate = useNavigate();

  const [sucursalSelect, setSucursalSelect] = useState<Sucursales | null>(null);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const refreshDataTable = useRef<() => void>(null);

  const handleChangeStatus = async (sucursal: Sucursales) => {
    setShowModalStatus(true);
    setSucursalSelect(sucursal);
  };

  const handleEdit = async (sucursal: Sucursales) => {
    navigate(`/sucursales/${sucursal.id}`);
  };

  const handleDelete = async (sucursal: Sucursales) => {
    setShowModalDelete(true);
    setSucursalSelect(sucursal);
  };

  const changeStatusFn = async () => {
    setLoadingStatus(true);

    const response = await activeOrInactiveSucursales(
      sucursalSelect?.id || "",
      {
        status: !sucursalSelect?.status,
      }
    );

    setLoadingStatus(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: "top-center" });
      return;
    }

    toast.success(response?.message, { position: "top-center" });

    refreshDataTable.current?.();
    handleCancelStatus();
  };

  const deleteFn = async () => {
    setLoadingDelete(true);

    const response = await deleteSucursales(sucursalSelect?.id || "");

    setLoadingDelete(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: "top-center" });
      return;
    }

    toast.success(response?.message, { position: "top-center" });
    refreshDataTable.current?.();
    handleCancelDelete();
  };

  const handleCancelStatus = () => {
    setShowModalStatus(false);
    setSucursalSelect(null);
  };

  const handleCancelDelete = () => {
    setShowModalDelete(false);
    setSucursalSelect(null);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-[#003e5c] font-bold">Sucursales</h1>
        <Button
          className="bg-[#003e5c] flex flex-row items-center gap-2 text-white hover:bg-[#003e5c]"
          onClick={() => navigate("/sucursales/new")}
        >
          <Plus size={20} />
          Nueva Sucursal
        </Button>
      </div>

      <div className="container mx-auto py-5">
        <DataTable
          columns={getColumns(handleChangeStatus, handleEdit, handleDelete)}
          columnNames={columnNames}
          url={`/sucursales/byBusiness/5271c6b9-9280-4ca3-aef1-8543dce8dbe0`}
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
              {sucursalSelect?.status ? "desactivar" : "activar"} la sucursal:{" "}
              {sucursalSelect?.name}?
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

      {showModalDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Eliminar sucursal</h2>
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleCancelDelete}
              >
                <X />
              </button>
            </div>

            <hr className="mt-1 mb-4" />

            <p className="text-gray-600 font-medium">
              ¿Estás seguro de que deseas eliminar la sucursal:{" "}
              {sucursalSelect?.name}?
            </p>

            <div className="flex justify-between items-center m-auto gap-5 mt-5">
              <Button
                onClick={handleCancelDelete}
                type="button"
                variant="outline"
                disabled={loadingDelete}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={deleteFn}
                disabled={loadingDelete}
                variant="destructive"
              >
                {loadingDelete ? (
                  <div className="inline-flex gap-2">
                    <Loader2 className="animate-spin" />
                    Eliminando...
                  </div>
                ) : (
                  "Eliminar"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
