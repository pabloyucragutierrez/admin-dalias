import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Select from "react-select";
import { billeteras, entidades_financieras } from "@/utils/data";
import type { Banco } from "@/interfaces/bancos.interface";
import { createBanco, getBancoById, updateBanco } from "@/services/banco.service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormInputs {
  tipoBanco: { value: string; label: string } | null;
  nombrePersona: string;
  ahorroSoles?: string;
  cciSoles?: string;
  ahorroDolares?: string;
  cciDolares?: string;
  telefono?: string;
  qrImage?: File | null;
}

export default function BancosForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [banco, setBanco] = useState<Banco | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      tipoBanco: null,
      nombrePersona: "",
      ahorroSoles: "",
      cciSoles: "",
      ahorroDolares: "",
      cciDolares: "",
      telefono: "",
      qrImage: null,
    },
  });

  const selectedEntidad = watch("tipoBanco");
  const isBilletera = selectedEntidad && billeteras.includes(selectedEntidad.value);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleGetBancoById = useCallback(async () => {
    if (id && id !== "new") {
      setLoading(true);
      try {
        const response = await getBancoById(id);
        if (!response) {
          toast.warning("Banco no encontrado", { position: "top-center" });
          navigate("/bancos");
          return;
        }
        setBanco(response);
        reset({
          tipoBanco: entidades_financieras.includes(response.typeBank)
            ? { value: response.typeBank, label: response.typeBank }
            : null,
          nombrePersona: response.namePerson || "",
          ahorroSoles: response.ahorroSoles || "",
          cciSoles: response.cciSoles || "",
          ahorroDolares: response.ahorroDolares || "",
          cciDolares: response.cciDolares || "",
          telefono: response.phone || "",
        });
        if (response.imageURL) setPreview(response.imageURL);
      } catch (error) {
        toast.error("Error al cargar el banco", { position: "top-center" });
        navigate("/bancos");
      } finally {
        setLoading(false);
      }
    }
  }, [id, navigate, reset]);

  useEffect(() => {
    handleGetBancoById();
  }, [handleGetBancoById]);

  const handleCancel = () => {
    navigate("/bancos");
  };

  const validateMonto = (value: string | undefined) => {
    if (!value) return "El monto es requerido";
    const num = parseFloat(value);
    return (!isNaN(num) && value.length >= 10) || "El monto debe tener mínimo 10 dígitos";
  };

  const validateMontoOpcional = (value: string | undefined) => {
    if (!value) return true;
    const num = parseFloat(value);
    return (!isNaN(num) && value.length >= 10) || "El monto debe tener mínimo 10 dígitos";
  };

  const validateCCI = (value: string | undefined) => {
    if (!value) return "El CCI es requerido";
    return /^\d{20}$/.test(value) || "El CCI debe tener exactamente 20 dígitos";
  };

  const validateCCIOpcional = (value: string | undefined) => {
    if (!value) return true;
    return /^\d{20}$/.test(value) || "El CCI debe tener exactamente 20 dígitos";
  };

  const validateTelefono = (value: string | undefined) => {
    if (!value) return "El teléfono es requerido";
    return /^[0-9]{9}$/.test(value) || "El teléfono debe tener exactamente 9 dígitos";
  };

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("typeBank", data.tipoBanco?.value || "");
      payload.append("namePerson", data.nombrePersona);
      if (isBilletera) {
        payload.append("phone", data.telefono || "");
        if (selectedImage) {
          payload.append("file", selectedImage);
        }
      } else {
        payload.append("ahorroSoles", data.ahorroSoles || "");
        payload.append("cciSoles", data.cciSoles || "");
        payload.append("ahorroDolares", data.ahorroDolares || "");
        payload.append("cciDolares", data.cciDolares || "");
        payload.append("phone", "");
      }
      const response = banco
        ? await updateBanco(banco.id, payload)
        : await createBanco(payload);
      if (!response.success) {
        toast.warning(response.message || "Error al guardar el banco", {
          position: "top-center",
        });
        return;
      }
      toast.success(
        banco ? "Banco actualizado exitosamente" : "Banco creado exitosamente",
        { position: "top-center" }
      );
      navigate("/bancos");
    } catch (error) {
      toast.error("Error al guardar el banco", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const opcionesEntidades = entidades_financieras.map((entidad) => ({
    value: entidad,
    label: entidad,
  }));

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl text-[#003e5c] font-bold mb-6">
        {id && id !== "new" ? "Editar Banco" : "Nuevo Banco"}
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-[#003e5c]" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Información del Banco
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="tipoBanco">Entidad Financiera</Label>
                <Controller
                  control={control}
                  name="tipoBanco"
                  rules={{ required: "La entidad financiera es requerida" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={opcionesEntidades}
                      placeholder="Seleccione una entidad financiera"
                      classNamePrefix="react-select"
                      className={`border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.tipoBanco ? "border-red-500" : ""
                      }`}
                    />
                  )}
                />
                {errors.tipoBanco && (
                  <p className="text-red-600 text-sm">{errors.tipoBanco.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="nombrePersona">Nombre de la Persona</Label>
                <Input
                  id="nombrePersona"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  className={`w-full text-base py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nombrePersona ? "border-red-500" : ""
                  }`}
                  {...register("nombrePersona", {
                    required: "El nombre es requerido",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Solo se permiten letras y espacios",
                    },
                    minLength: {
                      value: 2,
                      message: "Debe tener al menos 2 caracteres",
                    },
                  })}
                />
                {errors.nombrePersona && (
                  <p className="text-red-600 text-sm">{errors.nombrePersona.message}</p>
                )}
              </div>
            </div>
            {isBilletera ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="text"
                    placeholder="Ej: 987654321"
                    maxLength={9}
                    className={`w-full text-base py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.telefono ? "border-red-500" : ""
                    }`}
                    {...register("telefono", {
                      required: "El teléfono es requerido",
                      validate: validateTelefono,
                    })}
                  />
                  {errors.telefono && (
                    <p className="text-red-600 text-sm">{errors.telefono.message}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="qrImage">Código QR (Opcional)</Label>
                  {preview && (
                    <img
                      src={preview}
                      alt="QR Preview"
                      className="h-20 w-20 object-contain rounded-md mb-2"
                    />
                  )}
                  <Input
                    id="qrImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-[#003e5c] hover:file:bg-blue-100"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="ahorroSoles">Ahorro en Soles</Label>
                  <Input
                    id="ahorroSoles"
                    type="text"
                    placeholder="Ej: 23232323232"
                    className={`w-full text-base py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.ahorroSoles ? "border-red-500" : ""
                    }`}
                    {...register("ahorroSoles", {
                      required: "El ahorro en soles es requerido",
                      validate: validateMonto,
                    })}
                  />
                  {errors.ahorroSoles && (
                    <p className="text-red-600 text-sm">{errors.ahorroSoles.message}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="cciSoles">CCI en Soles</Label>
                  <Input
                    id="cciSoles"
                    type="text"
                    placeholder="Ej: 00212345678901234567"
                    maxLength={20}
                    className={`w-full text-base py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cciSoles ? "border-red-500" : ""
                    }`}
                    {...register("cciSoles", {
                      required: "El CCI en soles es requerido",
                      validate: validateCCI,
                    })}
                  />
                  {errors.cciSoles && (
                    <p className="text-red-600 text-sm">{errors.cciSoles.message}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="ahorroDolares">Ahorro en Dólares (Opcional)</Label>
                  <Input
                    id="ahorroDolares"
                    type="text"
                    placeholder="Ej: 2323232324"
                    className={`w-full text-base py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.ahorroDolares ? "border-red-500" : ""
                    }`}
                    {...register("ahorroDolares", {
                      validate: validateMontoOpcional,
                    })}
                  />
                  {errors.ahorroDolares && (
                    <p className="text-red-600 text-sm">{errors.ahorroDolares.message}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="cciDolares">CCI en Dólares (Opcional)</Label>
                  <Input
                    id="cciDolares"
                    type="text"
                    placeholder="Ej: 00212345678901234568"
                    maxLength={20}
                    className={`w-full text-base py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.cciDolares ? "border-red-500" : ""
                    }`}
                    {...register("cciDolares", {
                      validate: validateCCIOpcional,
                    })}
                  />
                  {errors.cciDolares && (
                    <p className="text-red-600 text-sm">{errors.cciDolares.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting || loading}
              className="text-base py-2 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="text-base py-2 px-6 bg-[#003e5c] hover:bg-[#003e5c] text-white"
            >
              {isSubmitting || loading ? (
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