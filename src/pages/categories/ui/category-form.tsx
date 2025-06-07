import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Categorias } from "@/interfaces";
import {
  createCategorias,
  fetchCategorias,
  updateCategorias,
} from "@/services/categorias.service";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface FormInputs {
  name: string;
  fatherId?: string;
}

interface CategoryFormProps {
  handleCancel: () => void;
  refreshDataTable: () => void;
  categoria?: Categorias;
}

export default function CategoryForm({
  handleCancel,
  refreshDataTable,
  categoria,
}: CategoryFormProps) {
  const [categories, setCategories] = useState<Categorias[]>([]);
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
      fatherId: "",
    },
  });

  const getCategories = async () => {
    setIsLoadingCategories(true);
    const response = await fetchCategorias();
    setCategories(response);
    setIsLoadingCategories(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (!isLoadingCategories && categoria && categories.length > 0) {
      reset({
        name: categoria.name || "",
        fatherId: categoria.fatherId || "",
      });
    }
  }, [isLoadingCategories, categoria, reset, categories]);

  const onSubmit = async (values: FormInputs) => {
    const response = categoria
      ? await updateCategorias(categoria.id, values)
      : await createCategorias(values);

    if (!response?.success) {
      toast.warning(response?.message, { position: "top-center" });
      return;
    }

    toast.success(response?.message, { position: "top-center" });
    handleCancel();
    refreshDataTable();
  };

  if (isLoadingCategories && categoria) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="animate-spin mr-2" />
        Cargando formulario...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col space-y-1 w-full">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          type="text"
          placeholder="Nombre de la categoria"
          {...register("name", {
            required: "Nombre es requerido",
          })}
        />
        {errors.name && <p className="msg-error">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col space-y-1 w-full">
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
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingCategories
                      ? "Cargando categorías..."
                      : "Seleccione un padre"
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-full">
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
          <p className="msg-error">{errors.fatherId.message}</p>
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
        <Button type="submit" disabled={isSubmitting || isLoadingCategories}>
          {isSubmitting ? (
            <div className="inline-flex gap-2">
              <Loader2 className="animate-spin" />
              Guardando...
            </div>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </form>
  );
}
