import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createCategorias, fetchCategoriaById, updateCategorias } from "@/services/categorias.service";
import { fetchActiveLineas } from "@/services/lineas.service";
import { useNavigate, useParams } from "react-router";
import type { Categorias } from "@/interfaces/categorias.interface";
import type { Linea } from "@/interfaces/lineas.interface";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { typeEcommerce } from "@/utils/data";

interface FormData {
  linea: string;
  name: string;
  typeEcommerce: string;
  margen: number;
  origen: { nombre: string }[];
  children: {
    categoria: string;
    subfamilias: { nombre: string }[];
  }[];
}

export default function ManagementCategory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lineas, setLineas] = useState<Linea[]>([]);

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      linea: "",
      name: "",
      typeEcommerce: "",
      margen: 0,
      origen: [{ nombre: "" }],
      children: [{ categoria: "", subfamilias: [{ nombre: "" }] }],
    },
    mode: "onChange",
  });

  const { fields: familiaFields, append: appendFamilia, remove: removeFamilia } = useFieldArray({
    control,
    name: "children",
  });

  const { fields: origenFields, append: appendOrigen, remove: removeOrigen } = useFieldArray({
    control,
    name: "origen",
  });

  const loadLineas = async () => {
    try {
      const activeLineas = await fetchActiveLineas();
      setLineas(activeLineas);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar las líneas";
      toast.error(errorMessage, { position: "top-center" });
    }
  };

  const getCategoryById = async (categoryId: string) => {
    setLoading(true);
    try {
      const response: Categorias = await fetchCategoriaById(categoryId);
      reset({
        linea: response.lineasId || "",
        typeEcommerce: response.typeEcommerce || "",
        name: response.name || "",
        margen: response.margen || 0,
        origen: response.origen?.split(",").map((origen) => ({ nombre: origen.trim() })) || [{ nombre: "" }],
        children: response.children?.map((familia) => ({
          categoria: familia.name,
          subfamilias: familia.children?.map((subfamilia) => ({ nombre: subfamilia.name })) || [
            { nombre: "" },
          ],
        })) || [{ categoria: "", subfamilias: [{ nombre: "" }] }],
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar la Familia";
      toast.error(errorMessage, { position: "top-center" });
      navigate("/categorias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLineas();
    if (id && id !== "new") {
      getCategoryById(id);
    }
  }, [id]);

  const onSubmit = async (values: FormData) => {
    try {
      const payload = {
        linea: values.linea || "",
        name: values.name,
        typeEcommerce: values.typeEcommerce || "",
        margen: values.margen || 0,
        origen: values.origen.map((origen) => origen.nombre).join(","),
        familia: values.children.map((familia) => ({
          name: familia.categoria,
          id: "", // Backend generará IDs para nuevas familias
          subfamilia: familia.subfamilias
            .filter((subfamilia) => subfamilia.nombre.trim() !== "")
            .map((subfamilia) => ({
              name: subfamilia.nombre,
              id: "", // Backend generará IDs para nuevas subfamilias
            })),
        })),
      };
      const response = id && id !== "new"
        ? await updateCategorias(id, payload)
        : await createCategorias(payload);

      if (!response?.success) {
        toast.warning(response?.message, { position: "top-center" });
        return;
      }

      toast.success(response?.message, { position: "top-center" });
      navigate("/categorias");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al guardar la Familia";
      toast.error(errorMessage, { position: "top-center" });
    }
  };

  const handleCancel = () => {
    navigate("/categorias");
  };

  return (
    <div className="w-full mx-auto sm:p-6 p-0">
      <h1 className="text-3xl font-bold text-blue-600 mb-8">
        {id && id !== "new" ? "Editar Marca" : "Nueva Marca"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Información de la Familia Card */}
          <div className="border rounded-lg p-6 bg-white shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Información de la Marca</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="linea">Línea</Label>
                <select
                  id="linea"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("linea", {
                    required: "Línea es requerida",
                  })}
                >
                  <option value="">Selecciona una línea</option>
                  {lineas.map((linea) => (
                    <option key={linea.id} value={linea.id}>
                      {linea.name}
                    </option>
                  ))}
                </select>
                {errors.linea && <p className="text-red-500 text-sm">{errors.linea.message}</p>}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Marca</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre de la marca"
                  className="w-full text-base py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  {...register("name", {
                    required: "Marca es requerida",
                  })}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="typeEcommerce">Tipo de Ecommerce</Label>
                <select
                  id="typeEcommerce"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("typeEcommerce", {
                    required: "Tipo de Ecommerce es requerido",
                  })}
                >
                  <option value="">Selecciona un tipo de ecommerce</option>
                  {typeEcommerce.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.typeEcommerce && <p className="text-red-500 text-sm">{errors.typeEcommerce.message}</p>}
              </div>

              <div className="flex flex-col space-y-2">
                <Label htmlFor="margen">Margen</Label>
                <Input
                  id="margen"
                  type="number"
                  placeholder="Margen de la marca"
                  className="w-full text-base py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  max="100"
                  {...register("margen", {
                    required: "Margen es requerido",
                    min: { value: 0, message: "Margen no puede ser negativo" },
                    max: { value: 100, message: "Margen no puede ser mayor a 100" },
                    valueAsNumber: true,
                  })}
                />
                {errors.margen && <p className="text-red-500 text-sm">{errors.margen.message}</p>}
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-white shadow-md">
            <div className="flex flex-row justify-between gap-2 sm:gap-0 items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Lista de Origenes</h2>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendOrigen({ nombre: "" })}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Origen
                </Button>
            </div>
             
              {origenFields.map((origen, origenIndex) => (
                <div key={origen.id} className="mb-6 p-4 border rounded-md bg-white relative">
                  <div className="flex flex-row justify-between gap-2 sm:gap-0 items-center mb-4">
                    <Label htmlFor={`origen.${origenIndex}.nombre`}>Origen {origenIndex + 1}</Label>
                    {origenIndex > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeOrigen(origenIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 mb-4">
                    <Input
                      id={`origen.${origenIndex}.nombre`}
                      type="text"
                      placeholder="Nombre del Origen"
                      className="w-full text-base py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      {...register(`origen.${origenIndex}.nombre`, {
                        required: `Origen ${origenIndex + 1} es requerido`,
                      })}
                    />
                    {errors.origen?.[origenIndex]?.nombre && (
                      <p className="text-red-500 text-sm">
                        {errors.origen[origenIndex].nombre?.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}

          </div>

          {/* Lista de Familias Card */}
          <div className="border rounded-lg p-6 bg-white shadow-md">
            <div className="flex flex-row justify-between gap-2 sm:gap-0 items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Lista de Familias</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() => appendFamilia({ categoria: "", subfamilias: [{ nombre: "" }] })}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar Familia
              </Button>
            </div>

            {familiaFields.map((familia, familiaIndex) => (
              <div key={familia.id} className="mb-6 p-4 border rounded-md bg-white relative">
                <div className="flex flex-row justify-between gap-2 sm:gap-0 items-center mb-4">
                  <Label htmlFor={`children.${familiaIndex}.categoria`}>Familia {familiaIndex + 1}</Label>
                  {familiaIndex > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeFamilia(familiaIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-col space-y-2 mb-4">
                  <Input
                    id={`children.${familiaIndex}.categoria`}
                    type="text"
                    placeholder={`Nombre de la Familia ${familiaIndex + 1}`}
                    className="w-full text-base py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    {...register(`children.${familiaIndex}.categoria`, {
                      required: `Familia ${familiaIndex + 1} es requerida`,
                    })}
                  />
                  {errors.children?.[familiaIndex]?.categoria && (
                    <p className="text-red-500 text-sm">
                      {errors.children[familiaIndex].categoria?.message}
                    </p>
                  )}
                </div>

                <Subfamilias
                  control={control}
                  familiaIndex={familiaIndex}
                  register={register}
                  errors={errors}
                />
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-base py-2 px-6 border-gray-300 hover:bg-gray-100 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-base py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
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

interface SubfamiliasProps {
  control: any;
  familiaIndex: number;
  register: any;
  errors: any;
}

function Subfamilias({ control, familiaIndex, register, errors }: SubfamiliasProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `children.${familiaIndex}.subfamilias`,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between gap-2 sm:gap-0 items-center mb-6">
        <Label>Subfamilias</Label>
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ nombre: "" })}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Subfamilia
        </Button>
      </div>
      {fields.map((subfamilia, subfamiliaIndex) => (
        <div key={subfamilia.id} className="space-y-2">
          <div className="flex flex-row justify-between gap-2 sm:gap-0 items-center">
            <Label
              htmlFor={`children.${familiaIndex}.subfamilias.${subfamiliaIndex}.nombre`}
              className="text-sm font-medium text-gray-700"
            >
              Subfamilia {subfamiliaIndex + 1}
            </Label>
            {fields.length > 1 && subfamiliaIndex !== 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(subfamiliaIndex)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
          <Input
            id={`children.${familiaIndex}.subfamilias.${subfamiliaIndex}.nombre`}
            type="text"
            placeholder={`Nombre de la subfamilia ${subfamiliaIndex + 1}`}
            className="w-full text-base py-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            {...register(`children.${familiaIndex}.subfamilias.${subfamiliaIndex}.nombre`)}
          />
          {errors.children?.[familiaIndex]?.subfamilias?.[subfamiliaIndex]?.nombre && (
            <p className="text-red-500 text-sm">
              {errors.children[familiaIndex].subfamilias[subfamiliaIndex].nombre?.message}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}