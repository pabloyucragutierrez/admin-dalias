import React, { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type { ShippingRate } from "@/interfaces/shipping-rate.interface";
import { geolocation } from "@/utils/geolocation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getShippingRateById,
  createShippingRate,
  updateShippingRate,
} from "@/services/shipping-rate.service";

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

const ManagementShippingRate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const title = id === "new" ? "Nueva Tarifa" : "Editar Tarifa";
  const [loading, setLoading] = useState<boolean>(false);
  const [shippingRate, setShippingRate] = useState<ShippingRate | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
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

  const findRegionById = (regionId: number): Region | null => {
    return geolocation.regions.find((r) => r.id === regionId) || null;
  };

  const findRegionByProvinceId = (provinceId: number): Region | null => {
    for (const region of geolocation.regions) {
      if (region.children?.some((p) => p.id === provinceId)) {
        return region;
      }
    }
    return null;
  };

  const handleGetShippingRateById = useCallback(async () => {
    if (id && id !== "new") {
      setLoading(true);
      const response = await getShippingRateById(id);
      if (!response) {
        toast.warning("Tarifa no encontrada", { position: "top-center" });
        navigate("/tarifas");
        return;
      }

      setShippingRate(response);
      const district = findDistrictByIdentifier(response.districtId);
      if (district) {
        setSelectedLevel(district.level);
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
            setSelectedDistrict(response.districtId);
            reset({
              regionId: region.id.toString(),
              provinceId: province.id.toString(),
              districtId: response.districtId,
              price: response.price,
            });
          }
        }
      } else {
        const provinceIdMatch = response.districtId.split('_').pop();
        const province = findProvinceById(parseInt(provinceIdMatch || response.districtId));
        if (province) {
          const region = findRegionByProvinceId(province.id);
          if (region) {
            setSelectedRegion(region.id);
            setIsLimaRegion(region.name === "Lima");
            setSelectedProvince(province.id);
            setIsLimaProvince(province.name === "Lima");
            setAvailableProvinces(region.children || []);
            setAvailableDistricts(province.children || []);
            setSelectedDistrict("");
            reset({
              regionId: region.id.toString(),
              provinceId: province.id.toString(),
              districtId: "",
              price: response.price,
            });
          }
        } else {
          const region = findRegionById(parseInt(response.districtId));
          if (region) {
            setSelectedRegion(region.id);
            setIsLimaRegion(region.name === "Lima");
            setAvailableProvinces(region.children || []);
            setAvailableDistricts([]);
            setSelectedDistrict("");
            reset({
              regionId: region.id.toString(),
              provinceId: "",
              districtId: "",
              price: response.price,
            });
          }
        }
      }
      setLoading(false);
    }
  }, [id, navigate, reset]);

  useEffect(() => {
    handleGetShippingRateById();
  }, [handleGetShippingRateById]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value ? parseInt(e.target.value) : null;
    const region = geolocation.regions.find((r) => r.id === regionId);

    setSelectedRegion(regionId);
    setSelectedProvince(null);
    setSelectedLevel(0);
    setSelectedDistrict("");
    setIsLimaRegion(region?.name === "Lima" || false);
    setIsLimaProvince(false);
    setValue("regionId", regionId?.toString() || "");
    setValue("provinceId", "");
    setValue("districtId", "");
    setAvailableProvinces(region?.children || []);
    setAvailableDistricts([]);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value ? parseInt(e.target.value) : null;
    const province = availableProvinces.find((p) => p.id === provinceId);

    setSelectedProvince(provinceId);
    setSelectedLevel(0);
    setSelectedDistrict("");
    setIsLimaProvince(province?.name === "Lima" || false);
    setValue("provinceId", provinceId?.toString() || "");
    setValue("districtId", "");
    setAvailableDistricts(province?.children || []);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const identifier = e.target.value;
    const district = findDistrictByIdentifier(identifier);
    if (district) {
      setSelectedLevel(district.level);
    }
    setSelectedDistrict(identifier);
    setValue("districtId", identifier);
  };

  const handleCancel = () => {
    navigate("/tarifas");
  };

  const validatePrice = (value: string) => {
    const num = parseFloat(value);
    if (!value) return "El precio es requerido";
    return (!isNaN(num) && num >= 0) || "El precio debe ser un número positivo";
  };

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);

    let districtId = data.regionId;
    let level = 1;

    if (isLimaRegion) {
      if (data.districtId && isLimaProvince) {
        districtId = data.districtId;
        level = selectedLevel;
      } else if (data.provinceId) {
        const province = findProvinceById(parseInt(data.provinceId));
        districtId = province
          ? `${province.name.toLowerCase().replace(/\s+/g, '_')}_${data.provinceId}`
          : data.provinceId;
        level = 2;
      }
    }

    const payload = {
      districtId,
      level,
      price: parseFloat(data.price),
    };

    const response = shippingRate
      ? await updateShippingRate(shippingRate.id, payload)
      : await createShippingRate(payload);

    setLoading(false);

    if (!response || response?.error) {
      toast.warning(response?.message || "Error al guardar la tarifa", {
        position: "top-center",
      });
      return;
    }

    toast.success(response?.message || "Tarifa guardada exitosamente", {
      position: "top-center",
    });
    navigate("/tarifas");
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl text-blue-600 font-bold mb-6">{title}</h1>

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
                  {...register("regionId", {
                    required: "Departamento es requerido",
                  })}
                  value={selectedRegion?.toString() || ""}
                  onChange={handleRegionChange}
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
                    value={selectedProvince?.toString() || ""}
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
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
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
                    validate: validatePrice,
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