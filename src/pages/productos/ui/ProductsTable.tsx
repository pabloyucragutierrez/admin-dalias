import { Badge } from '@/components/ui/badge';
import type { Product } from '@/interfaces/products.interface';
import { formatDateTime } from '@/utils';
import { ChevronDown, Edit, FolderX, BadgeCheck, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  fetchMoreProducts: () => void;
  selectedProducts: string[];
  toggleProductSelection: (id: string) => void;
  selectAllProducts: () => void;
  changeStatusFn: (product: Product) => void;
  deleteFn: (product: Product) => void;
}

interface ColumnVisibility {
  [key: string]: boolean;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  loading,
  hasMore,
  fetchMoreProducts,
  selectedProducts,
  toggleProductSelection,
  selectAllProducts,
  changeStatusFn,
  deleteFn,
}) => {
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver | null>(null);

  const availableColumns = [
    { id: 'image', label: 'Imagen' },
    { id: 'sku', label: 'SKU' },
    { id: 'name', label: 'Nombre' },
    { id: 'codeBarras', label: 'Código de Barras' },
    { id: 'price', label: 'Precio' },
    { id: 'stock', label: 'Stock' },
    { id: 'createAt', label: 'Fecha de Creación' },
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

  const lastProductRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMoreProducts();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, fetchMoreProducts]
  );

  const uniqueProducts = useMemo(() => {
    const seen = new Set();
    return products.filter((product) => {
      const duplicate = seen.has(product.id);
      seen.add(product.id);
      return !duplicate;
    });
  }, [products]);

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
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === uniqueProducts.length && uniqueProducts.length > 0}
                    onChange={selectAllProducts}
                    className="rounded border-gray-300"
                  />
                </th>
                {columnVisibility.image && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagen
                  </th>
                )}
                {columnVisibility.sku && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                )}
                {columnVisibility.name && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                )}
                {columnVisibility.codeBarras && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código de Barras
                  </th>
                )}
                {columnVisibility.price && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                )}
                {columnVisibility.stock && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                )}
                {columnVisibility.createAt && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Creación
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uniqueProducts.map((product, index) => (
                <tr
                  key={`${product.id}-${index}`}
                  ref={index === uniqueProducts.length - 1 ? lastProductRef : null}
                  className={selectedProducts.includes(product.id) ? 'bg-blue-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProductSelection(product.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  {columnVisibility.image && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.ProductImages.find((img) => img.typeImage === 'THUMBNAIL')?.url || ''}
                        alt={product.name}
                        className="h-12 w-12 object-contain rounded"
                      />
                    </td>
                  )}
                  {columnVisibility.sku && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        className="text-sm font-medium text-gray-900 hover:underline hover:cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {product.sku}
                      </button>
                    </td>
                  )}
                  {columnVisibility.name && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.name}</div>
                    </td>
                  )}
                  {columnVisibility.codeBarras && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.codeBarras}</div>
                    </td>
                  )}
                  {columnVisibility.price && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">${product.price.toFixed(2)}</div>
                    </td>
                  )}
                  {columnVisibility.stock && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.stock}</div>
                    </td>
                  )}
                  {columnVisibility.createAt && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDateTime(product.createAt)}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={product.status ? 'success' : 'destructive'}>
                      {product.status ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-row items-center gap-2">
                      <button
                        type="button"
                        className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <Edit size={20} className="text-blue-500" />
                      </button>
                      <button
                        type="button"
                        className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                        onClick={() => changeStatusFn(product)}
                      >
                        {product.status ? (
                          <FolderX size={20} className="text-red-500" />
                        ) : (
                          <BadgeCheck size={20} className="text-green-600" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="flex flex-row items-center gap-2 py-1 cursor-pointer"
                        onClick={() => deleteFn(product)}
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

export default ProductsTable;