import { Loader2, Plus, X } from 'lucide-react';
import { useRoles } from '@/hooks/use-roles';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { activeOrInactiveRoles, createRoles, updateRoles } from '@/services/roles.service';
import { toast } from 'sonner';
import type { Roles, RolesDto } from '@/interfaces/roles.interface';
import RolesTable from './ui/roles-table';

interface FormInputs {
  name: string;
}

export default function RolesPage() {
  const {
    roles,
    loading,
    error,
    hasMore,
    fetchMoreRoles,
    selectedRoles,
    toggleRolSelection,
    selectAllRoles,
    refreshRoles,
  } = useRoles();

  const [rolSelect, setRolSelect] = useState<Roles | null>(null);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

  const handleChangeStatus = async (rol: Roles) => {
    setShowModalStatus(true);
    setRolSelect(rol);
  };

  const changeStatusFn = async () => {
    setLoadingStatus(true);

    const response = await activeOrInactiveRoles(rolSelect?.id || '', {
      status: !rolSelect?.status,
    });

    setLoadingStatus(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    refreshRoles();
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
    },
  });

  const handleEdit = async (rol: Roles) => {
    setShowModal(true);
    reset({
      name: rol.name,
    });
    setRolSelect(rol);
  };

  const onSubmit = async (values: FormInputs) => {
    const payload: RolesDto = {
      name: values.name,
    };

    const response = rolSelect?.id
      ? await updateRoles(rolSelect?.id, payload)
      : await createRoles(payload);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    handleCancel();
    refreshRoles();
  };

  const handleCancel = () => {
    setShowModal(false);
    setRolSelect(null);
    reset({
      name: '',
    });
  };

  const handleCancelStatus = () => {
    setShowModalStatus(false);
    setRolSelect(null);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Roles</h1>
        <button
          type="button"
          className="bg-blue-600 flex flex-row items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} />
          Nuevo Rol
        </button>
      </div>

      {selectedRoles.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md flex flex-row items-center w-full justify-between mt-10">
          <p className="text-blue-800">
            {selectedRoles.length} rol
            {selectedRoles.length !== 1 ? 'es' : ''} seleccionado
            {selectedRoles.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <RolesTable
        roles={roles}
        loading={loading}
        hasMore={hasMore}
        fetchMoreRoles={fetchMoreRoles}
        selectedRoles={selectedRoles}
        toggleRolSelection={toggleRolSelection}
        selectAllRoles={selectAllRoles}
        changeStatusFn={handleChangeStatus}
        editFn={handleEdit}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {rolSelect ? 'Editar Rol' : 'Nuevo Rol'}
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
                  placeholder="Nombre del rol"
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
              {rolSelect?.status ? 'desactivar' : 'activar'} el rol:{' '}
              {rolSelect?.name}?
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