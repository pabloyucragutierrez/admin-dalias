import { Loader2, Plus, X } from 'lucide-react';
import { useUsers } from '@/hooks/use-users';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { activeOrInactiveUsers, deleteUsers } from '@/services/users.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import type { User } from '@/interfaces/users.interface';
import UsersTable from './ui/UsersTable';
import FilterUsers from './ui/FilterUsers';

export default function UsersPage() {
  const navigate = useNavigate();
  const {
    users,
    loading,
    error,
    hasMore,
    fetchMoreUsers,
    selectedUsers,
    toggleUserSelection,
    selectAllUsers,
    refreshUsers,
    applyFilters,
    clearFilters,
    filters,
  } = useUsers();

  const [userSelect, setUserSelect] = useState<User | null>(null);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const handleChangeStatus = async (user: User) => {
    setShowModalStatus(true);
    setUserSelect(user);
  };

  const handleDelete = async (user: User) => {
    setShowModalDelete(true);
    setUserSelect(user);
  };

  const changeStatusFn = async () => {
    setLoadingStatus(true);

    const response = await activeOrInactiveUsers(userSelect?.id || '', {
      status: !userSelect?.status,
    });

    setLoadingStatus(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    refreshUsers();
    handleCancelStatus();
  };

  const deleteFn = async () => {
    setLoadingDelete(true);

    const response = await deleteUsers(userSelect?.id || '');

    setLoadingDelete(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    refreshUsers();
    handleCancelDelete();
  };

  const handleCancelStatus = () => {
    setShowModalStatus(false);
    setUserSelect(null);
  };

  const handleCancelDelete = () => {
    setShowModalDelete(false);
    setUserSelect(null);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Usuarios</h1>
        <Button
          className="bg-blue-600 flex flex-row items-center gap-2 text-white hover:bg-blue-700"
          onClick={() => navigate('/users/new')}
        >
          <Plus size={20} />
          Nuevo Usuario
        </Button>
      </div>

      <FilterUsers
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        initialFilters={filters}
        loading={loading}
      />

      {selectedUsers.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md flex flex-row items-center w-full justify-between mt-10">
          <p className="text-blue-800">
            {selectedUsers.length} usuario
            {selectedUsers.length !== 1 ? 's' : ''} seleccionado
            {selectedUsers.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <UsersTable
        users={users}
        loading={loading}
        hasMore={hasMore}
        fetchMoreUsers={fetchMoreUsers}
        selectedUsers={selectedUsers}
        toggleUserSelection={toggleUserSelection}
        selectAllUsers={selectAllUsers}
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
              {userSelect?.status ? 'desactivar' : 'activar'} al usuario:{' '}
              {userSelect?.person.name} {userSelect?.person.lastName}?
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
              <h2 className="text-lg font-bold">Eliminar usuario</h2>
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
              ¿Estás seguro de que deseas eliminar al usuario:{' '}
              {userSelect?.person.name} {userSelect?.person.lastName}?
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
    </>
  );
}