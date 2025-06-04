import { Badge } from '@/components/ui/badge';
import type { Categorias } from '@/interfaces/categorias.interface';
import { formatDateTime } from '@/utils';
import { BadgeCheck, ChevronDown, Edit, FolderX } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface CategoriasTableProps {
  categorias: Categorias[];
  loading: boolean;
  hasMore: boolean;
  fetchMoreCategorias: () => void;
  selectedCategorias: string[];
  toggleCategoriaSelection: (id: string) => void;
  selectAllCategorias: () => void;
  changeStatusFn: (categoria: Categorias) => void;
  editFn: (categoria: Categorias) => void;
}

interface ColumnVisibility {
  [key: string]: boolean;
}

const CategoriasTable: React.FC<CategoriasTableProps> = ({
  categorias,
  loading,
  hasMore,
  fetchMoreCategorias,
  selectedCategorias,
  changeStatusFn,
  editFn,
}) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const availableColumns = [
    { id: 'name', label: 'Nombre' },
    { id: 'createAt', label: 'Fecha de creación' },
  ];

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(() => {
    const initialVisibility: ColumnVisibility = {};
    availableColumns.forEach((column) => {
      initialVisibility[column.id] = true;
    });
    return initialVisibility;
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const lastCategoriaRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreCategorias();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, fetchMoreCategorias]
  );

  const uniqueCategorias = useMemo(() => {
    const seen = new Set();
    return categorias.filter((categoria) => {
      const duplicate = seen.has(categoria.id);
      seen.add(categoria.id);
      return !duplicate;
    });
  }, [categorias]);

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
              className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-md z-10 border border-gray-200">
              <div className="p-3 min-w-[240px]">
                {availableColumns.map((column) => (
                  <div key={column.id} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`column-${column.id}`}
                      checked={columnVisibility[column.id]}
                      onChange={() => toggleColumnVisibility(column.id)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`column-${column.id}`} className="text-sm text-gray-700">
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
              {uniqueCategorias.map((categoria, index) => (
                <tr
                  key={`${categoria.id}-${index}`}
                  ref={index === uniqueCategorias.length - 1 ? lastCategoriaRef : null}
                  className={selectedCategorias.includes(categoria.id) ? 'bg-blue-50' : ''}
                >
                  {columnVisibility.name && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        className="text-sm font-medium text-gray-900 hover:underline hover:cursor-pointer"
                        onClick={() => editFn(categoria)}
                      >
                        {categoria.name}
                      </button>
                    </td>
                  )}
                  {columnVisibility.createAt && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDateTime(categoria.createAt)}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={categoria.status ? 'success' : 'destructive'}>
                      {categoria.status ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-row items-center gap-2">
                      <button
                        type="button"
                        className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                        onClick={() => editFn(categoria)}
                      >
                        <Edit size={20} className="text-blue-500" />
                      </button>
                      <button
                        type="button"
                        className="w-full flex flex-row items-center gap-2 py-1 cursor-pointer"
                        onClick={() => changeStatusFn(categoria)}
                      >
                        {categoria.status ? (
                          <FolderX size={20} className="text-red-500" />
                        ) : (
                          <BadgeCheck size={20} className="text-green-600" />
                        )}
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

export default CategoriasTable;