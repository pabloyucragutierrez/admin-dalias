import { Loader2, Plus, X } from 'lucide-react';
import { useMarcas } from '@/hooks/use-marcas';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { activeOrInactiveMarcas, createMarcas, updateMarcas } from '@/services/marcas.service';
import { toast } from 'sonner';
import type { Marcas, MarcasDto } from '@/interfaces/marcas.interface';
import MarcasTable from './ui/marcas-table';

interface FormInputs {
  code: string;
  name: string;
}

export default function MarcasPage() {
  const {
    marcas,
    loading,
    error,
    hasMore,
    fetchMoreMarcas,
    selectedMarcas,
    toggleMarcaSelection,
    selectAllMarcas,
    refreshMarcas,
  } = useMarcas();

  const [marcaSelect, setMarcaSelect] = useState<Marcas | null>(null);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

  const handleChangeStatus = async (marca: Marcas) => {
    setShowModalStatus(true);
    setMarcaSelect(marca);
  };

  const changeStatusFn = async () => {
    setLoadingStatus(true);

    const response = await activeOrInactiveMarcas(marcaSelect?.id || '', {
      status: !marcaSelect?.status,
    });

    setLoadingStatus(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    refreshMarcas();
    handleCancelStatus();
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      code: '',
      name: '',
    },
  });

  const handleEdit = async (marca: Marcas) => {
    setShowModal(true);
    reset({
      code: marca.code,
      name: marca.name,
    });
    setMarcaSelect(marca);
  };

  const onSubmit = async (values: FormInputs) => {
    const payload: MarcasDto = {
      code: values.code,
      name: values.name,
    };

    const response = marcaSelect?.id
      ? await updateMarcas(marcaSelect?.id, payload)
      : await createMarcas(payload);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    handleCancel();
    refreshMarcas();
  };

  const handleCancel = () => {
    setShowModal(false);
    setMarcaSelect(null);
    reset({
      code: '',
      name: '',
    });
  };

  const handleCancelStatus = () => {
    setShowModalStatus(false);
    setMarcaSelect(null);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Marcas</h1>
        <button
          type="button"
          className="bg-blue-600 flex flex-row items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Nueva Marca
        </button>
      </div>

      {selectedMarcas.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md flex flex-row items-center w-full justify-between mt-10">
          <p className="text-blue-800">
            {selectedMarcas.length} marca
            {selectedMarcas.length !== 1 ? 's' : ''} seleccionada
            {selectedMarcas.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <MarcasTable
        marcas={marcas}
        loading={loading}
        hasMore={hasMore}
        fetchMoreMarcas={fetchMoreMarcas}
        selectedMarcas={selectedMarcas}
        toggleMarcaSelection={toggleMarcaSelection}
        selectAllMarcas={selectAllMarcas}
        changeStatusFn={handleChangeStatus}
        editFn={handleEdit}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {marcaSelect ? 'Editar Marca' : 'Nueva Marca'}
              </h2>
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleCancel}
              >
                <X />
              </button>
            </div>

            <hr className="mt-1 mb-4" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col space-y-1 w-full">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Código de la marca"
                  {...register('code', {
                    required: 'Código es requerido',
                  })}
                />
                {errors.code && (
                  <p className="msg-error">{errors.code.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1 w-full">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre de la marca"
                  {...register('name', {
                    required: 'Nombre es requerido',
                  })}
                />
                {errors.name && (
                  <p className="msg-error">{errors.name.message}</p>
                )}
              </div>

              <div className="flex justify-between items-center m-auto gap-5 mt-5">
                <Button
                  onClick={handleCancel}
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="inline-flex gap-2">
                      <Loader2 className="animate-spin" />
                      Guardando...
                    </div>
                  ) : (
                    'Guardar'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              {marcaSelect?.status ? 'desactivar' : 'activar'} la marca:{' '}
              {marcaSelect?.name}?
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
    </>
  );
}