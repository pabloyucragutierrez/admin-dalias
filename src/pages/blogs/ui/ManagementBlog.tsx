import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Blog, BlogPayload } from "@/interfaces/blog.interface";
import { createBlog, getBlogById, updateBlog } from "@/services/blog.service";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

interface FormInputs {
  titulo: string;
  descripcionCorta: string;
  descripcion: string;
}

export default function ManagementBlog() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState<boolean>(false);
  const [blogData, setBlogData] = useState<Blog | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      titulo: "",
      descripcionCorta: "",
      descripcion: "",
    },
  });

  const handleGetBlogById = useCallback(async () => {
    if (id && id !== "nuevo") {
      setLoading(true);
      const response = await getBlogById(id);

      if (!response) {
        toast.warning("Blog no encontrado", { position: "top-center" });
        navigate("/blogs");
        return;
      }

      setBlogData(response);
      setValue("titulo", response.titulo || "");
      setValue("descripcionCorta", response.descripcionCorta || "");
      setValue("descripcion", response.descripcion || "");
      setImagePreview(response.imagen || "");

      setLoading(false);
    }
  }, [id, navigate, setValue]);

  useEffect(() => {
    handleGetBlogById();
  }, [handleGetBlogById]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(blogData?.imagen || "");
  };

  const onSubmit = async (values: FormInputs) => {
    try {
      const payload: BlogPayload = {
        titulo: values.titulo,
        descripcionCorta: values.descripcionCorta,
        descripcion: values.descripcion,
      };

      if (imageFile) {
        payload.imagen = imageFile;
      }

      const response =
        id && id !== "nuevo"
          ? await updateBlog(id, payload)
          : await createBlog(payload);

      if (!response?.success) {
        toast.warning(response?.message, { position: "top-center" });
        return;
      }

      toast.success(
        id && id !== "nuevo"
          ? "Blog actualizado correctamente"
          : "Blog creado correctamente",
        { position: "top-center" }
      );

      navigate("/blogs");
    } catch (error) {
      console.log(error);
      toast.error("Error al guardar el blog", { position: "top-center" });
    }
  };

  const handleCancel = () => {
    navigate("/blogs");
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl text-[#003e5c] font-bold mb-6">
        {id && id !== "nuevo" ? "Editar Blog" : "Nuevo Blog"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 border rounded-lg p-6 bg-white shadow-lg"
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-[#003e5c]" />
          </div>
        ) : (
          <>
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="titulo">Título del Blog</Label>
              <Input
                id="titulo"
                type="text"
                placeholder="Título del blog"
                disabled={isSubmitting}
                className="w-full text-base py-2"
                {...register("titulo", {
                  required: "El título es requerido",
                })}
              />
              {errors.titulo && (
                <p className="text-red-600 text-sm ml-2">{errors.titulo.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="descripcionCorta">Descripción Corta</Label>
              <Input
                id="descripcionCorta"
                type="text"
                placeholder="Descripción corta del blog"
                disabled={isSubmitting}
                className="w-full text-base py-2"
                {...register("descripcionCorta", {
                  required: "La descripción corta es requerida",
                })}
              />
              {errors.descripcionCorta && (
                <p className="text-red-600 text-sm ml-2">
                  {errors.descripcionCorta.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="descripcion">Descripción</Label>
              <textarea
                id="descripcion"
                placeholder="Descripción completa del blog"
                disabled={isSubmitting}
                className="w-full text-base py-2 px-3 border border-gray-300 rounded-md min-h-[150px] focus:outline-none focus:ring-2 focus:ring-bg-[#003e5c]"
                {...register("descripcion", {
                  required: "La descripción es requerida",
                })}
              />
              {errors.descripcion && (
                <p className="text-red-600 text-sm ml-2">
                  {errors.descripcion.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="imagen">Imagen</Label>
              <div className="flex flex-col gap-4">
                {imagePreview ? (
                  <div className="relative w-full max-w-md">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">No hay imagen</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Input
                    id="imagen"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("imagen")?.click()}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    <ImagePlus size={20} />
                    {imagePreview ? "Cambiar Imagen" : "Seleccionar Imagen"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="text-base py-2 px-6 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-base py-2 px-6 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="inline-flex items-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" />
                    Guardando...
                  </div>
                ) : (
                  "Guardar"
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}