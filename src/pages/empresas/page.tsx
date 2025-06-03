import { Loader2, Plus, X } from 'lucide-react';
import { useEmpresas } from '@/hooks/use-empresas';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { activeOrInactiveEmpresas, deleteEmpresas } from '@/services/empresas.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import type { Empresa } from '@/interfaces/empresas.interface';
import FilterEmpresas from './ui/FilterEmpresas';
import EmpresasTable from './ui/EmpresasTable';

export default function EmpresasPage() {
  const navigate = useNavigate();
  const {
    empresas,
    loading,
    error,
    hasMore,
    fetchMoreEmpresas,
    selectedEmpresas,
    toggleEmpresaSelection,
    selectAllEmpresas,
    refreshEmpresas,
    applyFilters,
    clearFilters,
    filters,
  } = useEmpresas();

  const [empresaSelect, setEmpresaSelect] = useState<Empresa | null>(null);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const handleChangeStatus = async (empresa: Empresa) => {
    setShowModalStatus(true);
    setEmpresaSelect(empresa);
  };

  const handleDelete = async (empresa: Empresa) => {
    setShowModalDelete(true);
    setEmpresaSelect(empresa);
  };

  const changeStatusFn = async () => {
    setLoadingStatus(true);

    const response = await activeOrInactiveEmpresas(empresaSelect?.id || '', {
      status: !empresaSelect?.status,
    });

    setLoadingStatus(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    refreshEmpresas();
    handleCancelStatus();
  };

  const deleteFn = async () => {
    setLoadingDelete(true);

    const response = await deleteEmpresas(empresaSelect?.id || '');

    setLoadingDelete(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    refreshEmpresas();
    handleCancelDelete();
  };

  const handleCancelStatus = () => {
    setShowModalStatus(false);
    setEmpresaSelect(null);
  };

  const handleCancelDelete = () => {
    setShowModalDelete(false);
    setEmpresaSelect(null);
  };

  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Empresas</h1>
        <Button
          className="bg-blue-600 flex flex-row items-center gap-2 text-white hover:bg-blue-700"
          onClick={() => navigate('/empresas/new')}
        >
          <Plus size={20} />
          Nueva Empresa
        </Button>
      </div>

      <FilterEmpresas
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        initialFilters={filters}
        loading={loading}
      />

      {selectedEmpresas.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md flex flex-row items-center w-full justify-between mt-10">
          <p className="text-blue-800">
            {selectedEmpresas.length} empresa
            {selectedEmpresas.length !== 1 ? 's' : ''} seleccionada
            {selectedEmpresas.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <EmpresasTable
        empresas={empresas}
        loading={loading}
        hasMore={hasMore}
        fetchMoreEmpresas={fetchMoreEmpresas}
        selectedEmpresas={selectedEmpresas}
        toggleEmpresaSelection={toggleEmpresaSelection}
        selectAllEmpresas={selectAllEmpresas}
        changeStatusFn={handleChangeStatus}
        deleteFn={handleDelete}
      />

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
              ¿Estás seguro de que deseas{' '}
              {empresaSelect?.status ? 'desactivar' : 'activar'} a la empresa:{' '}
              {empresaSelect?.name}?
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
                  'Aceptar'
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
              <h2 className="text-lg font-bold">Eliminar empresa</h2>
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
              ¿Estás seguro de que deseas eliminar a la empresa:{' '}
              {empresaSelect?.name}?
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
                  'Eliminar'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}