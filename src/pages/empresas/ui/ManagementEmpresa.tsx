import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createEmpresas,
  fetchEmpresaById,
  updateEmpresas,
} from "@/services/empresas.service";
import { useNavigate, useParams } from "react-router";
import type { EmpresaDto } from "@/interfaces/empresas.interface";
import { geolocation } from "@/utils/geolocation";

interface District {
  id: number;
  name: string;
  parentId: number;
  level: number;
  identifier: string;
}

interface Province {
  id: number;
  name: string;
  children: District[];
}

interface Region {
  id: number;
  name: string;
  children: Province[];
}

interface FormInputs {
  name: string;
  ruc: string;
  razonSocial: string;
  regionId: string;
  provinceId: string;
  districtId: string;
  address: string;
  phone: string;
  email: string;
  description: string;
}

export default function ManagementEmpresa() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [availableProvinces, setAvailableProvinces] = useState<Province[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      name: "",
      ruc: "",
      razonSocial: "",
      regionId: "",
      provinceId: "",
      districtId: "",
      address: "",
      phone: "",
      email: "",
      description: "",
    },
  });

  const findDistrictByIdentifier = (identifier: string): District | null => {
    for (const region of geolocation.regions) {
      for (const province of region.children || []) {
        const district = province.children?.find(
          (d) => d.identifier === identifier
        );
        if (district) return district;
      }
    }
    return null;
  };

  const findProvinceById = (provinceId: number): Province | null => {
    for (const region of geolocation.regions) {
      const province = region.children?.find((p) => p.id === provinceId);
      if (province) return province;
    }
    return null;
  };

  const findRegionByProvinceId = (provinceId: number): Region | null => {
    for (const region of geolocation.regions) {
      if (region.children?.some((p) => p.id === provinceId)) {
        return region;
      }
    }
    return null;
  };

  useEffect(() => {
    if (id && id !== "new") {
      const loadEmpresa = async () => {
        setLoading(true);
        try {
          const empresa = await fetchEmpresaById(id);
          if (empresa) {
            let regionId = "";
            let provinceId = "";
            const districtId = empresa.district || "";

            if (districtId) {
              const district = findDistrictByIdentifier(districtId);
              if (district) {
                const province = findProvinceById(district.parentId);
                if (province) {
                  const region = findRegionByProvinceId(province.id);
                  if (region) {
                    regionId = region.id.toString();
                    provinceId = province.id.toString();
                    setSelectedRegion(region.id);
                    setAvailableProvinces(region.children || []);
                    setSelectedProvince(province.id);
                    setAvailableDistricts(province.children || []);
                    setValue("regionId", regionId);
                    setValue("provinceId", provinceId);
                    setValue("districtId", districtId);
                  }
                }
              }
            }

            reset({
              name: empresa.name,
              ruc: empresa.ruc,
              razonSocial: empresa.razonSocial,
              regionId,
              provinceId,
              districtId,
              address: empresa.address,
              phone: empresa.phone,
              email: empresa.email,
              description: empresa.description || "",
            });
          } else {
            toast.error("Error al cargar la empresa", {
              position: "top-center",
            });
            navigate("/empresas");
          }
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
          toast.error("Error al cargar la empresa: " + errorMessage, {
            position: "top-center",
          });
          navigate("/empresas");
        } finally {
          setLoading(false);
        }
      };
      loadEmpresa();
    }
  }, [id, reset, setValue, navigate]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value ? parseInt(e.target.value) : null;
    const region = geolocation.regions.find((r) => r.id === regionId);

    setSelectedRegion(regionId);
    setSelectedProvince(null);
    setAvailableProvinces(region?.children || []);
    setAvailableDistricts([]);
    setValue("provinceId", "");
    setValue("districtId", "");
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value ? parseInt(e.target.value) : null;
    const province = availableProvinces.find((p) => p.id === provinceId);

    setSelectedProvince(provinceId);
    setAvailableDistricts(province?.children || []);
    setValue("districtId", "");
  };

  const onSubmit = async (values: FormInputs) => {
    if (!values.districtId) {
      toast.warning("Debe seleccionar un distrito", { position: "top-center" });
      return;
    }

    const payload: EmpresaDto = {
      name: values.name,
      ruc: values.ruc,
      razonSocial: values.razonSocial,
      district: values.districtId,
      address: values.address,
      phone: values.phone,
      email: values.email,
      description: values.description || undefined,
    };

    try {
      const response =
        id && id !== "new"
          ? await updateEmpresas(id, payload)
          : await createEmpresas(payload);

      if (!response?.success) {
        toast.warning(response?.message, { position: "top-center" });
        return;
      }

      toast.success(response?.message, { position: "top-center" });
      navigate("/empresas");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error("Error al guardar la empresa: " + errorMessage, {
        position: "top-center",
      });
    }
  };

  const handleCancel = () => {
    navigate("/empresas");
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl text-blue-600 font-bold mb-6">
        {id && id !== "new" ? "Editar Empresa" : "Nueva Empresa"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* General Information Card */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Información General
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre de la empresa"
                  className="w-full text-base py-2"
                  {...register("name", {
                    required: "Nombre es requerido",
                  })}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="ruc">RUC</Label>
                <Input
                  id="ruc"
                  type="text"
                  placeholder="RUC"
                  className="w-full text-base py-2"
                  {...register("ruc", {
                    required: "RUC es requerido",
                    pattern: {
                      value: /^\d{11}$/,
                      message: "RUC debe tener 11 dígitos",
                    },
                  })}
                />
                {errors.ruc && (
                  <p className="text-red-600 text-sm">{errors.ruc.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2 md:col-span-2">
                <Label htmlFor="razonSocial">Razón Social</Label>
                <Input
                  id="razonSocial"
                  type="text"
                  placeholder="Razón Social"
                  className="w-full text-base py-2"
                  {...register("razonSocial", {
                    required: "Razón Social es requerida",
                  })}
                />
                {errors.razonSocial && (
                  <p className="text-red-600 text-sm">
                    {errors.razonSocial.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information Card */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Ubicación
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="regionId">Región</Label>
                <select
                  id="regionId"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("regionId", { required: "Región es requerida" })}
                  onChange={handleRegionChange}
                >
                  <option value="">Selecciona una región</option>
                  {geolocation.regions.map((region) => (
                    <option key={region.id} value={region.id.toString()}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.regionId && (
                  <p className="text-red-600 text-sm">
                    {errors.regionId.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="provinceId">Provincia</Label>
                <select
                  id="provinceId"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("provinceId", {
                    required: "Provincia es requerida",
                  })}
                  onChange={handleProvinceChange}
                  disabled={!selectedRegion}
                >
                  <option value="">Selecciona una provincia</option>
                  {availableProvinces.map((province) => (
                    <option key={province.id} value={province.id.toString()}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.provinceId && (
                  <p className="text-red-600 text-sm">
                    {errors.provinceId.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2 md:col-span-2">
                <Label htmlFor="districtId">Distrito</Label>
                <select
                  id="districtId"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("districtId", {
                    required: "Distrito es requerido",
                  })}
                  disabled={!selectedProvince}
                >
                  <option value="">Selecciona un distrito</option>
                  {availableDistricts.map((district) => (
                    <option
                      key={district.identifier}
                      value={district.identifier}
                    >
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.districtId && (
                  <p className="text-red-600 text-sm">
                    {errors.districtId.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2 md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Dirección"
                  className="w-full text-base py-2"
                  {...register("address", {
                    required: "Dirección es requerida",
                  })}
                />
                {errors.address && (
                  <p className="text-red-600 text-sm">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact and Description Card */}
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Contacto y Descripción
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Teléfono"
                  className="w-full text-base py-2"
                  {...register("phone", {
                    required: "Teléfono es requerido",
                    pattern: {
                      value: /^\d{9}$/,
                      message: "Teléfono debe tener exactamente 9 dígitos",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm">{errors.phone.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full text-base py-2"
                  {...register("email", {
                    required: "Email es requerido",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email inválido",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción (Opcional)</Label>
                <textarea
                  id="description"
                  placeholder="Descripción"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 h-[6rem]"
                  {...register("description")}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
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
