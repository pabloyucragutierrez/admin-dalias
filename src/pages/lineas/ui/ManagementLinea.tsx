import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useNavigate, useParams } from "react-router";
import type { LineaDto } from "@/interfaces/lineas.interface";
import { createLineas, fetchLineaById, updateLineas } from "@/services/lineas.service";

interface FormInputs {
  name: string;
}

export default function ManagementLinea() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (id && id !== "new") {
      const loadLinea = async () => {
        setLoading(true);
        try {
          const linea = await fetchLineaById(id);
          if (linea) {
            reset({
              name: linea.name,
            });
          } else {
            toast.error("Error al cargar la línea", {
              position: "top-center",
            });
            navigate("/lineas");
          }
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
          toast.error("Error al cargar la línea: " + errorMessage, {
            position: "top-center",
          });
          navigate("/lineas");
        } finally {
          setLoading(false);
        }
      };
      loadLinea();
    }
  }, [id, reset, navigate]);

  const onSubmit = async (values: FormInputs) => {
    const payload: LineaDto = {
      name: values.name,
    };

    try {
      const response =
        id && id !== "new"
          ? await updateLineas(id, payload)
          : await createLineas(payload);

      if (!response?.success) {
        toast.warning(response?.message, { position: "top-center" });
        return;
      }

      toast.success(response?.message, { position: "top-center" });
      navigate("/lineas");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error("Error al guardar la línea: " + errorMessage, {
        position: "top-center",
      });
    }
  };

  const handleCancel = () => {
    navigate("/lineas");
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl text-[#003e5c] font-bold mb-6">
        {id && id !== "new" ? "Editar Línea" : "Nueva Línea"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-[#003e5c]" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Información General
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre de la línea"
                  className="w-full text-base py-2"
                  {...register("name", {
                    required: "Nombre es requerido",
                  })}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-base py-2 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
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