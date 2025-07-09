import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type { ShippingRate } from "@/interfaces/shipping-rate.interface";
import { geolocation } from "@/utils/geolocation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  regionId: string;
  provinceId: string;
  districtId: string;
  price: string;
}

let staticShippingRates: ShippingRate[] = [
  {
    id: "1",
    districtId: "lima_lima_miraflores",
    level: 3,
    price: "15.00",
    status: true,
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "2",
    districtId: "arequipa_arequipa",
    level: 2,
    price: "12.50",
    status: true,
    createdAt: "2025-01-02T12:00:00Z",
    updatedAt: "2025-01-02T12:00:00Z",
  },
  {
    id: "3",
    districtId: "1",
    level: 1,
    price: "10.00",
    status: false,
    createdAt: "2025-01-03T14:00:00Z",
    updatedAt: "2025-01-03T14:00:00Z",
  },
];

const ManagementShippingRate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [availableProvinces, setAvailableProvinces] = useState<Province[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  const [isLimaRegion, setIsLimaRegion] = useState<boolean>(false);
  const [isLimaProvince, setIsLimaProvince] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      regionId: "",
      provinceId: "",
      districtId: "",
      price: "",
    },
  });

  const findDistrictByIdentifier = (identifier: string): District | null => {
    for (const region of geolocation.regions) {
      for (const province of region.children || []) {
        const district = province.children?.find((d) => d.identifier === identifier);
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

  const findRegionById = (regionId: number): Region | null => {
    return geolocation.regions.find((r) => r.id === regionId) || null;
  };

  useEffect(() => {
    if (id && id !== "new") {
      setLoading(true);
      const rate = staticShippingRates.find((r) => r.id === id);
      if (!rate) {
        toast.error("Tarifa no encontrada", { position: "top-center" });
        navigate("/tarifas");
        return;
      }

      const district = findDistrictByIdentifier(rate.districtId);
      if (district) {
        const province = findProvinceById(district.parentId);
        if (province) {
          const region = findRegionByProvinceId(province.id);
          if (region) {
            setSelectedRegion(region.id);
            setIsLimaRegion(region.name === "Lima");
            setSelectedProvince(province.id);
            setIsLimaProvince(province.name === "Lima");
            setAvailableProvinces(region.children || []);
            setAvailableDistricts(province.children || []);
            setValue("regionId", region.id.toString());
            setValue("provinceId", province.id.toString());
            setValue("districtId", rate.districtId);
            setValue("price", rate.price);
          }
        }
      } else {
        const provinceIdMatch = rate.districtId.split('_').pop();
        const province = findProvinceById(parseInt(provinceIdMatch || rate.districtId));
        if (province) {
          const region = findRegionByProvinceId(province.id);
          if (region) {
            setSelectedRegion(region.id);
            setIsLimaRegion(region.name === "Lima");
            setSelectedProvince(province.id);
            setIsLimaProvince(province.name === "Lima");
            setAvailableProvinces(region.children || []);
            setAvailableDistricts(province.children || []);
            setValue("regionId", region.id.toString());
            setValue("provinceId", province.id.toString());
            setValue("districtId", "");
            setValue("price", rate.price);
          }
        } else {
          const region = findRegionById(parseInt(rate.districtId));
          if (region) {
            setSelectedRegion(region.id);
            setIsLimaRegion(region.name === "Lima");
            setAvailableProvinces(region.children || []);
            setAvailableDistricts([]);
            setValue("regionId", region.id.toString());
            setValue("provinceId", "");
            setValue("districtId", "");
            setValue("price", rate.price);
          }
        }
      }
      setLoading(false);
    }
  }, [id, setValue, navigate]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value ? parseInt(e.target.value) : null;
    const region = geolocation.regions.find((r) => r.id === regionId);

    setSelectedRegion(regionId);
    setSelectedProvince(null);
    setIsLimaRegion(region?.name === "Lima" || false);
    setIsLimaProvince(false);
    setAvailableProvinces(region?.children || []);
    setAvailableDistricts([]);
    setValue("provinceId", "");
    setValue("districtId", "");
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value ? parseInt(e.target.value) : null;
    const province = availableProvinces.find((p) => p.id === provinceId);

    setSelectedProvince(provinceId);
    setIsLimaProvince(province?.name === "Lima" || false);
    setAvailableDistricts(province?.children || []);
    setValue("districtId", "");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const identifier = e.target.value;
    const district = findDistrictByIdentifier(identifier);
  };

  const onSubmit = async (values: FormInputs) => {
    if (!values.regionId) {
      toast.warning("Debe seleccionar un departamento", { position: "top-center" });
      return;
    }
    if (isLimaRegion && !values.provinceId) {
      toast.warning("Debe seleccionar una provincia", { position: "top-center" });
      return;
    }
    if (isLimaRegion && isLimaProvince && !values.districtId) {
      toast.warning("Debe seleccionar un distrito", { position: "top-center" });
      return;
    }

    let districtId = values.regionId;
    let level = 1;

    if (isLimaRegion) {
      if (values.districtId && isLimaProvince) {
        districtId = values.districtId;
        const district = findDistrictByIdentifier(values.districtId);
        level = district ? district.level : 3;
      } else if (values.provinceId) {
        const province = findProvinceById(parseInt(values.provinceId));
        districtId = province
          ? `${province.name.toLowerCase().replace(/\s+/g, '_')}_${values.provinceId}`
          : values.provinceId;
        level = 2;
      }
    }

    const payload = {
      districtId,
      level,
      price: parseFloat(values.price),
    };

    setLoading(true);
    setTimeout(() => {
      if (id && id !== "new") {
        const index = staticShippingRates.findIndex((r) => r.id === id);
        if (index !== -1) {
          staticShippingRates[index] = {
            ...staticShippingRates[index],
            districtId: payload.districtId,
            level: payload.level,
            price: payload.price.toFixed(2),
            updatedAt: new Date().toISOString(),
          };
          toast.success("Tarifa actualizada exitosamente", { position: "top-center" });
        }
      } else {
        const newRate: ShippingRate = {
          id: `${staticShippingRates.length + 1}`,
          districtId: payload.districtId,
          level: payload.level,
          price: payload.price.toFixed(2),
          status: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        staticShippingRates.push(newRate);
        toast.success("Tarifa creada exitosamente", { position: "top-center" });
      }
      setLoading(false);
      navigate("/tarifas");
    }, 500);
  };

  const handleCancel = () => {
    navigate("/tarifas");
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl text-blue-600 font-bold mb-6">
        {id && id !== "new" ? "Editar Tarifa" : "Nueva Tarifa"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Información de Tarifa
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="regionId">Departamento *</Label>
                <select
                  id="regionId"
                  className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("regionId", { required: "Departamento es requerido" })}
                  onChange={(e) => {
                    register("regionId").onChange(e);
                    handleRegionChange(e);
                  }}
                >
                  <option value="">Selecciona un departamento</option>
                  {geolocation.regions.map((region) => (
                    <option key={region.id} value={region.id.toString()}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {errors.regionId && (
                  <p className="text-red-600 text-sm">{errors.regionId.message}</p>
                )}
              </div>
              {isLimaRegion && (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="provinceId">Provincia *</Label>
                  <select
                    id="provinceId"
                    className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    {...register("provinceId", {
                      required: isLimaRegion ? "Provincia es requerida" : false,
                    })}
                    onChange={(e) => {
                      register("provinceId").onChange(e);
                      handleProvinceChange(e);
                    }}
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
                    <p className="text-red-600 text-sm">{errors.provinceId.message}</p>
                  )}
                </div>
              )}
              {isLimaRegion && isLimaProvince && (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="districtId">Distrito *</Label>
                  <select
                    id="districtId"
                    className="border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    {...register("districtId", {
                      required: isLimaProvince ? "Distrito es requerido" : false,
                    })}
                    onChange={(e) => {
                      register("districtId").onChange(e);
                      handleDistrictChange(e);
                    }}
                    disabled={!selectedProvince}
                  >
                    <option value="">Selecciona un distrito</option>
                    {availableDistricts.map((district) => (
                      <option key={district.identifier} value={district.identifier}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {errors.districtId && (
                    <p className="text-red-600 text-sm">{errors.districtId.message}</p>
                  )}
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="price">Precio (S/) *</Label>
                <Input
                  id="price"
                  type="text"
                  placeholder="Ej: 10.50"
                  className="w-full text-base py-2"
                  {...register("price", {
                    required: "Precio es requerido",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: "Precio debe ser un número válido (ej: 10.50)",
                    },
                  })}
                />
                {errors.price && (
                  <p className="text-red-600 text-sm">{errors.price.message}</p>
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
};

export default ManagementShippingRate;