import React, { useState, useEffect } from "react";
import type { FilterOptionsProducts } from "@/interfaces/products.interface";
import { fetchActiveBrands } from "@/services/products.service";
import type { Brand } from "@/interfaces/products.interface";

interface FilterProductsProps {
  onApplyFilters: (filters: FilterOptionsProducts) => void;
  onClearFilters: () => void;
  initialFilters?: FilterOptionsProducts;
  loading: boolean;
}

const FilterProducts: React.FC<FilterProductsProps> = ({
  onApplyFilters,
  onClearFilters,
  initialFilters = {},
  loading,
}) => {
  const [filters, setFilters] = useState<FilterOptionsProducts>({
    name: initialFilters.name || "",
    sku: initialFilters.sku || "",
    marca: initialFilters.marca || "",
    status: initialFilters.status || "",
  });
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const activeBrands = await fetchActiveBrands();
        setBrands(activeBrands || []);
      } catch (err) {
        console.error("Error al cargar marcas:", err);
      }
    };
    loadBrands();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filtrar campos vacíos
    const nonEmptyFilters: FilterOptionsProducts = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        nonEmptyFilters[key as keyof FilterOptionsProducts] = value.trim();
      }
    });

    onApplyFilters(nonEmptyFilters);
  };

  const handleClear = () => {
    setFilters({
      name: "",
      sku: "",
      marca: "",
      status: "",
    });
    onClearFilters();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filtros</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={filters.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por nombre"
            />
          </div>

          <div>
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              SKU
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={filters.sku}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por SKU"
            />
          </div>

          <div>
            <label
              htmlFor="marca"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Marca
            </label>
            <select
              id="marca"
              name="marca"
              value={filters.marca}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              <option value="ACTIVO">Activo</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            disabled={loading}
          >
            Limpiar filtros
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#003e5c] hover:bg-[#003e5c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Aplicar filtros"}
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mt-4">
        {Object.entries(initialFilters).map(([key, value]) =>
          value ? (
            <div
              key={key}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
            >
              {key === "name" && <span className="mr-1">Nombre: </span>}
              {key === "sku" && <span className="mr-1">SKU: </span>}
              {key === "marca" && (
                <span className="mr-1">
                  Marca: {brands.find((b) => b.id === value)?.name || value}
                </span>
              )}
              {key === "status" && <span className="mr-1">Estado: </span>}
              {key !== "marca" && value}
            </div>
          ) : null
        )}

        {Object.values(initialFilters).some((v) => v) && (
          <button
            onClick={handleClear}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
          >
            Limpiar todo
          </button>
        )}

        {!Object.values(initialFilters).some((v) => v) && (
          <span className="text-sm text-gray-500">No hay filtros activos</span>
        )}
      </div>
    </div>
  );
};

export default FilterProducts;