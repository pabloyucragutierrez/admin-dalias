import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCategorias, fetchCategorias, fetchCategoriaById, updateCategorias } from "@/services/categorias.service";
import { useNavigate, useParams } from "react-router";
import type { Categorias } from "@/interfaces";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

interface FormInputs {
  name: string;
  fatherId?: string;
}

export default function ManagementCategory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Categorias[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      name: "",
      fatherId: undefined,
    },
  });

  const getCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetchCategorias();
      setCategories(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error("Error al cargar las categorías: " + errorMessage, { position: "top-center" });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const getCategoryById = async (categoryId: string) => {
    setLoading(true);
    try {
      const response = await fetchCategoriaById(categoryId);
      reset({
        name: response.name || "",
        fatherId: response.fatherId || undefined,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error("Error al cargar la categoría: " + errorMessage, { position: "top-center" });
      navigate("/categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (id && id !== "new" && !isLoadingCategories) {
      getCategoryById(id);
    }
  }, [id, isLoadingCategories]);

  const onSubmit = async (values: FormInputs) => {
    try {
      const response = id && id !== "new"
        ? await updateCategorias(id, values)
        : await createCategorias(values);

      if (!response?.success) {
        toast.warning(response?.message, { position: "top-center" });
        return;
      }

      toast.success(response?.message, { position: "top-center" });
      navigate("/categorias");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error("Error al guardar la categoría: " + errorMessage, { position: "top-center" });
    }
  };

  const handleCancel = () => {
    navigate("/categorias");
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl text-blue-600 font-bold mb-8">
        {id && id !== "new" ? "Editar Categoría" : "Nueva Categoría"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Información de la Categoría</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre de la categoría"
                  className="w-full text-base py-2"
                  {...register("name", {
                    required: "Nombre es requerido",
                  })}
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="fatherId">Padre</Label>
                <Controller
                  name="fatherId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoadingCategories}
                    >
                      <SelectTrigger className="w-full text-base py-2">
                        <SelectValue
                          placeholder={
                            isLoadingCategories
                              ? "Cargando categorías..."
                              : "Seleccione un padre"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value="none">Ninguno</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.fatherId && (
                  <p className="text-red-600 text-sm">{errors.fatherId.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || isLoadingCategories}
              className="text-base py-2 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoadingCategories}
              className="text-base py-2 px-6"
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
        </form>
      )}
    </div>
  );
}