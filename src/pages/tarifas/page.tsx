import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { geolocation } from "../../utils/geolocation";
import { Edit, Trash2, Loader2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Link } from "react-router";
import type { ShippingRate } from "@/interfaces/shipping-rate.interface";

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

const Tarifas: React.FC = () => {
  const navigate = useNavigate();
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>(staticShippingRates);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const getLocationNames = (districtId: string) => {
    const region = geolocation.regions.find((r) => r.id.toString() === districtId);
    if (region) {
      return {
        districtName: "",
        provinceName: "",
        regionName: region.name,
      };
    }

    const provinceIdMatch = districtId.split('_').pop();
    const provinceId = provinceIdMatch || districtId;
    for (const region of geolocation.regions) {
      const province = region.children?.find((p) => p.id.toString() === provinceId);
      if (province) {
        return {
          districtName: "",
          provinceName: province.name,
          regionName: region.name,
        };
      }
    }

    for (const region of geolocation.regions) {
      for (const province of region.children || []) {
        const district = province.children?.find((d) => d.identifier === districtId);
        if (district) {
          return {
            districtName: district.name,
            provinceName: province.name,
            regionName: region.name,
          };
        }
      }
    }

    return {
      districtName: "Desconocido",
      provinceName: "Desconocido",
      regionName: "Desconocido",
    };
  };

  const handleDelete = (id: string) => {
    setIsDeleting(id);
    setTimeout(() => {
      staticShippingRates = staticShippingRates.filter((r) => r.id !== id);
      setShippingRates([...staticShippingRates]);
      setIsDeleting(null);
      toast.success("Tarifa eliminada correctamente", { position: "top-center" });
    }, 500);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Tarifas de Envío</h1>
        <Button
          className="bg-blue-600 flex flex-row items-center gap-2 text-white hover:bg-blue-700"
          onClick={() => navigate("/tarifas/new")}
        >
          <Plus size={20} />
          Nueva Tarifa
        </Button>
      </div>
      <div className="mt-6">
        {shippingRates.length === 0 ? (
          <div className="text-center text-gray-500">
            No hay tarifas registradas
          </div>
        ) : (
          <ul className="space-y-4">
            {shippingRates.map((rate) => {
              const locationNames = getLocationNames(rate.districtId);
              return (
                <li
                  key={rate.id}
                  className="flex items-center justify-between p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {locationNames.districtName
                        ? `${locationNames.districtName}, `
                        : ""}
                      {locationNames.provinceName
                        ? `${locationNames.provinceName}, `
                        : ""}
                      {locationNames.regionName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Precio: S/ {rate.price}
                    </p>
                    <p className="text-sm text-gray-600">
                      Estado: {rate.status ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/tarifas/${rate.id}`}
                      className="flex items-center"
                    >
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="text-red-600 hover:text-red-800"
                          disabled={isDeleting === rate.id}
                        >
                          {isDeleting === rate.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Estás absolutamente seguro?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará permanentemente la tarifa de envío.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(rate.id)}
                            className="gap-2 bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default Tarifas;