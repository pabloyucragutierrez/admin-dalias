import { useCallback, useEffect, useState } from 'react';
import { fetchCategorias } from '@/services/categorias.service';
import type { Categorias, FilterOptionsCategorias } from '@/interfaces/categorias.interface';
export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptionsCategorias>({});

  const handleFetchCategorias = useCallback(
    async (refresh = false, newFilters?: FilterOptionsCategorias) => {
      if (loading && !refresh) return;

      try {
        setLoading(true);
        const currentFilters = newFilters !== undefined ? newFilters : filters;

        if (refresh || newFilters !== undefined) {
          setPage(1);
          setCategorias([]);
          setHasMore(true);
          if (newFilters !== undefined) {
            setFilters(newFilters);
          }

          const response = await fetchCategorias(1, 10, currentFilters);
          setCategorias(response.data);
          setHasMore(response.meta.hasMore);
          setPage(2);
        } else if (hasMore) {
          const response = await fetchCategorias(page, 10, currentFilters);
          const newCategorias = response.data.filter(
            (newCategoria: Categorias) =>
              !categorias.some((existingCategoria) => existingCategoria.id === newCategoria.id)
          );

          setCategorias((prev) => [...prev, ...newCategorias]);
          setHasMore(response.meta.hasMore);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        setError('Error al cargar las categorías');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page, categorias, filters]
  );

  useEffect(() => {
    handleFetchCategorias();
  }, []);

  const toggleCategoriaSelection = (categoriaId: string) => {
    setSelectedCategorias((prev) => {
      if (prev.includes(categoriaId)) {
        return prev.filter((id) => id !== categoriaId);
      } else {
        return [...prev, categoriaId];
      }
    });
  };

  const selectAllCategorias = () => {
    if (selectedCategorias.length === categorias.length) {
      setSelectedCategorias([]);
    } else {
      setSelectedCategorias(categorias.map((categoria) => categoria.id));
    }
  };

  const clearSelections = () => {
    setSelectedCategorias([]);
  };

  const refreshCategorias = async () => {
    clearSelections();
    await handleFetchCategorias(true);
  };

  const applyFilters = async (newFilters: FilterOptionsCategorias) => {
    clearSelections();
    await handleFetchCategorias(true, newFilters);
  };

  const clearFilters = async () => {
    clearSelections();
    await handleFetchCategorias(true, {});
  };

  return {
    categorias,
    loading,
    error,
    hasMore,
    filters,
    fetchMoreCategorias: fetchCategorias,
    selectedCategorias,
    toggleCategoriaSelection,
    selectAllCategorias,
    refreshCategorias,
    clearSelections,
    applyFilters,
    clearFilters,
    isAllSelected: categorias.length > 0 && selectedCategorias.length === categorias.length,
  };
};