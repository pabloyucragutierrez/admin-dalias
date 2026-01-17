import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Blog } from "@/interfaces/blog.interface";
import { Edit, Loader2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { deleteBlog, getBlogs } from "@/services/blog.service";

export default function BlogsPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [blogSelect, setBlogSelect] = useState<Blog | null>(null);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const fetchBlogs = async () => {
    setLoading(true);
    const response = await getBlogs();
    if (response) {
      setBlogs(response);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = (blog: Blog) => {
    setShowModalDelete(true);
    setBlogSelect(blog);
  };

  const deleteFn = async () => {
    setLoadingDelete(true);

    const response = await deleteBlog(blogSelect?.id.toString() || "");

    setLoadingDelete(false);

    if (!response?.success) {
      toast.warning(response?.message || "Error al eliminar blog", {
        position: "top-center",
      });
      return;
    }

    toast.success("Blog eliminado correctamente", { position: "top-center" });
    fetchBlogs();
    handleCancelDelete();
  };

  const handleCancelDelete = () => {
    setShowModalDelete(false);
    setBlogSelect(null);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-[#003e5c] font-bold">Blogs</h1>
        <Button
          className="bg-[#003e5c] flex flex-row items-center gap-2 text-white hover:bg-[#003e5c] cursor-pointer"
          onClick={() => navigate("/blogs/nuevo")}
        >
          <Plus size={20} />
          Nuevo Blog
        </Button>
      </div>

      <div className="container mx-auto py-5">
        <div className="overflow-hidden shadow-md sm:rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin h-8 w-8 text-[#003e5c]" />
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f0f0f0] sticky top-0">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Imagen
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Título
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Descripción Corta
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Autor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      Estado
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
                  {blogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        No hay blogs registrados
                      </td>
                    </tr>
                  ) : (
                    blogs.map((blog) => (
                      <tr key={blog.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={blog.imagen}
                            alt={blog.titulo}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {blog.titulo}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {blog.descripcionCorta}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {blog.user.nombre} {blog.user.apellido}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              blog.estado === "activo" ? "success" : "secondary"
                            }
                          >
                            {blog.estado.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-row items-center gap-2">
                            <button
                              type="button"
                              className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                              onClick={() => navigate(`/blogs/${blog.id}`)}
                            >
                              <Edit size={20} className="text-blue-500" />
                            </button>
                            <button
                              type="button"
                              className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                              onClick={() => handleDelete(blog)}
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
              <h2 className="text-lg font-bold">Eliminar Blog</h2>
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
              ¿Estás seguro de que deseas eliminar el blog:{" "}
              <span className="font-bold">{blogSelect?.titulo}</span>?
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