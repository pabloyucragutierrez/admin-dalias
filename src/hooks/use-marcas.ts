import { useCallback, useEffect, useState } from 'react';
import { fetchMarcas } from '@/services/marcas.service';
import type { FilterOptionsMarcas, Marcas } from '@/interfaces/marcas.interface';

export const useMarcas = () => {
  const [marcas, setMarcas] = useState<Marcas[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedMarcas, setSelectedMarcas] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterOptionsMarcas>({});

  const handleFetchMarcas = useCallback(
    async (refresh = false, newFilters?: FilterOptionsMarcas) => {
      if (loading && !refresh) return;

      try {
        setLoading(true);
        const currentFilters = newFilters !== undefined ? newFilters : filters;

        if (refresh || newFilters !== undefined) {
          setPage(1);
          setMarcas([]);
          setHasMore(true);
          if (newFilters !== undefined) {
            setFilters(newFilters);
          }

          const response = await fetchMarcas(1, 10, currentFilters);
          setMarcas(response.data);
          setHasMore(response.meta.hasMore);
          setPage(2);
        } else if (hasMore) {
          const response = await fetchMarcas(page, 10, currentFilters);
          const newMarcas = response.data.filter(
            (newMarca: Marcas) =>
              !marcas.some((existingMarca) => existingMarca.id === newMarca.id)
          );

          setMarcas((prev) => [...prev, ...newMarcas]);
          setHasMore(response.meta.hasMore);
          setPage((prevPage) => prevPage + 1);
        }
      } catch (err) {
        setError('Error al cargar las marcas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, page, marcas, filters]
  );

  useEffect(() => {
    handleFetchMarcas();
  }, []);

  const toggleMarcaSelection = (marcaId: string) => {
    setSelectedMarcas((prev) => {
      if (prev.includes(marcaId)) {
        return prev.filter((id) => id !== marcaId);
      } else {
        return [...prev, marcaId];
      }
    });
  };

  const selectAllMarcas = () => {
    if (selectedMarcas.length === marcas.length) {
      setSelectedMarcas([]);
    } else {
      setSelectedMarcas(marcas.map((marca) => marca.id));
    }
  };

  const clearSelections = () => {
    setSelectedMarcas([]);
  };

  const refreshMarcas = async () => {
    clearSelections();
    await handleFetchMarcas(true);
  };

  const applyFilters = async (newFilters: FilterOptionsMarcas) => {
    clearSelections();
    await handleFetchMarcas(true, newFilters);
  };

  const clearFilters = async () => {
    clearSelections();
    await handleFetchMarcas(true, {});
  };

  return {
    marcas,
    loading,
    error,
    hasMore,
    filters,
    fetchMoreMarcas: fetchMarcas,
    selectedMarcas,
    toggleMarcaSelection,
    selectAllMarcas,
    refreshMarcas,
    clearSelections,
    applyFilters,
    clearFilters,
    isAllSelected: marcas.length > 0 && selectedMarcas.length === marcas.length,
  };
};