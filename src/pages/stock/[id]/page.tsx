import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import Select from "react-select";
import { createStock } from "@/services/stock.service";
import type { OptionSelect, Product } from "@/interfaces";
import type { FormManagementStockInputs } from "@/interfaces/management-stock.interface";
import { getProductCombo } from "@/services/products.service";

const typeManagementStock: OptionSelect[] = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "VENTA", label: "Venta" },
];

export default function StockByIdPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<OptionSelect[]>([]);
  const [productsAll, setProductsAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getListProduct = useCallback(async () => {
    const response = await getProductCombo();
    if (!response) {
      return;
    }

    const filteredProducts = response.filter((product) => {
      if (product.typeProduct === "VARIATION" && product.fatherId === null) {
        return false;
      }
      return true;
    });

    setProductsAll(filteredProducts);
    const options: OptionSelect[] = filteredProducts.map((product) => {
      if (product.typeProduct === "SIMPLE" || product.fatherId === null) {
        return {
          value: product.id,
          label: `${product.name} | Stock: ${
            product.father?.stockProducts?.[0]?.stock ?? product.stockProducts?.[0]?.stock ?? 0
          }`,
        };
      }

      return {
        value: product.id,
        label: `${
          product.father?.name ?? "Unknown"
        } | Variación: ${
          product.terminoProducts?.[0]?.termino?.name ?? "Unknown"
        } | Stock: ${product.stockProducts?.[0]?.stock ?? 0}`,
      };
    });

    setProducts(options);
  }, []);

  useEffect(() => {
    getListProduct();
  }, [getListProduct]);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormManagementStockInputs>({
    defaultValues: {
      productId: null,
      quantity: 0,
      status: null,
    },
  });

  const onSubmit = async (values: FormManagementStockInputs) => {
    if (values.quantity <= 0) {
      toast.warning("La cantidad debe ser mayor a 0", { position: "top-center" });
      return;
    }

    let valid: boolean = false;

    if (values.status?.value === "VENTA") {
      const product = productsAll.find(
        (product) => product.id === values.productId?.value
      );

      if (!product) {
        valid = true;
        toast.warning("Producto no encontrado", { position: "top-center" });
        return;
      }

      const stockActual = product.stockProducts?.[0]?.stock ?? 0;

      if (values.quantity > stockActual) {
        valid = true;
        toast.warning("No hay stock disponible", { position: "top-center" });
        return;
      }
    }

    if (valid) {
      return;
    }

    setLoading(true);

    const response = await createStock({
      productId: values.productId?.value || "",
      quantity: Number(values.quantity),
      status: values.status?.value || "",
    });

    setLoading(false);

    if (!response?.success) {
      toast.warning(response?.message || "Error al guardar el stock", { position: "top-center" });
      return;
    }

    toast.success(response?.message, { position: "top-center" });
    navigate("/stock");
  };

  const handleCancel = () => {
    navigate("/producto");
  };

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl text-blue-600 font-bold mb-6">Nuevo Manejo de Stock</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="border rounded-lg p-6 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Información del Stock
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="productId">Producto</Label>
                <Controller
                  name="productId"
                  control={control}
                  rules={{ required: "Producto es requerido" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={products}
                      isClearable
                      isSearchable
                      classNamePrefix="select"
                      placeholder="Selecciona el producto"
                      className="text-base"
                    />
                  )}
                />
                {errors.productId && (
                  <p className="text-red-600 text-sm">{errors.productId.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={0}
                  placeholder="Cantidad"
                  className="w-full text-base py-2"
                  {...register("quantity", {
                    required: "Cantidad es requerida",
                  })}
                />
                {errors.quantity && (
                  <p className="text-red-600 text-sm">{errors.quantity.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="status">Tipo de Manejo</Label>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Tipo de Manejo es requerido" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={typeManagementStock}
                      isClearable
                      isSearchable
                      classNamePrefix="select"
                      placeholder="Selecciona el tipo de manejo"
                      className="text-base"
                    />
                  )}
                />
                {errors.status && (
                  <p className="text-red-600 text-sm">{errors.status.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="text-base py-2 px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="text-base py-2 px-6"
            >
              {loading ? (
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