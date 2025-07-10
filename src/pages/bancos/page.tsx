import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { deleteBanco } from "@/services/banco.service";
import type { Banco } from "@/interfaces/bancos.interface";
import {
  columnFilter,
  columnNames,
  getColumns,
  stateFilter,
} from "./ui/columns";

export default function Bancos() {
  const navigate = useNavigate();
  const refreshDataTable = useRef<() => void>(() => {});
  const [bancoSelect, setBancoSelect] = useState<Banco | null>(null);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const handleEdit = (banco: Banco) => {
    navigate(`/bancos/${banco.id}`);
  };

  const handleDelete = (banco: Banco) => {
    setShowModalDelete(true);
    setBancoSelect(banco);
  };

  const deleteFn = async () => {
    setLoadingDelete(true);
    try {
      const response = await deleteBanco(bancoSelect?.id || "");
      if (!response.success) {
        toast.warning(response.message || "Error al eliminar el banco", {
          position: "top-center",
        });
        return;
      }
      toast.success("Banco eliminado exitosamente", { position: "top-center" });
      refreshDataTable.current?.();
      handleCancelDelete();
    } catch (error) {
      toast.error("Error al eliminar el banco", { position: "top-center" });
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setShowModalDelete(false);
    setBancoSelect(null);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Bancos</h1>
        <Button
          className="bg-blue-600 flex flex-row items-center gap-2 text-white hover:bg-blue-700"
          onClick={() => navigate("/bancos/new")}
        >
          <Plus size={20} />
          Nuevo Banco
        </Button>
      </div>
      <div className="container mx-auto py-5">
        <DataTable
          columns={getColumns(handleEdit, handleDelete)}
          columnNames={columnNames}
          url="banks"
          typeFilter={columnFilter}
          stateFilter={stateFilter}
          onRefresh={(callback) => {
            refreshDataTable.current = callback;
          }}
        />
      </div>
      {showModalDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Eliminar banco</h2>
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
              ¿Estás seguro de que deseas eliminar el banco: {bancoSelect?.namePerson}?
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