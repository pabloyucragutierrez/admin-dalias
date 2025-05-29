import React, { useState } from "react";
import type { FilterOptionsCategorias } from "@/interfaces/categorias.interface";

interface FilterCategoriasProps {
  onApplyFilters: (filters: FilterOptionsCategorias) => void;
  onClearFilters: () => void;
  initialFilters?: FilterOptionsCategorias;
  loading: boolean;
}

const FilterCategorias: React.FC<FilterCategoriasProps> = ({
  onApplyFilters,
  onClearFilters,
  initialFilters = {},
  loading,
}) => {
  const [filters, setFilters] = useState<FilterOptionsCategorias>({
    name: initialFilters.name || "",
    state: initialFilters.state || "",
  });

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
    const nonEmptyFilters: FilterOptionsCategorias = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        nonEmptyFilters[key as keyof FilterOptionsCategorias] = value.trim();
      }
    });

    onApplyFilters(nonEmptyFilters);
  };

  const handleClear = () => {
    setFilters({
      name: "",
      state: "",
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
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Estado
            </label>
            <select
              id="state"
              name="state"
              value={filters.state}
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
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
              {key === "state" && <span className="mr-1">Estado: </span>}
              {value}
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

export default FilterCategorias;