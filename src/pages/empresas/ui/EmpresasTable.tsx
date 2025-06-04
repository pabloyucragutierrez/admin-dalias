import { Badge } from "@/components/ui/badge";
import type { Empresa } from "@/interfaces/empresas.interface";
import { formatDateTime } from "@/utils";
import { BadgeCheck, ChevronDown, Edit, FolderX, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

interface EmpresasTableProps {
  empresas: Empresa[];
  loading: boolean;
  hasMore: boolean;
  fetchMoreEmpresas: () => void;
  selectedEmpresas: string[];
  toggleEmpresaSelection: (id: string) => void;
  selectAllEmpresas: () => void;
  changeStatusFn: (empresa: Empresa) => void;
  deleteFn: (empresa: Empresa) => void;
}

interface ColumnVisibility {
  [key: string]: boolean;
}

const EmpresasTable: React.FC<EmpresasTableProps> = ({
  empresas,
  loading,
  hasMore,
  fetchMoreEmpresas,
  selectedEmpresas,
  changeStatusFn,
  deleteFn,
}) => {
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);

  const availableColumns = [
    { id: "name", label: "Nombre" },
    { id: "ruc", label: "RUC" },
    { id: "razonSocial", label: "Razón Social" },
    { id: "district", label: "Distrito" },
    { id: "phone", label: "Teléfono" },
    { id: "email", label: "Email" },
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

  const lastEmpresaRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreEmpresas();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, fetchMoreEmpresas]
  );

  const uniqueEmpresas = useMemo(() => {
    const seen = new Set();
    return empresas.filter((empresa) => {
      const duplicate = seen.has(empresa.id);
      seen.add(empresa.id);
      return !duplicate;
    });
  }, [empresas]);

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
                {columnVisibility.name && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nombre
                  </th>
                )}
                {columnVisibility.ruc && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    RUC
                  </th>
                )}
                {columnVisibility.razonSocial && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Razón Social
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
                {columnVisibility.phone && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Teléfono
                  </th>
                )}
                {columnVisibility.email && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
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
              {uniqueEmpresas.map((empresa, index) => (
                <tr
                  key={`${empresa.id}-${index}`}
                  ref={
                    index === uniqueEmpresas.length - 1 ? lastEmpresaRef : null
                  }
                  className={
                    selectedEmpresas.includes(empresa.id) ? "bg-blue-50" : ""
                  }
                >
                  {columnVisibility.name && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        className="text-sm font-medium text-gray-900 hover:underline hover:cursor-pointer"
                        onClick={() => navigate(`/empresas/${empresa.id}`)}
                      >
                        {empresa.name}
                      </button>
                    </td>
                  )}
                  {columnVisibility.ruc && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{empresa.ruc}</div>
                    </td>
                  )}
                  {columnVisibility.razonSocial && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {empresa.razonSocial}
                      </div>
                    </td>
                  )}
                  {columnVisibility.district && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {empresa.district}
                      </div>
                    </td>
                  )}
                  {columnVisibility.phone && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {empresa.phone}
                      </div>
                    </td>
                  )}
                  {columnVisibility.email && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {empresa.email}
                      </div>
                    </td>
                  )}
                  {columnVisibility.createAt && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDateTime(empresa.createAt)}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={empresa.status ? "success" : "destructive"}>
                      {empresa.status ? "Activa" : "Inactiva"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-row items-center gap-2">
                      <button
                        type="button"
                        className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                        onClick={() => navigate(`/empresas/${empresa.id}`)}
                      >
                        <Edit size={20} className="text-blue-500" />
                      </button>
                      <button
                        type="button"
                        className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                        onClick={() => changeStatusFn(empresa)}
                      >
                        {empresa.status ? (
                          <FolderX size={20} className="text-red-500" />
                        ) : (
                          <BadgeCheck size={20} className="text-green-600" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                        onClick={() => deleteFn(empresa)}
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

export default EmpresasTable;