import { Button } from "@/components/ui/button";
import { Edit, Loader2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { deleteUser, getUsers } from "@/services/user.service";
import type { User } from "@/interfaces/user.interface";

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userSelect, setUserSelect] = useState<User | null>(null);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await getUsers();
    if (response) {
      setUsers(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (user: User) => {
    setShowModalDelete(true);
    setUserSelect(user);
  };

  const deleteFn = async () => {
    setLoadingDelete(true);

    const response = await deleteUser(userSelect?.id.toString() || "");

    setLoadingDelete(false);

    if (!response?.success) {
      toast.warning(response?.message || "Error al eliminar usuario", {
        position: "top-center",
      });
      return;
    }

    toast.success("Usuario eliminado correctamente", { position: "top-center" });
    fetchUsers();
    handleCancelDelete();
  };

  const handleCancelDelete = () => {
    setShowModalDelete(false);
    setUserSelect(null);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-[#003e5c] font-bold">Usuarios</h1>
        <Button
          className="bg-[#003e5c] flex flex-row items-center gap-2 text-white hover:bg-[#003e5c] cursor-pointer"
          onClick={() => navigate("/usuarios/nuevo")}
        >
          <Plus size={20} />
          Nuevo Usuario
        </Button>
      </div>

      <div className="container mx-auto py-5">
        <div className="overflow-hidden shadow-md sm:rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin h-8 w-8 text-[#003e5c]" />
            </div>
          ) : (
            <div className="overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f0f0f0] sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Apellido
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {user.nombre}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {user.apellido}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-row items-center gap-2">
                            <button
                              type="button"
                              className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                              onClick={() => navigate(`/usuarios/${user.id}`)}
                            >
                              <Edit size={20} className="text-blue-500" />
                            </button>
                            <button
                              type="button"
                              className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                              onClick={() => handleDelete(user)}
                            >
                              <Trash2 size={20} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModalDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Eliminar Usuario</h2>
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
              ¿Estás seguro de que deseas eliminar al usuario:{" "}
              <span className="font-bold">{userSelect?.username}</span>?
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