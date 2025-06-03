import { Loader2, Plus, X } from 'lucide-react';
import { useCategorias } from '@/hooks/use-categorias';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { activeOrInactiveCategorias, createCategorias, updateCategorias } from '@/services/categorias.service';
import { toast } from 'sonner';
import type { Categorias, CategoriasDto } from '@/interfaces/categorias.interface';
import CategoriasTable from './ui/categorias-table';
import FilterCategorias from './ui/FilterCategorias';
import api from '@/lib/api';

interface FormInputs {
  name: string;
  fatherId: string;
}

interface Categoria {
  id: string;
  name: string;
}

export default function CategoriasPage() {
  const {
    categorias,
    loading,
    error,
    hasMore,
    fetchMoreCategorias,
    selectedCategorias,
    toggleCategoriaSelection,
    selectAllCategorias,
    refreshCategorias,
    applyFilters,
    clearFilters,
    filters,
  } = useCategorias();

  const [categoriaSelect, setCategoriaSelect] = useState<Categorias | null>(null);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [categoriasList, setCategoriasList] = useState<Categoria[]>([]);
  const [loadingCategorias, setLoadingCategorias] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      setLoadingCategorias(true);
      try {
        const response = await api.get('/categorias/actives');
        setCategoriasList(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error al cargar las categorías', { position: 'top-center' });
      } finally {
        setLoadingCategorias(false);
      }
    };
    fetchCategorias();
  }, []);

  const handleChangeStatus = async (categoria: Categorias) => {
    setShowModalStatus(true);
    setCategoriaSelect(categoria);
  };

  const changeStatusFn = async () => {
    setLoadingStatus(true);

    const response = await activeOrInactiveCategorias(categoriaSelect?.id || '', {
      status: !categoriaSelect?.status,
    });

    setLoadingStatus(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    refreshCategorias();
    handleCancelStatus();
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      fatherId: '',
    },
  });

  const handleEdit = async (categoria: Categorias) => {
    setShowModal(true);
    reset({
      name: categoria.name,
      fatherId: categoria.fatherId || '',
    });
    setCategoriaSelect(categoria);
  };

  const onSubmit = async (values: FormInputs) => {
    const payload: CategoriasDto = {
      name: values.name,
      fatherId: values.fatherId || null,
    };

    const response = categoriaSelect?.id
      ? await updateCategorias(categoriaSelect?.id, payload)
      : await createCategorias(payload);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    handleCancel();
    refreshCategorias();
  };

  const handleCancel = () => {
    setShowModal(false);
    setCategoriaSelect(null);
    reset({
      name: '',
      fatherId: '',
    });
  };

  const handleCancelStatus = () => {
    setShowModalStatus(false);
    setCategoriaSelect(null);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Categorías</h1>
        <button
          type="button"
          className="bg-blue-600 flex flex-row items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Nueva Categoría
        </button>
      </div>

      <FilterCategorias
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        initialFilters={filters}
        loading={loading}
      />

      {selectedCategorias.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md flex flex-row items-center w-full justify-between mt-10">
          <p className="text-blue-800">
            {selectedCategorias.length} categoría
            {selectedCategorias.length !== 1 ? 's' : ''} seleccionada
            {selectedCategorias.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <CategoriasTable
        categorias={categorias}
        loading={loading}
        hasMore={hasMore}
        fetchMoreCategorias={fetchMoreCategorias}
        selectedCategorias={selectedCategorias}
        toggleCategoriaSelection={toggleCategoriaSelection}
        selectAllCategorias={selectAllCategorias}
        changeStatusFn={handleChangeStatus}
        editFn={handleEdit}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {categoriaSelect ? 'Editar Categoría' : 'Nueva Categoría'}
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
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre de la categoría"
                  {...register('name', {
                    required: 'Nombre es requerido',
                  })}
                />
                {errors.name && (
                  <p className="msg-error">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-1 w-full">
                <Label htmlFor="fatherId">Categoría Padre</Label>
                <select
                  id="fatherId"
                  {...register('fatherId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={loadingCategorias}
                >
                  <option value="">Ninguna</option>
                  {categoriasList.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </option>
                  ))}
                </select>
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
              {categoriaSelect?.status ? 'desactivar' : 'activar'} la categoría:{' '}
              {categoriaSelect?.name}?
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