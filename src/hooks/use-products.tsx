import { useCallback, useEffect, useState } from 'react';
import type { FilterOptionsProducts, Product } from '@/interfaces/products.interface';
import { fetchProducts } from '@/services/products.service';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptionsProducts>({});

  const handleFetchProducts = useCallback(
    async (refresh = false, newFilters?: FilterOptionsProducts) => {
      if (loading && !refresh) return;

      try {
        setLoading(true);
        const currentFilters = newFilters ?? filters;

        if (refresh || newFilters !== undefined) {
          setPage(1);
          setProducts([]);
          setHasMore(true);
          if (newFilters !== undefined) {
            setFilters(newFilters);
          }

          const response = await fetchProducts(1, 10, currentFilters);
          setProducts(response.data);
          setHasMore(response.meta.hasMore);
          setPage(2);
        } else if (hasMore) {
          const response = await fetchProducts(page, 10, currentFilters);
          const newProducts = response.data.filter(
            (newProduct: Product) => !products.some((existingProduct) => existingProduct.id === newProduct.id)
          );

          setProducts((prev) => [...prev, ...newProducts]);
          setHasMore(response.meta.hasMore);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError('Error al cargar los productos: ' + errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page, products, filters]
  );

  useEffect(() => {
    handleFetchProducts();
  }, [handleFetchProducts]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
    }
  };

  const clearSelections = () => {
    setSelectedProducts([]);
  };

  const refreshProducts = async () => {
    clearSelections();
    await handleFetchProducts(true);
  };

  const applyFilters = async (newFilters: FilterOptionsProducts) => {
    clearSelections();
    await handleFetchProducts(true, newFilters);
  };

  const clearFilters = async () => {
    clearSelections();
    await handleFetchProducts(true, {});
  };

  return {
    products,
    loading,
    error,
    hasMore,
    filters,
    fetchMoreProducts: handleFetchProducts,
    selectedProducts,
    toggleProductSelection,
    selectAllProducts,
    refreshProducts,
    clearSelections,
    applyFilters,
    clearFilters,
    isAllSelected: products.length > 0 && selectedProducts.length === products.length,
  };
};