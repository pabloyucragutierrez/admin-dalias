import { Badge } from "@/components/ui/badge";
import type { Sucursales } from "@/interfaces/sucursales.interface";
import { formatDateTime } from "@/utils";
import { BadgeCheck, ChevronDown, Edit, FolderX, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

interface SucursalesTableProps {
  sucursales: Sucursales[];
  loading: boolean;
  hasMore: boolean;
  fetchMoreSucursales: () => void;
  selectedSucursales: string[];
  toggleSucursalSelection: (id: string) => void;
  selectAllSucursales: () => void;
  changeStatusFn: (sucursal: Sucursales) => void;
  deleteFn: (sucursal: Sucursales) => void;
}

interface ColumnVisibility {
  [key: string]: boolean;
}

const SucursalesTable: React.FC<SucursalesTableProps> = ({
  sucursales,
  loading,
  hasMore,
  fetchMoreSucursales,
  selectedSucursales,
  changeStatusFn,
  deleteFn,
}) => {
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);

  const availableColumns = [
    { id: "code", label: "Código" },
    { id: "name", label: "Nombre" },
    { id: "district", label: "Distrito" },
    { id: "address", label: "Dirección" },
    { id: "phone", label: "Teléfono" },
    { id: "createAt", label: "Fecha de creación" },
  ];

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(
    () => {
      const initialVisibility: ColumnVisibility = {};
      availableColumns.forEach((column) => {
        initialVisibility[column.id] = true;
      });
      return initialVisibility;
    }
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const lastSucursalRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreSucursales();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, fetchMoreSucursales]
  );

  const uniqueSucursales = useMemo(() => {
    const seen = new Set();
    return sucursales.filter((sucursal) => {
      const duplicate = seen.has(sucursal.id);
      seen.add(sucursal.id);
      return !duplicate;
    });
  }, [sucursales]);

  return (
    <div className="my-10">
      <div className="w-full flex justify-end mb-4">
        <div className="flex justify-end relative" ref={dropdownRef}>
          <div
            className="border border-gray-300 rounded-md py-2 px-4 flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>Columnas</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md z-10 border border-gray-200">
              <div className="p-3 min-w-[240px]">
                {availableColumns.map((column) => (
                  <div
                    key={column.id}
                    className="flex items-center gap-2 py-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id={`column-${column.id}`}
                      checked={columnVisibility[column.id]}
                      onChange={() => toggleColumnVisibility(column.id)}
                      className="rounded border-gray-300"
                    />
                    <label
                      htmlFor={`column-${column.id}`}
                      className="text-sm text-gray-700"
                    >
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden shadow-md sm:rounded-lg">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#f0f0f0] sticky top-0">
              <tr>
                {columnVisibility.code && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Código
                  </th>
                )}
                {columnVisibility.name && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nombre
                  </th>
                )}
                {columnVisibility.district && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Distrito
                  </th>
                )}
                {columnVisibility.address && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dirección
                  </th>
                )}
                {columnVisibility.phone && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Teléfono
                  </th>
                )}
                {columnVisibility.createAt && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Fecha de creación
                  </th>
                )}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uniqueSucursales.map((sucursal, index) => (
                <tr
                  key={`${sucursal.id}-${index}`}
                  ref={
                    index === uniqueSucursales.length - 1
                      ? lastSucursalRef
                      : null
                  }
                  className={
                    selectedSucursales.includes(sucursal.id) ? "bg-blue-50" : ""
                  }
                >
                  {columnVisibility.code && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {sucursal.code}
                      </div>
                    </td>
                  )}
                  {columnVisibility.name && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        className="text-sm font-medium text-gray-900 hover:underline hover:cursor-pointer"
                        onClick={() => navigate(`/sucursales/${sucursal.id}`)}
                      >
                        {sucursal.name}
                      </button>
                    </td>
                  )}
                  {columnVisibility.district && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {sucursal.district}
                      </div>
                    </td>
                  )}
                  {columnVisibility.address && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {sucursal.address}
                      </div>
                    </td>
                  )}
                  {columnVisibility.phone && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {sucursal.phone}
                      </div>
                    </td>
                  )}
                  {columnVisibility.createAt && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDateTime(sucursal.createAt)}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={sucursal.status ? "success" : "destructive"}
                    >
                      {sucursal.status ? "Activa" : "Inactiva"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-row items-center gap-2">
                      <button
                        type="button"
                        className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                        onClick={() => navigate(`/sucursales/${sucursal.id}`)}
                      >
                        <Edit size={20} className="text-blue-500" />
                      </button>
                      <button
                        type="button"
                        className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                        onClick={() => changeStatusFn(sucursal)}
                      >
                        {sucursal.status ? (
                          <FolderX size={20} className="text-red-500" />
                        ) : (
                          <BadgeCheck size={20} className="text-green-600" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                        onClick={() => deleteFn(sucursal)}
                      >
                        <Trash2 size={20} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SucursalesTable;
