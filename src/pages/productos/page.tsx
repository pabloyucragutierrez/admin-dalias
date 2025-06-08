import { Loader2, Plus, X } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { activeOrInactiveProduct, deleteProduct } from '@/services/products.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import type { Product } from '@/interfaces/products.interface';
import { DataTable } from '@/components/data-table';
import FilterProducts from './ui/FilterProducts';
import { columnFilter, columnNames, getColumns, stateFilter } from './ui/columns';

export default function ProductsPage() {
  const navigate = useNavigate();
  const {
    products,
    loading,
    error,
    hasMore,
    fetchMoreProducts,
    selectedProducts,
    toggleProductSelection,
    selectAllProducts,
    refreshProducts,
    applyFilters,
    clearFilters,
    filters,
  } = useProducts();

  const [productSelect, setProductSelect] = useState<Product | null>(null);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const refreshDataTable = useRef<() => void>(null);

  const handleChangeStatus = async (product: Product) => {
    setShowModalStatus(true);
    setProductSelect(product);
  };

  const handleDelete = async (product: Product) => {
    setShowModalDelete(true);
    setProductSelect(product);
  };

  const changeStatusFn = async () => {
    setLoadingStatus(true);

    const response = await activeOrInactiveProduct(productSelect?.id || '', {
      status: !productSelect?.status,
    });

    setLoadingStatus(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    refreshProducts();
    refreshDataTable.current?.();
    handleCancelStatus();
  };

  const deleteFn = async () => {
    setLoadingDelete(true);

    const response = await deleteProduct(productSelect?.id || '');

    setLoadingDelete(false);

    if (!response?.success) {
      toast.warning(response?.message, { position: 'top-center' });
      return;
    }

    toast.success(response?.message, { position: 'top-center' });
    refreshProducts();
    refreshDataTable.current?.();
    handleCancelDelete();
  };

  const handleCancelStatus = () => {
    setShowModalStatus(false);
    setProductSelect(null);
  };

  const handleCancelDelete = () => {
    setShowModalDelete(false);
    setProductSelect(null);
  };

  return (
    <>
      <div className="flex sm:flex-row flex-col sm:gap-0 gap-2 sm:items-center justify-between">
        <h1 className="text-4xl text-blue-600 font-bold">Productos</h1>
        <Button
          className="bg-blue-600 flex flex-row items-center gap-2 text-white hover:bg-blue-700"
          onClick={() => navigate('/products/new')}
        >
          <Plus size={20} />
          Nuevo Producto
        </Button>
      </div>

      <FilterProducts
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        initialFilters={filters}
        loading={loading}
      />

      {selectedProducts.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md flex flex-row items-center w-full justify-between mt-10">
          <p className="text-blue-800">
            {selectedProducts.length} producto
            {selectedProducts.length !== 1 ? 's' : ''} seleccionado
            {selectedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="container mx-auto py-5">
        <DataTable
          columns={getColumns(handleChangeStatus, handleDelete)}
          columnNames={columnNames}
          url="products"
          typeFilter={columnFilter}
          stateFilter={stateFilter}
          onRefresh={(callback) => {
            refreshDataTable.current = callback;
          }}
        />
      </div>

      {showModalStatus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Cambio de estado</h2>
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleCancelStatus}
              >
                <X />
              </button>
            </div>

            <hr className="mt-1 mb-4" />

            <p className="text-gray-600 font-medium">
              ¿Estás seguro de que deseas{' '}
              {productSelect?.status ? 'desactivar' : 'activar'} el producto:{' '}
              {productSelect?.name}?
            </p>

            <div className="flex justify-between items-center m-auto gap-5 mt-5">
              <Button
                onClick={handleCancelStatus}
                type="button"
                variant="outline"
                disabled={loadingStatus}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={changeStatusFn}
                disabled={loadingStatus}
              >
                {loadingStatus ? (
                  <div className="inline-flex gap-2">
                    <Loader2 className="animate-spin" />
                    Cambiando estado...
                  </div>
                ) : (
                  'Aceptar'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showModalDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[400px]">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Eliminar producto</h2>
              <button
                type="button"
                className="cursor-pointer"
                onClick={handleCancelDelete}
              >
                <X />
              </button>
            </div>

            <hr className="mt-1 mb-4" />

            <p className="text-gray-600 font-medium">
              ¿Estás seguro de que deseas eliminar el producto:{' '}
              {productSelect?.name}?
            </p>

            <div className="flex justify-between items-center m-auto gap-5 mt-5">
              <Button
                onClick={handleCancelDelete}
                type="button"
                variant="outline"
                disabled={loadingDelete}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={deleteFn}
                disabled={loadingDelete}
                variant="destructive"
              >
                {loadingDelete ? (
                  <div className="inline-flex gap-2">
                    <Loader2 className="animate-spin" />
                    Eliminando...
                  </div>
                ) : (
                  'Eliminar'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}