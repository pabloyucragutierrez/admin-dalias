import React, { useState } from "react";
import type { FilterOptionsUsers } from "@/interfaces/users.interface";

interface FilterUsersProps {
  onApplyFilters: (filters: FilterOptionsUsers) => void;
  onClearFilters: () => void;
  initialFilters?: FilterOptionsUsers;
  loading: boolean;
}

const FilterUsers: React.FC<FilterUsersProps> = ({
  onApplyFilters,
  onClearFilters,
  initialFilters = {},
  loading,
}) => {
  const [filters, setFilters] = useState<FilterOptionsUsers>({
    name: initialFilters.name || "",
    lastName: initialFilters.lastName || "",
    email: initialFilters.email || "",
    gender: initialFilters.gender || "",
    documentType: initialFilters.documentType || "",
    documentNumber: initialFilters.documentNumber || "",
    state: initialFilters.state || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev: FilterOptionsUsers) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nonEmptyFilters: FilterOptionsUsers = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        nonEmptyFilters[key as keyof FilterOptionsUsers] = value.trim();
      }
    });

    onApplyFilters(nonEmptyFilters);
  };

  const handleClear = () => {
    setFilters({
      name: "",
      lastName: "",
      email: "",
      gender: "",
      documentType: "",
      documentNumber: "",
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
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={filters.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por apellido"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={filters.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por email"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Género
            </label>
            <select
              id="gender"
              name="gender"
              value={filters.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="documentType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo de Documento
            </label>
            <select
              id="documentType"
              name="documentType"
              value={filters.documentType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
              <option value="Carnet de Extranjería">
                Carnet de Extranjería
              </option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Cédula de Identidad">Cédula de Identidad</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="documentNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nº Documento
            </label>
            <input
              type="text"
              id="documentNumber"
              name="documentNumber"
              value={filters.documentNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por número de documento"
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
              {key === "lastName" && <span className="mr-1">Apellido: </span>}
              {key === "email" && <span className="mr-1">Email: </span>}
              {key === "gender" && <span className="mr-1">Género: </span>}
              {key === "documentType" && (
                <span className="mr-1">Tipo de Documento: </span>
              )}
              {key === "documentNumber" && (
                <span className="mr-1">Nº Documento: </span>
              )}
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

export default FilterUsers;
